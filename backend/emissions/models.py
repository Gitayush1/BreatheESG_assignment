from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Organization(models.Model):
    """Multi-tenancy support for different organizations"""
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class DataSource(models.Model):
    """Represents different data sources (SAP, Utility, Corporate Travel)"""
    SOURCE_TYPES = [
        ('SAP', 'SAP'),
        ('UTILITY', 'Utility'),
        ('CORPORATE_TRAVEL', 'Corporate Travel'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='data_sources')
    name = models.CharField(max_length=255)
    source_type = models.CharField(max_length=50, choices=SOURCE_TYPES)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.source_type})"

    class Meta:
        ordering = ['organization', 'name']


class EmissionRecord(models.Model):
    """Normalized emission records - the source of truth"""
    SCOPE_CHOICES = [
        ('SCOPE_1', 'Scope 1 - Direct Emissions'),
        ('SCOPE_2', 'Scope 2 - Indirect Emissions (Energy)'),
        ('SCOPE_3', 'Scope 3 - Other Indirect Emissions'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='emission_records')
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='emission_records')
    
    # Core emission data
    activity_date = models.DateField()
    scope = models.CharField(max_length=20, choices=SCOPE_CHOICES)
    category = models.CharField(max_length=255)  # e.g., "Electricity", "Natural Gas", "Air Travel"
    activity_type = models.CharField(max_length=255)  # e.g., "Consumption", "Distance Traveled"
    
    # Quantity and units
    quantity = models.DecimalField(max_digits=15, decimal_places=4)
    unit = models.CharField(max_length=50)  # e.g., "kWh", "km", "liters"
    
    # Emissions calculation
    co2_emissions_kg = models.DecimalField(max_digits=15, decimal_places=4)
    emission_factor = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    emission_factor_source = models.CharField(max_length=255, blank=True)
    
    # Location and facility
    facility = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # Review workflow
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_emissions')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)
    
    # Audit trail
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_emissions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional metadata
    metadata = models.JSONField(default=dict, blank=True)  # For source-specific fields

    def __str__(self):
        return f"{self.activity_date} - {self.category} - {self.co2_emissions_kg} kg CO2"

    class Meta:
        ordering = ['-activity_date', '-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['activity_date']),
            models.Index(fields=['scope']),
        ]


class RawDataUpload(models.Model):
    """Tracks raw data file uploads before normalization"""
    STATUS_CHOICES = [
        ('UPLOADED', 'Uploaded'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='uploads')
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='uploads')
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    original_filename = models.CharField(max_length=255)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPLOADED')
    records_processed = models.IntegerField(default=0)
    records_created = models.IntegerField(default=0)
    records_failed = models.IntegerField(default=0)
    error_log = models.TextField(blank=True)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.original_filename} - {self.status}"

    class Meta:
        ordering = ['-uploaded_at']


class AuditLog(models.Model):
    """Audit trail for all changes to emission records"""
    ACTION_CHOICES = [
        ('CREATE', 'Created'),
        ('UPDATE', 'Updated'),
        ('DELETE', 'Deleted'),
        ('APPROVE', 'Approved'),
        ('REJECT', 'Rejected'),
    ]

    emission_record = models.ForeignKey(EmissionRecord, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(default=dict, blank=True)  # Store what changed
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} - {self.emission_record} - {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']

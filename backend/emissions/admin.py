from django.contrib import admin
from .models import Organization, DataSource, EmissionRecord, RawDataUpload, AuditLog


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'source_type', 'organization', 'is_active', 'created_at']
    list_filter = ['source_type', 'is_active', 'organization']
    search_fields = ['name', 'description']


@admin.register(EmissionRecord)
class EmissionRecordAdmin(admin.ModelAdmin):
    list_display = ['activity_date', 'category', 'scope', 'co2_emissions_kg', 'status', 'organization']
    list_filter = ['status', 'scope', 'organization', 'data_source']
    search_fields = ['category', 'facility', 'location']
    date_hierarchy = 'activity_date'
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RawDataUpload)
class RawDataUploadAdmin(admin.ModelAdmin):
    list_display = ['original_filename', 'data_source', 'status', 'records_created', 'uploaded_at']
    list_filter = ['status', 'data_source', 'organization']
    readonly_fields = ['uploaded_at', 'processed_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['emission_record', 'action', 'user', 'timestamp']
    list_filter = ['action', 'timestamp']
    readonly_fields = ['timestamp']

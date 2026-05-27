from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Organization, DataSource, EmissionRecord, RawDataUpload, AuditLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


class DataSourceSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = DataSource
        fields = '__all__'


class EmissionRecordSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = EmissionRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'created_by']


class EmissionRecordReviewSerializer(serializers.ModelSerializer):
    """Serializer for reviewing emission records"""
    class Meta:
        model = EmissionRecord
        fields = ['status', 'review_notes']

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.review_notes = validated_data.get('review_notes', instance.review_notes)
        instance.reviewed_by = self.context['request'].user
        from django.utils import timezone
        instance.reviewed_at = timezone.now()
        instance.save()
        
        # Create audit log
        AuditLog.objects.create(
            emission_record=instance,
            action='APPROVE' if instance.status == 'APPROVED' else 'REJECT',
            user=self.context['request'].user,
            notes=instance.review_notes
        )
        
        return instance


class RawDataUploadSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    data_source_name = serializers.CharField(source='data_source.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = RawDataUpload
        fields = '__all__'
        read_only_fields = ['uploaded_at', 'processed_at', 'uploaded_by', 'status', 
                           'records_processed', 'records_created', 'records_failed', 'error_log']


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    emission_record_summary = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = '__all__'

    def get_emission_record_summary(self, obj):
        return f"{obj.emission_record.activity_date} - {obj.emission_record.category}"

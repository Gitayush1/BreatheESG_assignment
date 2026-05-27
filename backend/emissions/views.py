from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Organization, DataSource, EmissionRecord, RawDataUpload, AuditLog
from .serializers import (
    OrganizationSerializer, DataSourceSerializer, EmissionRecordSerializer,
    RawDataUploadSerializer, AuditLogSerializer, UserSerializer,
    EmissionRecordReviewSerializer
)
from .ingestion import DataIngestionService


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint that returns auth token"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint that deletes auth token"""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """Get current user info"""
    return Response(UserSerializer(request.user).data)


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for Organization model"""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']


class DataSourceViewSet(viewsets.ModelViewSet):
    """ViewSet for DataSource model"""
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'source_type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class EmissionRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for EmissionRecord model"""
    queryset = EmissionRecord.objects.all()
    serializer_class = EmissionRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['organization', 'data_source', 'scope', 'status', 'activity_date']
    search_fields = ['category', 'facility', 'location']
    ordering_fields = ['activity_date', 'co2_emissions_kg', 'created_at']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Review an emission record (approve/reject)"""
        emission_record = self.get_object()
        serializer = EmissionRecordReviewSerializer(
            emission_record,
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(EmissionRecordSerializer(emission_record).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get emission statistics"""
        queryset = self.filter_queryset(self.get_queryset())
        
        stats = {
            'total_records': queryset.count(),
            'total_emissions_kg': queryset.aggregate(Sum('co2_emissions_kg'))['co2_emissions_kg__sum'] or 0,
            'by_scope': {},
            'by_status': {},
            'pending_review': queryset.filter(status='PENDING').count(),
        }
        
        # Group by scope
        for scope_choice in EmissionRecord.SCOPE_CHOICES:
            scope_code = scope_choice[0]
            scope_data = queryset.filter(scope=scope_code).aggregate(
                count=Count('id'),
                total_emissions=Sum('co2_emissions_kg')
            )
            stats['by_scope'][scope_code] = {
                'count': scope_data['count'],
                'total_emissions_kg': float(scope_data['total_emissions'] or 0)
            }
        
        # Group by status
        for status_choice in EmissionRecord.STATUS_CHOICES:
            status_code = status_choice[0]
            count = queryset.filter(status=status_code).count()
            stats['by_status'][status_code] = count
        
        return Response(stats)


class RawDataUploadViewSet(viewsets.ModelViewSet):
    """ViewSet for RawDataUpload model"""
    queryset = RawDataUpload.objects.all()
    serializer_class = RawDataUploadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['organization', 'data_source', 'status']
    ordering_fields = ['uploaded_at', 'processed_at']
    
    def perform_create(self, serializer):
        upload = serializer.save(uploaded_by=self.request.user)
        
        # Process the upload asynchronously (in production, use Celery)
        try:
            service = DataIngestionService(upload, self.request.user)
            created, errors = service.process_upload()
        except Exception as e:
            # Error already logged in upload object
            pass
    
    @action(detail=True, methods=['post'])
    def reprocess(self, request, pk=None):
        """Reprocess a failed upload"""
        upload = self.get_object()
        
        if upload.status not in ['FAILED', 'COMPLETED']:
            return Response(
                {'error': 'Can only reprocess failed or completed uploads'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            service = DataIngestionService(upload, request.user)
            created, errors = service.process_upload()
            return Response({
                'message': 'Upload reprocessed successfully',
                'records_created': created,
                'errors': errors
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AuditLog model (read-only)"""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['emission_record', 'action', 'user']
    ordering_fields = ['timestamp']

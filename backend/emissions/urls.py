from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, DataSourceViewSet, EmissionRecordViewSet,
    RawDataUploadViewSet, AuditLogViewSet,
    login_view, logout_view, current_user_view
)

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'data-sources', DataSourceViewSet)
router.register(r'emission-records', EmissionRecordViewSet)
router.register(r'uploads', RawDataUploadViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/me/', current_user_view, name='current-user'),
    path('', include(router.urls)),
]

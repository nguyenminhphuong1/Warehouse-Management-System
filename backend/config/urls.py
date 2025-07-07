from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from apps.accounts.views.auth import LoginView, LogoutView
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)

def index(request):
    return JsonResponse({"message": "✅ Backend is running!"})

schema_view = get_schema_view(
    openapi.Info(
        title="API để sử dụng các chức năng",
        default_version='v1',
        description="API",
        terms_of_service="Thuyền Trưởng Hậu",
        contact=openapi.Contact(email="haurollzabet2306@gmail.com"),
        #license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("", index),
    path("admin/", admin.site.urls),
#    path('accounts/', include('apps.accounts.urls')),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    #path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/warehouse/', include('apps.warehouse.urls')),
    path('api/orders/', include('apps.orders.urls')),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/login/', LoginView.as_view(), name='login'),
    path('api/token/logout/', LogoutView.as_view(), name='logout'),
    path('api/inventory/', include('apps.inventory.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
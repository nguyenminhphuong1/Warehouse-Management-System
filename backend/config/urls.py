from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def index(request):
    return JsonResponse({"message": "✅ Backend is running!"})

urlpatterns = [
    path("", index),
    path("admin/", admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('warehouse/', include('apps.warehouse.urls')),
    path('orders/', include('apps.orders.urls')),
    path('inventory/', include('apps.inventory.urls')),
]
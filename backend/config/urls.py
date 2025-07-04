from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import  TokenRefreshView
from apps.accounts.views.auth import LoginView, LogoutView, CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/login/', LoginView.as_view(), name='login'),
    path('api/token/logout/', LogoutView.as_view(), name='logout'),
]
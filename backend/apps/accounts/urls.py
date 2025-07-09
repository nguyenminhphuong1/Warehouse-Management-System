from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, LogoutView, ChangePasswordView, CheckPermissionView, UserModulesView, UserProfileView, RoleViewSet, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('changepassword/', ChangePasswordView.as_view()),
    path('checkpermission/', CheckPermissionView.as_view()),
    path('usermodule/', UserModulesView.as_view()),
    path('userprofile/', UserProfileView.as_view()),
]
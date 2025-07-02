from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views.user import UserViewSet
from .views.role import RoleViewSet
from .views.auth import LoginView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'roles', RoleViewSet, basename='role')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]
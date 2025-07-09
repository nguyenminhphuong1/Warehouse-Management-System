from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch
import pytest

from apps.accounts.views.user import UserViewSet
from apps.accounts.views.role import RoleViewSet
from apps.accounts.views.auth import LoginView
from django.contrib.auth import get_user_model



User = get_user_model()

@pytest.mark.django_db
def test_user_list_api():
    User.objects.create_user(username='user1', password='123')
    User.objects.create_user(username='user2', password='123')
    client = APIClient()
    admin = User.objects.create_superuser(username='admin', password='admin123')
    client.force_authenticate(user=admin)
    # Sử dụng URL trực tiếp nếu không có reverse name
    resp = client.get('/api/accounts/users/')
    assert resp.status_code == 200
    assert len(resp.data) >= 2

@pytest.mark.django_db
def test_role_create_api():
    from apps.accounts.models.role import Role
    client = APIClient()
    admin = User.objects.create_superuser(username='admin2', password='admin123')
    client.force_authenticate(user=admin)
    resp = client.post('/api/accounts/roles/', {
        'name': 'Quản trị viên',
        'code': 'ADMIN'
    })
    assert resp.status_code in (200, 201)
    assert resp.data['name'] == 'Quản trị viên'

@pytest.mark.django_db
@patch('apps.accounts.models.permission.PermissionAuditLog.log_login_attempt')

def test_login_api(mock_create_log):
    user = User.objects.create_user(username='loginuser', password='testpass')
    user.is_active = True  # đảm bảo user hoạt động
    user.status = 'active'
    user.save()

    client = APIClient()
    resp = client.post('/api/accounts/login/', {
        'username': 'loginuser',
        'password': 'testpass'
    }, format='json')

    print("\n>>> Response status:", resp.status_code)
    print(">>> Response data:", resp.data)

    assert resp.status_code == 200
    assert set(resp.data.keys()) >= {
    'access_token', 'refresh_token', 'token_type', 'expires_in', 'user', 'permissions'
    }
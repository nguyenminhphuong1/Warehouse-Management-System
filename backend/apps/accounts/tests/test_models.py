import pytest
from django.contrib.auth import get_user_model
from apps.accounts.models.role import Role
from apps.accounts.models.permission import ModulePermission

User = get_user_model()

@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(username='testuser', password='123456')
    print(f"User created: id={user.pk}, username={user.username}, is_staff={user.is_staff}")
    assert user.pk is not None
    assert user.username == 'testuser'
    assert user.check_password('123456')

@pytest.mark.django_db
def test_create_role():
    role = Role.objects.create(name='Quản lý kho', code='WAREHOUSE_MANAGER')
    print(f"Role created: id={role.pk}, name={role.name}, code={role.code}")
    assert role.pk is not None
    assert role.name == 'Quản lý kho'
    assert role.code == 'WAREHOUSE_MANAGER'

@pytest.mark.django_db
def test_create_permission():
    role = Role.objects.create(name='Nhân viên', code='STAFF')
    admin = User.objects.create_user(username='admin', password='123', is_staff=True)
    permission = ModulePermission.objects.create(
        role=role,
        module='nhap_hang',
        action='view',
        is_granted=True,
        granted_by=admin 
    )
    print(f"Permission created: id={permission.pk}, role={permission.role.name}, module={permission.module}, "
          f"action={permission.action}, is_granted={permission.is_granted}, granted_by={permission.granted_by.username}")
    
    assert permission.pk is not None
    assert permission.role == role
    assert permission.module == 'nhap_hang'
    assert permission.action == 'view'
    assert permission.is_granted is True
    assert permission.granted_by == admin
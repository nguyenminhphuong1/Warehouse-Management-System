import pytest
from django.contrib.auth import get_user_model
from apps.accounts.models.role import Role
from apps.accounts.models.permission import ModulePermission

@pytest.mark.django_db
def test_admin_has_full_access():
    admin = get_user_model().objects.create_user(username='admin', password='123', is_staff=True)
    admin.user_type = 'admin'
    admin.save()
    print(f"Admin created: {admin.username}, is_staff={admin.is_staff}, user_type={admin.user_type}")

    result = ModulePermission.check_permission(admin, 'nhap_hang', ['view'])
    print(f"Check permission result for admin on 'nhap_hang:view': {result}")

    assert result is True


@pytest.mark.django_db
def test_role_permission_grant_and_check():
    user = get_user_model().objects.create_user(username='user1', password='123')
    admin = get_user_model().objects.create_user(username='admin2', password='123', is_staff=True)
    role = Role.objects.create(name='TestRole', code='TEST_ROLE')
    user_role = user.user_roles.create(role=role, is_active=True)
    perm = ModulePermission.objects.create(
        role=role,
        module='nhap_hang',
        action='view',
        is_granted=True,
        granted_by=admin
    )

    print(f"User created: {user.username}")
    print(f"Role assigned: {role.name} ({role.code})")
    print(f"Permission granted: module={perm.module}, action={perm.action}, is_granted={perm.is_granted}")

    assert perm.role == role
    assert perm.is_granted is True


@pytest.mark.django_db
def test_check_any_permission():
    user = get_user_model().objects.create_user(username='user2', password='123')
    admin = get_user_model().objects.create_user(username='admin3', password='123', is_staff=True)
    role = Role.objects.create(name='Role2', code='ROLE2')
    user.user_roles.create(role=role, is_active=True)
    ModulePermission.objects.create(
        role=role,
        module='xuat_hang',
        action='create',
        is_granted=True,
        granted_by=admin
    )

    roles = Role.objects.filter(user_roles__user=user, user_roles__is_active=True)
    permissions = ModulePermission.objects.filter(
        role__in=roles,
        module='xuat_hang',
        action='create',
        is_granted=True
    )
    print(f"User: {user.username}")
    print(f"User roles: {list(roles.values('id', 'name', 'code'))}")
    print(f"Matching permissions: {list(permissions.values('module', 'action', 'is_granted'))}")

    result = ModulePermission.check_any_permission(user, 'xuat_hang', ['create'])
    print(f"Check any permission result: {result}")

    assert result is True


@pytest.mark.django_db
def test_check_all_permissions():
    user = get_user_model().objects.create_user(username='user3', password='123')
    admin = get_user_model().objects.create_user(username='admin4', password='123', is_staff=True)
    role = Role.objects.create(name='Role3', code='ROLE3')
    user.user_roles.create(role=role, is_active=True)
    ModulePermission.objects.create(
        role=role,
        module='reports',
        action='view',
        is_granted=True,
        granted_by=admin
    )

    roles = Role.objects.filter(user_roles__user=user, user_roles__is_active=True)
    permissions = ModulePermission.objects.filter(
        role__in=roles,
        module='reports',
        action='view',
        is_granted=True
    )
    print(f"User: {user.username}")
    print(f"User roles: {list(roles.values('id', 'name', 'code'))}")
    print(f"Matching permissions: {list(permissions.values('module', 'action', 'is_granted'))}")

    result = ModulePermission.check_all_permissions(user, 'reports', ['view'])
    print(f"Check all permission result: {result}")

    assert result is True


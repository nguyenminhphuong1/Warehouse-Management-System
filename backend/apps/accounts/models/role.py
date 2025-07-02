# backend/apps/accounts/models/role.py

from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from apps.accounts.models.user import User

class Role(models.Model):
    """
    Model quản lý các vai trò trong hệ thống
    """
    ROLE_TYPES = [
        ('admin', 'System Administrator'),
        ('manager', 'Warehouse Manager'),
        ('supervisor', 'Warehouse Supervisor'),
        ('staff', 'Warehouse Staff'),
        ('viewer', 'View Only'),
        ('delivery', 'Delivery Staff'),
        ('quality', 'Quality Control'),
        ('custom', 'Custom Role')
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('deprecated', 'Deprecated')
    ]
    
    # Thông tin cơ bản
    name = models.CharField(
        max_length=100,
        help_text="Tên vai trò"
    )
    
    code = models.CharField(
        max_length=50,
        unique=True,
        help_text="Mã vai trò (unique)"
    )
    
    role_type = models.CharField(
        max_length=20,
        choices=ROLE_TYPES,
        default='custom',
        help_text="Loại vai trò"
    )
    
    description = models.TextField(
        blank=True,
        help_text="Mô tả chi tiết vai trò"
    )
    
    # Trạng thái
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        help_text="Trạng thái vai trò"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Vai trò có đang hoạt động"
    )
    
    is_system_role = models.BooleanField(
        default=False,
        help_text="Vai trò hệ thống (không thể xóa)"
    )
    
    # Cấu hình
    priority = models.IntegerField(
        default=0,
        help_text="Độ ưu tiên (số càng cao càng ưu tiên)"
    )
    
    max_users = models.IntegerField(
        null=True,
        blank=True,
        help_text="Số lượng user tối đa cho vai trò này"
    )
    
    auto_assign = models.BooleanField(
        default=False,
        help_text="Tự động gán cho user mới"
    )
    
    # Quản lý
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_roles',
        help_text="Người tạo vai trò"
    )
    
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_roles',
        help_text="Người cập nhật cuối"
    )
    
    # Thời gian
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Thời gian tạo"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Thời gian cập nhật cuối"
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Dữ liệu bổ sung dạng JSON"
    )
    
    class Meta:
        db_table = 'roles'
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'
        ordering = ['-priority', 'name']
        indexes = [
            models.Index(fields=['role_type', 'is_active']),
            models.Index(fields=['code']),
            models.Index(fields=['status']),
            models.Index(fields=['created_by']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['code'],
                name='unique_role_code'
            )
        ]
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def save(self, *args, **kwargs):
        """Override save để tự động tạo code từ name"""
        if not self.code:
            self.code = slugify(self.name).replace('-', '_').upper()
        
        # Validate code format
        if not self.code.replace('_', '').isalnum():
            raise ValidationError("Code chỉ được chứa chữ cái, số và dấu gạch dưới")
        
        super().save(*args, **kwargs)
    
    def clean(self):
        """Validate model"""
        super().clean()
        
        # Kiểm tra max_users
        if self.max_users is not None and self.max_users < 0:
            raise ValidationError("Số lượng user tối đa phải >= 0")
        
        # Kiểm tra system role không thể inactive
        if self.is_system_role and not self.is_active:
            raise ValidationError("Vai trò hệ thống không thể được inactive")
    
    def delete(self, *args, **kwargs):
        """Override delete để bảo vệ system role"""
        if self.is_system_role:
            raise ValidationError("Không thể xóa vai trò hệ thống")
        
        # Kiểm tra còn user nào đang sử dụng không
        active_users = self.user_roles.filter(is_active=True).count()
        if active_users > 0:
            raise ValidationError(f"Không thể xóa vai trò đang được {active_users} user sử dụng")
        
        super().delete(*args, **kwargs)
    
    # Helper methods
    def get_permissions(self):
        """Lấy tất cả quyền của role"""
        return self.permissions.filter(is_granted=True)
    
    def get_modules(self):
        """Lấy danh sách modules mà role có quyền"""
        return list(self.permissions.filter(
            is_granted=True
        ).values_list('module', flat=True).distinct())
    
    def get_actions_for_module(self, module_name):
        """Lấy danh sách actions cho một module"""
        return list(self.permissions.filter(
            module=module_name,
            is_granted=True
        ).values_list('action', flat=True))
    
    def has_permission(self, module_name, action):
        """Kiểm tra có quyền thực hiện action trên module không"""
        return self.permissions.filter(
            module=module_name,
            action__in=[action, 'full_access'],
            is_granted=True
        ).exists()
    
    def can_access_module(self, module_name):
        """Kiểm tra có thể truy cập module không"""
        return self.has_permission(module_name, 'view')
    
    def add_permission(self, module_name, action, granted=True):
        """Thêm quyền cho role"""
        from apps.accounts.models.permission import ModulePermission
        
        permission, created = ModulePermission.objects.get_or_create(
            role=self,
            module=module_name,
            action=action,
            defaults={'is_granted': granted}
        )
        
        if not created:
            permission.is_granted = granted
            permission.save()
        
        return permission
    
    def remove_permission(self, module_name, action):
        """Xóa quyền khỏi role"""
        self.permissions.filter(
            module=module_name,
            action=action
        ).delete()
    
    def grant_full_module_access(self, module_name):
        """Cấp toàn quyền cho một module"""
        return self.add_permission(module_name, 'full_access', True)
    
    def revoke_module_access(self, module_name):
        """Thu hồi tất cả quyền của một module"""
        self.permissions.filter(module=module_name).delete()
    
    def copy_permissions_from(self, source_role):
        """Copy quyền từ role khác"""
        if not isinstance(source_role, Role):
            raise ValueError("source_role phải là instance của Role")
        
        # Xóa quyền hiện tại
        self.permissions.all().delete()
        
        # Copy quyền từ source
        for permission in source_role.permissions.all():
            self.add_permission(
                permission.module,
                permission.action,
                permission.is_granted
            )
    
    def get_active_users_count(self):
        """Đếm số user đang active với role này"""
        return self.user_roles.filter(is_active=True).count()
    
    def get_user_list(self):
        """Lấy danh sách user có role này"""
        return User.objects.filter(
            user_roles__role=self,
            user_roles__is_active=True
        ).distinct()
    
    def is_at_max_capacity(self):
        """Kiểm tra đã đạt số lượng user tối đa chưa"""
        if self.max_users is None:
            return False
        return self.get_active_users_count() >= self.max_users
    
    def can_assign_to_user(self, user):
        """Kiểm tra có thể gán role này cho user không"""
        # Kiểm tra capacity
        if self.is_at_max_capacity():
            return False, "Vai trò đã đạt số lượng user tối đa"
        
        # Kiểm tra user đã có role này chưa
        if self.user_roles.filter(user=user, is_active=True).exists():
            return False, "User đã có vai trò này"
        
        # Kiểm tra role có active không
        if not self.is_active:
            return False, "Vai trò không hoạt động"
        
        return True, "OK"
    
    def get_permission_summary(self):
        """Lấy tóm tắt quyền của role"""
        modules = {}
        for permission in self.permissions.filter(is_granted=True):
            if permission.module not in modules:
                modules[permission.module] = []
            modules[permission.module].append(permission.action)
        
        return modules
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'role_type': self.role_type,
            'description': self.description,
            'status': self.status,
            'is_active': self.is_active,
            'is_system_role': self.is_system_role,
            'priority': self.priority,
            'max_users': self.max_users,
            'current_users': self.get_active_users_count(),
            'modules': self.get_modules(),
            'permissions': self.get_permission_summary(),
            'created_at': self.created_at,
            'created_by': self.created_by.get_full_name() if self.created_by else None
        }
    
    def get_full_permissions(self):
        """Get complete permission tree including inherited permissions"""
        permissions = {}
        
        # Get direct permissions
        for perm in self.permissions.filter(is_granted=True):
            if perm.module not in permissions:
                permissions[perm.module] = []
                
            if perm.action == 'full_access':
                permissions[perm.module] = ['full_access']
                continue
                
            if perm.action not in permissions[perm.module]:
                permissions[perm.module].append(perm.action)
                
        return permissions
    
    def grant_permission(self, module, action, **kwargs):
        """Grant a permission to this role"""
        from apps.accounts.models.permission import ModulePermission
        
        permission, created = ModulePermission.objects.get_or_create(
            role=self,
            module=module,
            action=action,
            defaults={
                'is_granted': True,
                **kwargs
            }
        )
        
        if not created:
            permission.is_granted = True
            for key, value in kwargs.items():
                setattr(permission, key, value)
            permission.save()
            
        return permission
    
    def revoke_permission(self, module, action):
        """Revoke a specific permission"""
        self.permissions.filter(
            module=module,
            action=action
        ).update(is_granted=False)
    
    def set_permissions(self, permissions_dict):
        """Set multiple permissions at once
        Format: {
            'module_name': ['action1', 'action2']
        }
        """
        # Clear existing permissions
        self.permissions.all().delete()
        
        # Add new permissions
        for module, actions in permissions_dict.items():
            for action in actions:
                self.grant_permission(module, action)
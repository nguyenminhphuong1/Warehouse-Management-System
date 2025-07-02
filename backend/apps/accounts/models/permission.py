# backend/apps/accounts/models/permission.py

from django.db import models
from django.core.exceptions import ValidationError
from apps.accounts.models.role import Role
from apps.accounts.models.user import User

class ModulePermission(models.Model):
    """
    Model quản lý quyền hạn theo module và hành động
    """
    MODULE_CHOICES = [
        ('nhap_hang', 'Module 1: Nhập hàng'),
        ('tao_don', 'Module 2: Tạo đơn'),
        ('xuat_hang', 'Module 3: Xuất hàng'), 
        ('quan_ly_kho', 'Module 4: Quản lý kho'),
        ('kiem_tra_giao_hang', 'Module 5: Kiểm tra giao hàng'),
        ('admin_panel', 'Admin Panel'),
        ('reports', 'Báo cáo & Thống kê'),
        ('settings', 'Cài đặt hệ thống'),
        ('user_management', 'Quản lý người dùng'),
        ('role_management', 'Quản lý vai trò'),
        ('warehouse_config', 'Cấu hình kho'),
        ('system_logs', 'Nhật ký hệ thống')
    ]
    
    ACTION_CHOICES = [
        ('view', 'Xem/Đọc'),
        ('create', 'Tạo mới'),
        ('edit', 'Chỉnh sửa'),
        ('delete', 'Xóa'),
        ('export', 'Xuất dữ liệu'),
        ('import', 'Nhập dữ liệu'),
        ('print', 'In ấn'),
        ('approve', 'Duyệt/Phê duyệt'),
        ('reject', 'Từ chối'),
        ('assign', 'Phân công'),
        ('transfer', 'Chuyển đổi'),
        ('manage_users', 'Quản lý người dùng'),
        ('manage_roles', 'Quản lý vai trò'),
        ('system_config', 'Cấu hình hệ thống'),
        ('full_access', 'Toàn quyền')
    ]
    
    # Quan hệ
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name='permissions',
        help_text="Vai trò được cấp quyền"
    )
    
    # Thông tin quyền
    module = models.CharField(
        max_length=30,
        choices=MODULE_CHOICES,
        help_text="Module/Chức năng"
    )
    
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        help_text="Hành động được phép"
    )
    
    is_granted = models.BooleanField(
        default=True,
        help_text="Quyền có được cấp hay không"
    )
    
    # Điều kiện bổ sung
    conditions = models.JSONField(
        default=dict,
        blank=True,
        help_text="Điều kiện bổ sung (JSON format)"
    )
    
    # Thời hạn
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Thời hạn hiệu lực quyền"
    )
    
    # Quản lý
    granted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='granted_permissions',
        help_text="Người cấp quyền"
    )
    
    granted_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Thời gian cấp quyền"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Thời gian cập nhật cuối"
    )
    
    # Ghi chú
    reason = models.TextField(
        blank=True,
        help_text="Lý do cấp/thu hồi quyền"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Ghi chú bổ sung"
    )
    
    class Meta:
        db_table = 'module_permissions'
        verbose_name = 'Module Permission'
        verbose_name_plural = 'Module Permissions'
        ordering = ['role', 'module', 'action']
        indexes = [
            models.Index(fields=['role', 'module']),
            models.Index(fields=['module', 'action']),
            models.Index(fields=['is_granted']),
            models.Index(fields=['expires_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['role', 'module', 'action'],
                name='unique_role_module_action'
            )
        ]
    
    def __str__(self):
        status = "✓" if self.is_granted else "✗"
        return f"{status} {self.role.name} - {self.get_module_display()} - {self.get_action_display()}"
    
    def clean(self):
        """Validate model"""
        super().clean()
        
        # Kiểm tra logic quyền
        if self.action == 'full_access' and not self.is_granted:
            raise ValidationError("Không thể có full_access nhưng không granted")
        
        # Kiểm tra expires_at phải trong tương lai
        if self.expires_at and self.expires_at <= timezone.now():
            raise ValidationError("Thời hạn hiệu lực phải trong tương lai")
    
    def save(self, *args, **kwargs):
        """Override save"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    # Helper methods
    def is_expired(self):
        """Kiểm tra quyền đã hết hạn chưa"""
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Kiểm tra quyền có hợp lệ không"""
        return self.is_granted and not self.is_expired() and self.role.is_active
    
    def days_until_expiry(self):
        """Số ngày đến khi hết hạn"""
        if not self.expires_at:
            return None
        from django.utils import timezone
        delta = self.expires_at - timezone.now()
        return delta.days if delta.days > 0 else 0
    
    def extend_expiry(self, days):
        """Gia hạn quyền"""
        from django.utils import timezone
        from datetime import timedelta
        
        if self.expires_at:
            self.expires_at += timedelta(days=days)
        else:
            self.expires_at = timezone.now() + timedelta(days=days)
        self.save()
    
    def days_until_expiry(self):
        """Số ngày đến khi hết hạn"""
        if not self.expires_at:
            return None
        from django.utils import timezone
        delta = self.expires_at - timezone.now()
        return delta.days if delta.days > 0 else 0
    
    def get_permissions(self):
        """Lấy tất cả quyền từ vai trò"""
        return self.role.get_permissions()
    
    def can_access_module(self, module_name):
        """Kiểm tra có thể truy cập module không"""
        if not self.is_valid():
            return False
        return self.role.can_access_module(module_name)
    
    def can_perform_action(self, module_name, action, context=None):
        """Kiểm tra có thể thực hiện action không"""
        if not self.is_valid():
            return False
        
        # Kiểm tra quyền cơ bản
        if not self.role.has_permission(module_name, action):
            return False
        
        # Kiểm tra điều kiện bổ sung
        permission = self.role.permissions.filter(
            module=module_name,
            action__in=[action, 'full_access'],
            is_granted=True
        ).first()
        
        if permission and not permission.check_conditions(context):
            return False
        
        return True
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user.id,
            'user_name': self.user.get_full_name(),
            'role_id': self.role.id,
            'role_name': self.role.name,
            'role_code': self.role.code,
            'is_active': self.is_active,
            'is_expired': self.is_expired(),
            'is_valid': self.is_valid(),
            'assigned_at': self.assigned_at,
            'expires_at': self.expires_at,
            'days_until_expiry': self.days_until_expiry(),
            'assigned_by': self.assigned_by.get_full_name() if self.assigned_by else None,
            'revoked_by': self.revoked_by.get_full_name() if self.revoked_by else None,
            'revoked_at': self.revoked_at,
            'reason': self.reason,
            'notes': self.notes
        }
                # Add to existing ModulePermission model
    @classmethod
    def check_permission(cls, user, module, action, context=None):
        """Class method to check permission for user"""
        if user.is_admin():
            return True
        
        permission = cls.objects.filter(
            role__user_roles__user=user,
            role__user_roles__is_active=True,
            role__is_active=True,
            module=module,
            action__in=[action, 'full_access'],
            is_granted=True
        ).first()
    
        if not permission:
            return False
        
        if context:
            return permission.check_conditions(context)
        
        return True
    @classmethod
    def check_any_permission(cls, user, module, actions, context=None):
        """Check if user has any of the specified permissions"""
        return any(
            cls.check_permission(user, module, action, context)
            for action in actions
        )
    @classmethod
    def check_all_permissions(cls, user, module, actions, context=None):
        """Check if user has all specified permissions"""
        return all(
            cls.check_permission(user, module, action, context)
            for action in actions
        )

    @classmethod
    def get_user_permissions(cls, user):
        """Get all permissions for a user"""
        if user.is_admin():
            return {
                module[0]: ['full_access'] 
                for module in cls.MODULE_CHOICES
            }
        
        permissions = {}
        user_permissions = cls.objects.filter(
            role__user_roles__user=user,
            role__user_roles__is_active=True,
            role__is_active=True,
            is_granted=True
        ).select_related('role')
    
        for perm in user_permissions:
            if not perm.is_valid():
                continue
            
            if perm.module not in permissions:
                permissions[perm.module] = []
            
            if perm.action == 'full_access':
                permissions[perm.module] = ['full_access']
                continue
            
            if perm.action not in permissions[perm.module]:
                permissions[perm.module].append(perm.action)
            
        return permissions


class PermissionAuditLog(models.Model):
    """
    Model ghi log các thay đổi quyền hạn
    """
    ACTION_TYPES = [
        ('grant_permission', 'Cấp quyền'),
        ('revoke_permission', 'Thu hồi quyền'),
        ('assign_role', 'Gán vai trò'),
        ('remove_role', 'Xóa vai trò'),
        ('create_role', 'Tạo vai trò'),
        ('update_role', 'Cập nhật vai trò'),
        ('delete_role', 'Xóa vai trò'),
        ('login_attempt', 'Thử đăng nhập'),
        ('access_denied', 'Từ chối truy cập'),
        ('module_access', 'Truy cập module'),
        ('action_performed', 'Thực hiện hành động')
    ]
    
    # Thông tin chung
    action_type = models.CharField(
        max_length=30,
        choices=ACTION_TYPES,
        help_text="Loại hành động"
    )
    
    # Đối tượng liên quan
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='permission_logs',
        help_text="User thực hiện hành động"
    )
    
    target_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='target_permission_logs',
        help_text="User bị tác động (nếu có)"
    )
    
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Vai trò liên quan"
    )
    
    # Chi tiết
    module = models.CharField(
        max_length=30,
        blank=True,
        help_text="Module liên quan"
    )
    
    action = models.CharField(
        max_length=20,
        blank=True,
        help_text="Hành động cụ thể"
    )
    
    # Kết quả
    success = models.BooleanField(
        default=True,
        help_text="Hành động có thành công không"
    )
    
    error_message = models.TextField(
        blank=True,
        help_text="Thông báo lỗi (nếu có)"
    )
    
    # Metadata
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="Địa chỉ IP"
    )
    
    user_agent = models.TextField(
        blank=True,
        help_text="User Agent"
    )
    
    request_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Dữ liệu request"
    )
    
    response_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Dữ liệu response"
    )
    
    # Thời gian
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="Thời gian thực hiện"
    )
    
    # Ghi chú
    notes = models.TextField(
        blank=True,
        help_text="Ghi chú bổ sung"
    )
    
    class Meta:
        db_table = 'permission_audit_logs'
        verbose_name = 'Permission Audit Log'
        verbose_name_plural = 'Permission Audit Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action_type', 'timestamp']),
            models.Index(fields=['target_user', 'timestamp']),
            models.Index(fields=['module', 'action']),
            models.Index(fields=['success']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.get_action_type_display()} - {self.timestamp}"
    
    @classmethod
    def log_permission_change(cls, user, action_type, target_user=None, role=None, 
                            module=None, action=None, success=True, error_message="",
                            ip_address=None, user_agent="", request_data=None, 
                            response_data=None, notes=""):
        """
        Helper method để log thay đổi quyền
        """
        return cls.objects.create(
            action_type=action_type,
            user=user,
            target_user=target_user,
            role=role,
            module=module,
            action=action,
            success=success,
            error_message=error_message,
            ip_address=ip_address,
            user_agent=user_agent,
            request_data=request_data or {},
            response_data=response_data or {},
            notes=notes
        )
    
    @classmethod
    def log_login_attempt(cls, user, success, ip_address=None, user_agent="", error_message=""):
        """Log thử đăng nhập"""
        return cls.log_permission_change(
            user=user,
            action_type='login_attempt',
            success=success,
            error_message=error_message,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    @classmethod
    def log_access_denied(cls, user, module, action, ip_address=None, reason=""):
        """Log từ chối truy cập"""
        return cls.log_permission_change(
            user=user,
            action_type='access_denied',
            module=module,
            action=action,
            success=False,
            error_message=reason,
            ip_address=ip_address
        )
    
    @classmethod
    def log_module_access(cls, user, module, ip_address=None):
        """Log truy cập module"""
        return cls.log_permission_change(
            user=user,
            action_type='module_access',
            module=module,
            ip_address=ip_address
        )
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'action_type': self.action_type,
            'action_type_display': self.get_action_type_display(),
            'user': self.user.get_full_name(),
            'target_user': self.target_user.get_full_name() if self.target_user else None,
            'role': self.role.name if self.role else None,
            'module': self.module,
            'action': self.action,
            'success': self.success,
            'error_message': self.error_message,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp,
            'notes': self.notes
        }
    
    def revoke(self, reason="", revoked_by=None):
        """Thu hồi quyền"""
        self.is_granted = False
        if reason:
            self.reason = reason
        if revoked_by:
            self.granted_by = revoked_by
        self.save()
    
    def grant(self, reason="", granted_by=None):
        """Cấp quyền"""
        self.is_granted = True
        if reason:
            self.reason = reason
        if granted_by:
            self.granted_by = granted_by
        self.save()
    
    def check_conditions(self, context=None):
        """Kiểm tra điều kiện bổ sung"""
        if not self.conditions:
            return True
        
        if not context:
            return True
        
        # Implement logic kiểm tra điều kiện dựa trên context
        # Ví dụ: time_restriction, ip_restriction, etc.
        
        # Time restriction
        if 'time_restriction' in self.conditions:
            time_rule = self.conditions['time_restriction']
            from datetime import datetime
            current_time = datetime.now().time()
            
            if 'start_time' in time_rule and 'end_time' in time_rule:
                start = datetime.strptime(time_rule['start_time'], '%H:%M').time()
                end = datetime.strptime(time_rule['end_time'], '%H:%M').time()
                
                if not (start <= current_time <= end):
                    return False
        
        # Warehouse restriction
        if 'warehouse_restriction' in self.conditions:
            allowed_warehouses = self.conditions['warehouse_restriction']
            current_warehouse = context.get('warehouse_id')
            
            if current_warehouse and current_warehouse not in allowed_warehouses:
                return False
        
        return True
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'role_id': self.role.id,
            'role_name': self.role.name,
            'module': self.module,
            'module_display': self.get_module_display(),
            'action': self.action,
            'action_display': self.get_action_display(),
            'is_granted': self.is_granted,
            'is_expired': self.is_expired(),
            'is_valid': self.is_valid(),
            'conditions': self.conditions,
            'expires_at': self.expires_at,
            'days_until_expiry': self.days_until_expiry(),
            'granted_by': self.granted_by.get_full_name() if self.granted_by else None,
            'granted_at': self.granted_at,
            'reason': self.reason,
            'notes': self.notes
        }
    def extend_expiry(self, days):
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        if self.expires_at and self.expires_at > now:
            self.expires_at += timedelta(days=days)
        else:
            self.expires_at = now + timedelta(days=days)
        self.save()

class UserRole(models.Model):
    """
    Model quản lý vai trò của người dùng
    """
    # Quan hệ
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_roles',
        help_text="Người dùng"
    )
    
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name='user_roles',
        help_text="Vai trò"
    )
    
    # Trạng thái
    is_active = models.BooleanField(
        default=True,
        help_text="Vai trò có đang hoạt động cho user này"
    )
    
    # Thời hạn
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Thời gian gán vai trò"
    )
    
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Thời hạn hiệu lực vai trò"
    )
    
    # Quản lý
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_user_roles',
        help_text="Người gán vai trò"
    )
    
    revoked_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='revoked_user_roles',
        help_text="Người thu hồi vai trò"
    )
    
    revoked_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Thời gian thu hồi vai trò"
    )
    
    # Ghi chú
    reason = models.TextField(
        blank=True,
        help_text="Lý do gán/thu hồi vai trò"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Ghi chú bổ sung"
    )
    
    class Meta:
        db_table = 'user_roles'
        verbose_name = 'User Role'
        verbose_name_plural = 'User Roles'
        ordering = ['-assigned_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['role', 'is_active']),
            models.Index(fields=['assigned_at']),
            models.Index(fields=['expires_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'role'],
                condition=models.Q(is_active=True),
                name='unique_active_user_role'
            )
        ]
    
    def __str__(self):
        status = "✓" if self.is_active else "✗"
        return f"{status} {self.user.get_full_name()} - {self.role.name}"
    
    def clean(self):
        """Validate model"""
        super().clean()
        
        # Kiểm tra role capacity
        if self.role.is_at_max_capacity() and not self.pk:
            raise ValidationError(f"Vai trò {self.role.name} đã đạt số lượng user tối đa")
        
        # Kiểm tra expires_at
        if self.expires_at and self.expires_at <= timezone.now():
            raise ValidationError("Thời hạn hiệu lực phải trong tương lai")
    
    def is_expired(self):
        """Kiểm tra vai trò đã hết hạn chưa"""
        if not self.expires_at:
            return False
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Kiểm tra vai trò có hợp lệ không"""
        return (self.is_active and 
                not self.is_expired() and 
                self.role.is_active and 
                self.user.is_active)
    
    def revoke(self, revoked_by=None, reason=""):
        """Thu hồi vai trò"""
        from django.utils import timezone
        
        self.is_active = False
        self.revoked_at = timezone.now()
        self.revoked_by = revoked_by
        if reason:
            self.reason = reason
        self.save()
    
    def activate(self, reason=""):
        """Kích hoạt lại vai trò"""
        self.is_active = True
        self.revoked_at = None
        self.revoked_by = None
        if reason:
            self.reason = reason
        self.save()
    
    def extend_expiry(self, days):
        """Gia hạn vai trò"""
        from django.utils import timezone
        from datetime import timedelta
        
        if self.expires_at:
            self
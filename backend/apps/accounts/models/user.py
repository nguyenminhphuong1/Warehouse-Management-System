# backend/apps/accounts/models/user.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    """
    Custom User model với các trường bổ sung cho hệ thống quản lý kho
    """
    USER_TYPES = [
        ('admin', 'System Administrator'),
        ('manager', 'Warehouse Manager'),
        ('supervisor', 'Warehouse Supervisor'), 
        ('staff', 'Warehouse Staff'),
        ('viewer', 'View Only User'),
        ('delivery', 'Delivery Staff'),
        ('quality', 'Quality Control Staff')
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
        ('pending', 'Pending Approval')
    ]
    
    # Thông tin cơ bản
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPES, 
        default='staff',
        help_text="Loại tài khoản người dùng"
    )
    
    employee_id = models.CharField(
        max_length=20, 
        unique=True, 
        null=True, 
        blank=True,
        help_text="Mã nhân viên"
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Số điện thoại phải có định dạng: '+999999999'. Tối đa 15 chữ số."
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        help_text="Số điện thoại liên hệ"
    )
    
    address = models.TextField(blank=True, help_text="Địa chỉ")
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        help_text="Ảnh đại diện"
    )
    
    # Thông tin trạng thái
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Trạng thái tài khoản"
    )
    
    is_active_session = models.BooleanField(
        default=False,
        help_text="Đang trong phiên làm việc"
    )
    
    last_activity = models.DateTimeField(
        auto_now=True,
        help_text="Thời gian hoạt động cuối"
    )
    
    # Quản lý tạo tài khoản
    created_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_users',
        help_text="Người tạo tài khoản này"
    )
    
    approved_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_users',
        help_text="Người duyệt tài khoản"
    )
    
    approved_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Thời gian duyệt tài khoản"
    )
    
    # Phân quyền truy cập kho
    warehouse_access = models.ManyToManyField(
        'warehouse.KhuVuc',
        blank=True,
        related_name='accessible_users',
        help_text="Các khu vực kho được phép truy cập"
    )
    
    # Cài đặt cá nhân
    notification_enabled = models.BooleanField(
        default=True,
        help_text="Bật thông báo"
    )
    
    email_notification = models.BooleanField(
        default=True,
        help_text="Nhận thông báo qua email"
    )
    
    language = models.CharField(
        max_length=10,
        default='vi',
        help_text="Ngôn ngữ giao diện"
    )
    
    timezone_user = models.CharField(
        max_length=50,
        default='Asia/Ho_Chi_Minh',
        help_text="Múi giờ"
    )
    
    # Bảo mật
    failed_login_attempts = models.IntegerField(
        default=0,
        help_text="Số lần đăng nhập sai"
    )
    
    locked_until = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Khóa tài khoản đến"
    )
    
    password_changed_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Lần đổi mật khẩu cuối"
    )
    
    must_change_password = models.BooleanField(
        default=False,
        help_text="Bắt buộc đổi mật khẩu lần đăng nhập tiếp theo"
    )
    
    # Thống kê
    total_login_count = models.IntegerField(
        default=0,
        help_text="Tổng số lần đăng nhập"
    )
    
    last_password_change = models.DateTimeField(
        auto_now_add=True,
        help_text="Lần thay đổi mật khẩu cuối"
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['user_type', 'status']),
            models.Index(fields=['employee_id']),
            models.Index(fields=['is_active', 'status']),
            models.Index(fields=['created_by']),
        ]
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"
    
    def get_full_name(self):
        """Trả về họ tên đầy đủ"""
        if self.first_name and self.last_name:
            return f"{self.last_name} {self.first_name}"
        return self.username
    
    def get_display_name(self):
        """Trả về tên hiển thị"""
        full_name = self.get_full_name()
        if full_name != self.username:
            return f"{full_name} ({self.username})"
        return self.username
    
    def is_admin(self):
        """Kiểm tra có phải admin không"""
        return self.user_type == 'admin' and self.is_staff
    
    def is_manager(self):
        """Kiểm tra có phải manager không"""
        return self.user_type in ['admin', 'manager']
    
    def can_create_users(self):
        """Kiểm tra có thể tạo user không"""
        return self.user_type in ['admin', 'manager'] and self.is_active
    
    def can_access_module(self, module_name):
        """Kiểm tra quyền truy cập module"""
        if self.is_admin():
            return True
        
        # Kiểm tra permission qua UserRole
        return self.user_roles.filter(
            role__permissions__module=module_name,
            role__permissions__action__in=['view', 'full_access'],
            is_active=True
        ).exists()
    
    def can_perform_action(self, module_name, action):
        """Kiểm tra quyền thực hiện hành động"""
        if self.is_admin():
            return True
            
        return self.user_roles.filter(
            role__permissions__module=module_name,
            role__permissions__action__in=[action, 'full_access'],
            role__permissions__is_granted=True,
            is_active=True
        ).exists()
    
    def get_accessible_modules(self):
        """Lấy danh sách modules có thể truy cập"""
        if self.is_admin():
            from apps.accounts.models.permission import ModulePermission
            return [choice[0] for choice in ModulePermission.MODULE_CHOICES]
        
        return list(self.user_roles.filter(
            is_active=True,
            role__permissions__action__in=['view', 'full_access'],
            role__permissions__is_granted=True
        ).values_list(
            'role__permissions__module', 
            flat=True
        ).distinct())
    
    def is_account_locked(self):
        """Kiểm tra tài khoản có bị khóa không"""
        if self.locked_until and self.locked_until > timezone.now():
            return True
        return False
    
    def lock_account(self, duration_minutes=30):
        """Khóa tài khoản trong thời gian nhất định"""
        self.locked_until = timezone.now() + timedelta(minutes=duration_minutes)
        self.save(update_fields=['locked_until'])
    
    def unlock_account(self):
        """Mở khóa tài khoản"""
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save(update_fields=['locked_until', 'failed_login_attempts'])
    
    def increment_failed_login(self):
        """Tăng số lần đăng nhập sai"""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:  # Khóa sau 5 lần sai
            self.lock_account(60)  # Khóa 60 phút
        self.save(update_fields=['failed_login_attempts'])
    
    def reset_failed_login(self):
        """Reset số lần đăng nhập sai"""
        self.failed_login_attempts = 0
        self.save(update_fields=['failed_login_attempts'])
    
    def update_last_activity(self):
        """Cập nhật thời gian hoạt động cuối"""
        self.last_activity = timezone.now()
        self.total_login_count += 1
        self.save(update_fields=['last_activity', 'total_login_count'])
    
    def need_password_change(self, days=90):
        """Kiểm tra có cần đổi mật khẩu không (sau 90 ngày)"""
        if self.must_change_password:
            return True
        
        if self.last_password_change:
            days_since_change = (timezone.now() - self.last_password_change).days
            return days_since_change >= days
        
        return False
    
    def get_role_names(self):
        """Lấy danh sách tên role"""
        return list(self.user_roles.filter(
            is_active=True
        ).values_list('role__name', flat=True))
    
    def has_warehouse_access(self, warehouse_id):
        """Kiểm tra có quyền truy cập kho không"""
        if self.is_admin():
            return True
        return self.warehouse_access.filter(id=warehouse_id).exists()
    
    def get_user_summary(self):
        """Lấy thông tin tóm tắt user"""
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.get_full_name(),
            'email': self.email,
            'user_type': self.get_user_type_display(),
            'status': self.get_status_display(),
            'is_active': self.is_active,
            'last_login': self.last_login,
            'roles': self.get_role_names(),
            'accessible_modules': self.get_accessible_modules(),
            'created_at': self.date_joined,
            'created_by': self.created_by.get_full_name() if self.created_by else None
        }
    
    def get_all_permissions(self):
        """Get all effective permissions for user across all roles"""
        from apps.accounts.models.permission import ModulePermission
        if self.is_admin():
            # Admin has all permissions
            return {module[0]: ['full_access'] for module in ModulePermission.MODULE_CHOICES}
        
        permissions = {}
        active_roles = self.user_roles.filter(
            is_active=True,
            role__is_active=True
        ).select_related('role')
        
        for user_role in active_roles:
            role_perms = user_role.role.get_permissions()
            for perm in role_perms:
                if not perm.is_valid():
                    continue
                    
                if perm.module not in permissions:
                    permissions[perm.module] = []
                    
                if perm.action == 'full_access':
                    permissions[perm.module] = ['full_access']
                    break
                    
                if perm.action not in permissions[perm.module]:
                    permissions[perm.module].append(perm.action)
                    
        return permissions
    
    def has_module_permission(self, module_name, context=None):
        """Check if user has any permission for a module"""
        if self.is_admin():
            return True
            
        return self.user_roles.filter(
            is_active=True,
            role__is_active=True,
            role__permissions__module=module_name,
            role__permissions__is_granted=True
        ).exists()
    
    def has_permission(self, module_name, action, context=None):
        """Check if user has specific permission"""
        if self.is_admin():
            return True
            
        permission = self.user_roles.filter(
            is_active=True,
            role__is_active=True,
            role__permissions__module=module_name,
            role__permissions__action__in=[action, 'full_access'],
            role__permissions__is_granted=True
        ).first()
        
        if not permission:
            return False
            
        # Check conditions if context provided
        if context and hasattr(permission, 'check_conditions'):
            return permission.check_conditions(context)
            
        return True
    
    def get_role_permissions(self):
        """Get permissions grouped by role"""
        permissions = {}
        
        for user_role in self.user_roles.filter(is_active=True):
            role = user_role.role
            if not role.is_active:
                continue
                
            permissions[role.name] = role.get_permission_summary()
            
        return permissions
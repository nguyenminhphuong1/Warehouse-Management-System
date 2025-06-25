# backend/apps/accounts/serializers/auth.py

from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from apps.accounts.models import User, Role, UserRole, ModulePermission

class LoginSerializer(serializers.Serializer):
    """
    Serializer cho đăng nhập
    """
    username = serializers.CharField(
        max_length=150,
        help_text="Tên đăng nhập hoặc email"
    )
    
    password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Mật khẩu"
    )
    
    remember_me = serializers.BooleanField(
        default=False,
        help_text="Ghi nhớ đăng nhập"
    )
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            # Thử authenticate với username
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            
            # Nếu không được thì thử với email
            if not user:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(
                        request=self.context.get('request'),
                        username=user_obj.username,
                        password=password
                    )
                except User.DoesNotExist:
                    pass
            
            if not user:
                raise serializers.ValidationError(
                    'Tên đăng nhập hoặc mật khẩu không chính xác.'
                )
            
            # Kiểm tra tài khoản có bị khóa không
            if user.is_account_locked():
                raise serializers.ValidationError(
                    f'Tài khoản đã bị khóa đến {user.locked_until}.'
                )
            
            # Kiểm tra trạng thái tài khoản
            if not user.is_active:
                raise serializers.ValidationError(
                    'Tài khoản đã bị vô hiệu hóa.'
                )
            
            if user.status != 'active':
                status_messages = {
                    'pending': 'Tài khoản chưa được duyệt.',
                    'suspended': 'Tài khoản đã bị tạm dừng.',
                    'inactive': 'Tài khoản không hoạt động.'
                }
                raise serializers.ValidationError(
                    status_messages.get(user.status, 'Tài khoản không khả dụng.')
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Vui lòng nhập tên đăng nhập và mật khẩu.'
            )

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer cho đổi mật khẩu
    """
    old_password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Mật khẩu hiện tại"
    )
    
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Mật khẩu mới"
    )
    
    confirm_password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Xác nhận mật khẩu mới"
    )
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Mật khẩu hiện tại không chính xác.')
        return value
    
    def validate_new_password(self, value):
        user = self.context['request'].user
        try:
            validate_password(value, user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            raise serializers.ValidationError(
                {'confirm_password': 'Mật khẩu xác nhận không khớp.'}
            )
        
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer cho thông tin cá nhân user
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    user_roles = serializers.SerializerMethodField()
    accessible_modules = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'address', 'avatar', 'avatar_url', 'user_type', 'status',
            'employee_id', 'notification_enabled', 'email_notification',
            'language', 'timezone_user', 'last_login', 'date_joined',
            'user_roles', 'accessible_modules'
        ]
        read_only_fields = [
            'id', 'username', 'user_type', 'status', 'employee_id',
            'last_login', 'date_joined'
        ]
    
    def get_user_roles(self, obj):
        """Lấy danh sách vai trò của user"""
        active_roles = obj.user_roles.filter(is_active=True)
        return [
            {
                'id': ur.role.id,
                'name': ur.role.name,
                'code': ur.role.code,
                'type': ur.role.role_type,
                'assigned_at': ur.assigned_at,
                'expires_at': ur.expires_at
            }
            for ur in active_roles
        ]
    
    def get_accessible_modules(self, obj):
        """Lấy danh sách modules có thể truy cập"""
        return obj.get_accessible_modules()
    
    def get_avatar_url(self, obj):
        """Lấy URL avatar"""
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
        return None

class UserPermissionSerializer(serializers.Serializer):
    """
    Serializer cho kiểm tra quyền user
    """
    module = serializers.CharField(help_text="Tên module")
    action = serializers.CharField(help_text="Hành động")
    context = serializers.JSONField(required=False, help_text="Context bổ sung")
    
    def validate_module(self, value):
        valid_modules = [choice[0] for choice in ModulePermission.MODULE_CHOICES]
        if value not in valid_modules:
            raise serializers.ValidationError(f'Module không hợp lệ. Cho phép: {valid_modules}')
        return value
    
    def validate_action(self, value):
        valid_actions = [choice[0] for choice in ModulePermission.ACTION_CHOICES]
        if value not in valid_actions:
            raise serializers.ValidationError(f'Action không hợp lệ. Cho phép: {valid_actions}')
        return value

class TokenResponseSerializer(serializers.Serializer):
    """
    Serializer cho response token
    """
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    token_type = serializers.CharField(default='Bearer')
    expires_in = serializers.IntegerField()
    user = UserProfileSerializer()
    permissions = serializers.JSONField()

class RefreshTokenSerializer(serializers.Serializer):
    """
    Serializer cho refresh token
    """
    refresh_token = serializers.CharField(help_text="Refresh token")
    
    def validate_refresh_token(self, value):
        # Implement refresh token validation logic
        return value

class ForgotPasswordSerializer(serializers.Serializer):
    """
    Serializer cho quên mật khẩu
    """
    email = serializers.EmailField(help_text="Email đăng ký")
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError('Email không tồn tại trong hệ thống.')
        return value

class ResetPasswordSerializer(serializers.Serializer):
    """
    Serializer cho reset mật khẩu
    """
    token = serializers.CharField(help_text="Reset token")
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Mật khẩu mới"
    )
    confirm_password = serializers.CharField(
        style={'input_type': 'password'},
        help_text="Xác nhận mật khẩu mới"
    )
    
    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            raise serializers.ValidationError(
                {'confirm_password': 'Mật khẩu xác nhận không khớp.'}
            )
        
        return attrs

class LogoutSerializer(serializers.Serializer):
    """
    Serializer cho đăng xuất
    """
    refresh_token = serializers.CharField(
        required=False,
        help_text="Refresh token để blacklist"
    )
    
    logout_all_devices = serializers.BooleanField(
        default=False,
        help_text="Đăng xuất tất cả thiết bị"
    )
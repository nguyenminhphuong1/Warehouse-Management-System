# backend/apps/accounts/views/auth.py

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import login, logout
from django.utils import timezone
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.models import User, PermissionAuditLog
from apps.accounts.serializers.auth import (
    LoginSerializer, ChangePasswordSerializer, UserProfileSerializer,
    UserPermissionSerializer, TokenResponseSerializer, RefreshTokenSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer, LogoutSerializer
)
from apps.core.utils.helpers import get_client_ip, get_user_agent

class LoginView(APIView):
    """
    API đăng nhập
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            remember_me = serializer.validated_data.get('remember_me', False)
            
            try:
                # Reset failed login attempts nếu đăng nhập thành công
                user.reset_failed_login()
                
                # Cập nhật thông tin đăng nhập
                user.update_last_activity()
                user.is_active_session = True
                user.save(update_fields=['is_active_session'])
                
                # Tạo JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                # Cấu hình thời gian expires dựa trên remember_me
                if remember_me:
                    refresh.set_exp(lifetime=timezone.timedelta(days=30))
                    access_token.set_exp(lifetime=timezone.timedelta(hours=24))
                else:
                    refresh.set_exp(lifetime=timezone.timedelta(days=7))
                    access_token.set_exp(lifetime=timezone.timedelta(hours=8))
                
                # Lấy thông tin permissions
                permissions_data = self._get_user_permissions(user)
                
                # Log successful login
                PermissionAuditLog.log_login_attempt(
                    user=user,
                    success=True,
                    ip_address=get_client_ip(request),
                    user_agent=get_user_agent(request)
                )

                response_data = {
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'token_type': 'Bearer',
                    'expires_in': int(access_token.lifetime.total_seconds()),
                    'user': UserProfileSerializer(user, context={'request': request}).data,
                    'permissions': permissions_data
                }

                return Response(response_data, status=status.HTTP_200_OK)
                
            except Exception as e:
                import traceback
                traceback.print_exc()
                # Log failed login
                PermissionAuditLog.log_login_attempt(
                    user=user,
                    success=False,
                    ip_address=get_client_ip(request),
                    user_agent=get_user_agent(request),
                    error_message=str(e)
                )
                
                return Response(
            {'error': str(e)},  # 👈 In lỗi thật ra thay vì ẩn
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
        else:
            # Log failed login attempt với username nếu có
            username = request.data.get('username')
            if username:
                try:
                    user = User.objects.get(username=username)
                    user.increment_failed_login()
                    
                    PermissionAuditLog.log_login_attempt(
                        user=user,
                        success=False,
                        ip_address=get_client_ip(request),
                        user_agent=get_user_agent(request),
                        error_message='Invalid credentials'
                    )
                except User.DoesNotExist:
                    pass
            
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _get_user_permissions(self, user):
        """Lấy thông tin permissions của user"""
        permissions = {
            'modules': {},
            'is_admin': user.is_admin(),
            'accessible_modules': user.get_accessible_modules()
        }
        
        # Lấy chi tiết permissions cho từng module
        for module in user.get_accessible_modules():
            module_permissions = []
            for user_role in user.user_roles.filter(is_active=True):
                role_permissions = user_role.role.get_actions_for_module(module)
                module_permissions.extend(role_permissions)
            
            permissions['modules'][module] = list(set(module_permissions))
        
        return permissions

class LogoutView(APIView):
    """
    API đăng xuất
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            logout_all = request.data.get('logout_all_devices', False)

            if logout_all:
                # Logout from all devices
                request.user.is_active_session = False
                request.user.save(update_fields=['is_active_session'])
            elif refresh_token:
                # Blacklist single refresh token
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    return Response(
                        {'error': 'Invalid token.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Log logout action
            PermissionAuditLog.log_permission_change(
                user=request.user,
                action_type='logout',
                success=True,
                ip_address=get_client_ip(request),
                user_agent=get_user_agent(request)
            )

            return Response({'message': 'Đăng xuất thành công.'})

        except Exception as e:
            return Response(
                {'error': 'Đã xảy ra lỗi trong quá trình đăng xuất.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RefreshTokenView(APIView):
    """
    API refresh token
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        
        if serializer.is_valid():
            refresh_token = serializer.validated_data['refresh_token']
            
            try:
                refresh = RefreshToken(refresh_token)
                user = User.objects.get(id=refresh['user_id'])
                
                # Kiểm tra user vẫn active
                if not user.is_active or user.status != 'active':
                    return Response(
                        {'error': 'Tài khoản không khả dụng.'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                
                # Tạo access token mới
                new_access_token = refresh.access_token
                
                return Response({
                    'access_token': str(new_access_token),
                    'token_type': 'Bearer',
                    'expires_in': int(new_access_token.lifetime.total_seconds())
                })
                
            except TokenError:
                return Response(
                    {'error': 'Refresh token không hợp lệ.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            except User.DoesNotExist:
                return Response(
                    {'error': 'User không tồn tại.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class ChangePasswordView(APIView):
    """
    API đổi mật khẩu
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = serializer.validated_data['user']
            remember_me = serializer.validated_data.get('remember_me', False)

            try:
                # Reset số lần đăng nhập thất bại
                user.reset_failed_login()

                # Cập nhật thông tin đăng nhập
                user.update_last_activity()
                user.is_active_session = True
                user.save(update_fields=['is_active_session'])

                # Tạo JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # Cấu hình thời gian token dựa vào remember_me
                if remember_me:
                    refresh.set_exp(lifetime=timezone.timedelta(days=30))
                    access_token.set_exp(lifetime=timezone.timedelta(hours=24))
                else:
                    refresh.set_exp(lifetime=timezone.timedelta(days=7))
                    access_token.set_exp(lifetime=timezone.timedelta(hours=8))

                # Lấy thông tin permissions
                permissions_data = self._get_user_permissions(user)

                # Log successful login
                PermissionAuditLog.log_login_attempt(
                    user=user,
                    success=True,
                    ip_address=get_client_ip(request),
                    user_agent=get_user_agent(request)
                )

                response_data = {
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'token_type': 'Bearer',
                    'expires_in': int(access_token.lifetime.total_seconds()),
                    'user': UserProfileSerializer(user, context={'request': request}).data,
                    'permissions': permissions_data
                }

                return Response(response_data, status=status.HTTP_200_OK)

            except Exception as e:
                return Response(
                    {'error': 'Đã xảy ra lỗi trong quá trình đăng nhập.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """
    API quản lý thông tin cá nhân
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Lấy thông tin cá nhân"""
        serializer = UserProfileSerializer(
            request.user,
            context={'request': request}
        )
        return Response(serializer.data)
    
    def put(self, request):
        """Cập nhật thông tin cá nhân"""
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Log profile update
            PermissionAuditLog.log_permission_change(
                user=request.user,
                action_type='update_profile',
                success=True,
                ip_address=get_client_ip(request),
                user_agent=get_user_agent(request),
                request_data=request.data
            )
            
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class CheckPermissionView(APIView):
    """
    API kiểm tra quyền của user
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = UserPermissionSerializer(data=request.data)
        
        if serializer.is_valid():
            module = serializer.validated_data['module']
            action = serializer.validated_data['action']
            context = serializer.validated_data.get('context', {})
            
            user = request.user
            has_permission = user.can_perform_action(module, action)
            
            # Kiểm tra điều kiện bổ sung nếu có
            if has_permission and context:
                # Implement additional context checks here
                pass
            
            # Log permission check
            if not has_permission:
                PermissionAuditLog.log_access_denied(
                    user=user,
                    module=module,
                    action=action,
                    ip_address=get_client_ip(request),
                    reason='Insufficient permissions'
                )
            
            return Response({
                'has_permission': has_permission,
                'module': module,
                'action': action,
                'user_id': user.id,
                'checked_at': timezone.now()
            })
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Thêm field tùy chỉnh vào token nếu muốn
        token['username'] = user.username
        token['is_admin'] = user.is_admin()

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Trả thêm thông tin user dưới dạng JSON serializable
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'full_name': self.user.get_full_name(),
            'email': self.user.email,
            'is_admin': self.user.is_admin()
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserModulesView(APIView):
    """
    API lấy danh sách modules user có thể truy cập
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        modules = user.get_accessible_modules()
        
        # Lấy chi tiết permissions cho từng module
        module_details = {}
        for module in modules:
            actions = []
            for user_role in user.user_roles.filter(is_active=True):
                role_actions = user_role.role.get_actions_for_module(module)
                actions.extend(role_actions)
            
            module_details[module] = {
                'name': dict(user.user_roles.first().role.permissions.first().MODULE_CHOICES).get(module, module),
                'actions': list(set(actions)),
                'has_full_access': 'full_access' in actions
            }
        
        # Log module access
        PermissionAuditLog.log_module_access(
            user=user,
            module='user_modules_list',
            ip_address=get_client_ip(request)
        )
        
        return Response({
            'modules': module_details,
            'is_admin': user.is_admin(),
            'total_modules': len(modules)
        })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """
    API quên mật khẩu
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email, is_active=True)
            
            # Tạo reset token (implement với Django's password reset)
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            
            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Gửi email reset password (implement email service)
            # send_reset_password_email(user, token, uidb64)
            
            # Log forgot password request
            PermissionAuditLog.log_permission_change(
                user=user,
                action_type='forgot_password_request',
                success=True,
                ip_address=get_client_ip(request),
                user_agent=get_user_agent(request),
                notes=f'Password reset requested for email: {email}'
            )
            
            return Response(
                {'message': 'Email hướng dẫn reset mật khẩu đã được gửi.'},
                status=status.HTTP_200_OK
            )
            
        except User.DoesNotExist:
            # Không tiết lộ thông tin user không tồn tại
            return Response(
                {'message': 'Email hướng dẫn reset mật khẩu đã được gửi.'},
                status=status.HTTP_200_OK
            )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """
    API reset mật khẩu
    """
    serializer = ResetPasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # Validate reset token và cập nhật mật khẩu
        # Implement token validation logic
        
        return Response(
            {'message': 'Reset mật khẩu thành công.'},
            status=status.HTTP_200_OK
        )
    
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_session_info(request):
    """
    API lấy thông tin session hiện tại
    """
    user = request.user
    
    # Lấy thông tin về các session active
    session_info = {
        'user_id': user.id,
        'username': user.username,
        'full_name': user.get_full_name(),
        'is_admin': user.is_admin(),
        'last_activity': user.last_activity,
        'session_expires': None,  # Implement based on JWT expiry
        'ip_address': get_client_ip(request),
        'user_agent': get_user_agent(request),
        'login_count': user.total_login_count,
        'must_change_password': user.need_password_change(),
        'account_status': user.status
    }
    
    return Response(session_info)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def validate_session(request):
    """
    API validate session hiện tại
    """
    user = request.user
    
    # Kiểm tra các điều kiện session
    validations = {
        'is_active': user.is_active,
        'is_account_locked': user.is_account_locked(),
        'status_valid': user.status == 'active',
        'must_change_password': user.need_password_change(),
        'session_valid': True  # Implement JWT validation
    }
    
    is_valid = all([
        validations['is_active'],
        not validations['is_account_locked'],
        validations['status_valid'],
        validations['session_valid']
    ])
    
    if not is_valid:
        PermissionAuditLog.log_permission_change(
            user=user,
            action_type='invalid_session',
            success=False,
            ip_address=get_client_ip(request),
            user_agent=get_user_agent(request),
            notes=f'Session validation failed: {validations}'
        )
    
    return Response({
        'is_valid': is_valid,
        'validations': validations,
        'message': 'Session hợp lệ' if is_valid else 'Session không hợp lệ'
    })
from functools import wraps
from django.core.exceptions import PermissionDenied
from apps.accounts.models.permission import ModulePermission

def module_permission_required(module_name):
    """Decorator to check module access permission"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.has_module_permission(module_name):
                raise PermissionDenied("No access to this module")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

def permission_required(module_name, action, context_builder=None):
    """Decorator to check specific permission"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            context = None
            if context_builder:
                context = context_builder(request, *args, **kwargs)
                
            if not request.user.has_permission(module_name, action, context):
                raise PermissionDenied(f"Permission denied: {module_name}.{action}")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

def any_permission_required(module_name, actions):
    """Decorator to check if user has any of the specified permissions"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            has_permission = ModulePermission.check_any_permission(
                request.user, module_name, actions
            )
            if not has_permission:
                raise PermissionDenied("Insufficient permissions")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
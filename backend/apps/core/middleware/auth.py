from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser

class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate users via JWT and attach to request.user
    """

    def process_request(self, request):
        jwt_auth = JWTAuthentication()

        try:
            user_auth_tuple = jwt_auth.authenticate(request)
            if user_auth_tuple is not None:
                request.user, request.auth = user_auth_tuple
            else:
                request.user = AnonymousUser()
        except Exception:
            request.user = AnonymousUser()
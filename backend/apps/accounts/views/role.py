from rest_framework import viewsets, permissions
from apps.accounts.models.role import Role
from apps.accounts.serializers import RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]
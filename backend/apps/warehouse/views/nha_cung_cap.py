from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import NhaCungCap
from ..serializers import NhaCungCapSerializer

class NhaCungCapViewSet(viewsets.ModelViewSet):
    queryset = NhaCungCap.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NhaCungCapSerializer
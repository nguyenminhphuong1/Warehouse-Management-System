from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import SanPham
from ..serializers import SanPhamSerializer

class SanPhamViewSet(viewsets.ModelViewSet):
    queryset = SanPham.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SanPhamSerializer
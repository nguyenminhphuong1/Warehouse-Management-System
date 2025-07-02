from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import SanPham
from ..serializers import SanPhamSerializer
from django_filters.rest_framework import DjangoFilterBackend

class SanPhamViewSet(viewsets.ModelViewSet):
    queryset = SanPham.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SanPhamSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nha_cung_cap', 'nhom_hang']
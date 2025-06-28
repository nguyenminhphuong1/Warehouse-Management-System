from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import LichSuXuatNhap
from ..serializers import LichSuXuatNhapSerializer

class LichSuXuatNhapViewSet(viewsets.ModelViewSet):
    queryset = LichSuXuatNhap.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LichSuXuatNhapSerializer
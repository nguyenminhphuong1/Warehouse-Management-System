from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import LichSuXuatNhap
from ..serializers import LichSuXuatNhapSerializer

class LichSuXuatNhapViewSet(viewsets.ModelViewSet):
    queryset = LichSuXuatNhap.objects.all()
   # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = LichSuXuatNhapSerializer
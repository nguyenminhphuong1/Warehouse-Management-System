from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import ThuTuXuatHang
from ..serializers import ThuTuXuatHangSerializer

class ThuTuXuatHangViewSet(viewsets.ModelViewSet):
    queryset = ThuTuXuatHang.objects.all()
   # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = ThuTuXuatHangSerializer
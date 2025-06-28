from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import ThuTuXuatHang
from ..serializers import ThuTuXuatHangSerializer

class ThuTuXuatHangViewSet(viewsets.ModelViewSet):
    queryset = ThuTuXuatHang.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ThuTuXuatHangSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import TinhTrangHang
from ..serializers import TinhTrangHangSerializer

class TinhTrangHangViewSet(viewsets.ModelViewSet):
    queryset = TinhTrangHang.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TinhTrangHangSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import CuaHang
from ..serializers import CuaHangSerializer

class CuaHangViewSet(viewsets.ModelViewSet):
    queryset = CuaHang.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CuaHangSerializer
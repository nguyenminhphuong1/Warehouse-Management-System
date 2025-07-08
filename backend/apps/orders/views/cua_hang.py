from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import CuaHang
from ..serializers import CuaHangSerializer

class CuaHangViewSet(viewsets.ModelViewSet):
    queryset = CuaHang.objects.all()
  #  permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = CuaHangSerializer
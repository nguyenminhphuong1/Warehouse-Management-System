from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import NhomHang
from ..serializers import NhomHangSerializer

class NhomHangViewSet(viewsets.ModelViewSet):
    queryset = NhomHang.objects.all()
  #  permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = NhomHangSerializer
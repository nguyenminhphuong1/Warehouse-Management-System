from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import NhomHang
from ..serializers import NhomHangSerializer

class NhomHangViewSet(viewsets.ModelViewSet):
    queryset = NhomHang.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = NhomHangSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import DonXuat
from ..serializers import DonXuatSerializer

class DonXuatViewSet(viewsets.ModelViewSet):
    queryset = DonXuat.objects.all()
   # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = DonXuatSerializer
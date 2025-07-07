from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import ChiTietDon
from ..serializers import ChiTietDonSerializer

class ChiTietDonViewSet(viewsets.ModelViewSet):
    queryset = ChiTietDon.objects.all()
   # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = ChiTietDonSerializer
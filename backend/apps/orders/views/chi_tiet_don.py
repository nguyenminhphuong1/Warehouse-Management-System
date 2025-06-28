from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import ChiTietDon
from ..serializers import ChiTietDonSerializer

class ChiTietDonViewSet(viewsets.ModelViewSet):
    queryset = ChiTietDon.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChiTietDonSerializer
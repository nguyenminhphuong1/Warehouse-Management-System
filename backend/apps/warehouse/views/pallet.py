from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Pallet
from ..serializers import PalletSerializer

class PalletViewSet(viewsets.ModelViewSet):
    queryset = Pallet.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PalletSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import KiemKe
from ..serializers import KiemKeSerializer

class KiemKeViewSet(viewsets.ModelViewSet):
    queryset = KiemKe.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = KiemKeSerializer
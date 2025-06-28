from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import ViTriKho
from ..serializers import ViTriKhoSerializer

class ViTriKhoViewSet(viewsets.ModelViewSet):
    queryset = ViTriKho.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ViTriKhoSerializer
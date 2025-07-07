from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import ChiTietKiemKe
from ..serializers import ChiTietKiemKeSerializer

class ChiTietKiemKeViewSet(viewsets.ModelViewSet):
    queryset = ChiTietKiemKe.objects.all()
 #   permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = ChiTietKiemKeSerializer
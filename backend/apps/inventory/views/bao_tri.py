from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import BaoTri
from ..serializers import BaoTriSerializer

class BaoTriViewSet(viewsets.ModelViewSet):
    queryset = BaoTri.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BaoTriSerializer
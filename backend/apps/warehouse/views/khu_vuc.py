from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import KhuVuc
from ..serializers import KhuVucSerializer

class KhuVucViewSet(viewsets.ModelViewSet):
    queryset = KhuVuc.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = KhuVucSerializer
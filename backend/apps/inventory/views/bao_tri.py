from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import BaoTri
from ..serializers import BaoTriSerializer
from django_filters.rest_framework import DjangoFilterBackend


class BaoTriViewSet(viewsets.ModelViewSet):
    queryset = BaoTri.objects.all()
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    serializer_class = BaoTriSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['doi_tuong', 'loai_bao_tri', 'trang_thai', 'muc_do_uu_tien']

    
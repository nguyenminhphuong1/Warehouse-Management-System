from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from ..models import TinhTrangHang
from ..serializers import TinhTrangHangSerializer
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status

class TinhTrangHangViewSet(viewsets.ModelViewSet):
    queryset = TinhTrangHang.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TinhTrangHangSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['loai_tinh_trang', 'muc_do']

    #API set ưu tiên cho pallet
    @swagger_auto_schema(
        method='post',
        operation_summary="Set ưu tiên cho 1 pallet",
        operation_description="API set ưu tiên cho 1 pallet",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='set_priority')
    def set_priority(self, request, pk=None):
        try:
            tinh_trang = self.get_object()
            tinh_trang.set_priority()
            return Response({f"Ưu tiên xuất pallet {tinh_trang.pallet}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API lưu ghi chú cho tình trạng hàng của pallet
    @swagger_auto_schema(
        method='post',
        operation_summary="Lưu ghi chú cho tình trạng hàng của pallet",
        operation_description="API tạo ghi chú cho tình trạng hàng",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='create_note')
    def create_note(self, request, pk=None):
        try:
            tinh_trang = self.get_object()
            ghi_chu = request.data.get("ghi_chu", "")
            tinh_trang.create_note(ghi_chu)
            return Response({f"Đã thêm ghi chú cho pallet {tinh_trang.pallet}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
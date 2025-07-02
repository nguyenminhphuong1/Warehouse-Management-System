from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Pallet
from ..serializers import PalletSerializer
from apps.orders.serializers import LichSuXuatNhapSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class PalletViewSet(viewsets.ModelViewSet):
    queryset = Pallet.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PalletSerializer

    #API lấy ra thông tin chi tiết các pallet
    @swagger_auto_schema(
        method='get',
        operation_summary="Lấy ra chi tiết các pallet",
        operation_description="API lấy ra thông tin và thông số về các pallet",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=False, methods=['get'], url_path='get_dict')
    def get_dict(self, request):
        try:
            pallets = self.get_queryset()
            data = [p.to_dict() for p in pallets]
            return Response(data)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API lấy ra lịch sử các đơn xuất lấy hàng tại pallet
    @swagger_auto_schema(
        method='get',
        operation_summary="Lấy ra lịch sử xuất pallet",
        operation_description="API lấy ra lịch sử các đơn xuất lấy hàng tại pallet.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='get_history')
    def get_history(self, request, pk=None):
        try:
            pallet = self.get_object()
            data = pallet.get_export_history()
            serializer = LichSuXuatNhapSerializer(data, many=True)
            return Response(data)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API set pallet thành trạng thái cách ly
    @swagger_auto_schema(
        method='post',
        operation_summary="Gán cách ly cho pallet",
        operation_description="API chuyển thái cho pallet thành cách ly, đồng thời tạo tình trạng hàng.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='pallet_isolating')
    def pallet_isolating(self, request, pk=None):
        try:
            pallet = self.get_object()
            nguoi_thuc_hien = request.user
            ly_do = request.data.get("ly_do", "")
            set_isolation = pallet.set_isolation(ly_do=ly_do, nguoi_thuc_hien=nguoi_thuc_hien)
            return Response({"message":f"Đã chuyển pallet {pallet.ma_pallet} thành cách ly."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API để xác nhận kiểm tra chất lượng của pallet
    @swagger_auto_schema(
        method='post',
        operation_summary="Check chất lượng pallet",
        operation_description="API update chất lượng cho pallet và tính ngày kiểm tra chất lượng.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='quality_check')
    def quality_check(self, request, pk=None):
        try:
            pallet = self.get_object()
            next_check_day = request.data.get("ngay_kiem_tra_tiep_theo", None)
            ket_qua = request.data.get("ket_qua", "")
            nguoi_kiem_tra = request.user
            quality_check = pallet.update_quality_check(ket_qua=ket_qua, ngay_kiem_tra_tiep_theo=next_check_day, nguoi_kiem_tra=nguoi_kiem_tra)
            return Response({"message":"Đã ghi nhận kết quả kiểm tra."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API xử lý chuyển vị trí của pallet
    @swagger_auto_schema(
        method='post',
        operation_summary="Chuyển vị trí pallet",
        operation_description="API chuyển vị trí của pallet và cập nhật trạng thái vị trí cũ.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='change_position')
    def change_position(self, request, pk=None):
        try:
            pallet = self.get_object()
            nguoi_thuc_hien = request.user
            vi_tri_moi = request.data.get["vi_tri_moi"]
            if not vi_tri_moi:
                return Response({"detail": "Vị trí mới là bắt buộc."}, status=400)
            pallet.move_to_position(vi_tri_moi=vi_tri_moi, nguoi_thuc_hien=nguoi_thuc_hien)
            return Response({"message":f"Đã chuyển pallet {pallet.ma_pallet} sang vị trí {vi_tri_moi.ma_vi_tri}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
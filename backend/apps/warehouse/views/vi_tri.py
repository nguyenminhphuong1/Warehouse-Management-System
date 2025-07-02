from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import ViTriKho, Pallet, KhuVuc
from ..serializers import ViTriKhoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from datetime import date, timedelta
from django_filters.rest_framework import DjangoFilterBackend

class ViTriKhoViewSet(viewsets.ModelViewSet):
    queryset = ViTriKho.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ViTriKhoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['khu_vuc']

    #API lấy ra các thông số vị trí
    @swagger_auto_schema(
        method='get',
        operation_summary="Thống kê vị trí",
        operation_description="API trả về các thông số chi tiết vị trí theo ID.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=False, methods=['get'], url_path='get_dict')
    def get_dict(self, request):
        try:
            vi_tri = self.get_queryset()
            data = [p.to_dict() for p in vi_tri]
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API lấy ra các vị trí trống
    @swagger_auto_schema(
        method='get',
        operation_summary="Thống kê vị trí trống",
        operation_description="API trả về vị trí trống theo ID.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=False, methods=['get'], url_path='get_available')
    def get_dict(self, request):
        try:
            vi_tri = self.get_queryset().filter(trang_thai='Trống',
                pallet__isnull=True,
                khu_vuc__trang_thai='Hoạt_động'
            )
            serializer = ViTriKhoSerializer(vi_tri, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API tính độ ưu tiên khi lấy hàng, càng nhỏ càng ưu tiên
    @swagger_auto_schema(
        method='get',
        operation_summary="Tính điểm ưu tiên",
        operation_description="API trả về điểm ưu tiên của hàng tại vị trí",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='priority_mark')
    def priority_mark(self, request, pk=None):
        try:
            vi_tri = self.get_object()
            mark = vi_tri.get_pickup_priority()
            return Response({"priority_mark": mark})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API set 1 vị trí vào trạng thái bảo trì
    @swagger_auto_schema(
        method='get',
        operation_summary="Set trạng thái báo trì",
        operation_description="API set 1 vị trí về trạng thái bảo trì",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='set_maintain')
    def set_maintain(self, request, pk=None):
        try:
            vi_tri = self.get_object()
            nguoi_thuc_hien = request.user
            ly_do = request.data.get("ly_do", "")
            vi_tri.set_maintenance(reason=ly_do, user=nguoi_thuc_hien)
            return Response({f"Bảo trì vị trí {vi_tri.ma_vi_tri}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API set hoàn thành bảo trì cho vị trí 
    @swagger_auto_schema(
        method='get',
        operation_summary="Hoàn thành bảo trì cho 1 vị trí",
        operation_description="API trả lại trạng thái bình thường của 1 vị trí",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='complete_maintain')
    def complete_maintain(self, request, pk=None):
        try:
            vi_tri = self.get_object()
            nguoi_thuc_hien = request.user
            vi_tri.complete_maintenance(user=nguoi_thuc_hien)
            return Response({f"Hoàn thành bảo trì vị trí {vi_tri.ma_vi_tri}."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @swagger_auto_schema(
        method='get',
        operation_summary="Dashboard quản lý kho",
        operation_description="API trả về các thông số cần thiết để hiển thị trên dashboard quản lý kho.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=False, methods=['get'], url_path='dashboard_quan_ly_kho')
    def dashboard_quan_ly_kho(self, request):
        try:
            tong_vi_tri = ViTriKho.objects.count()
            tong_pallets = Pallet.objects.count()
            trong = ViTriKho.objects.filter(trang_thai='Trống').count()
            day = ViTriKho.objects.filter(trang_thai='Có_hàng').count()
            if tong_vi_tri > 0:
                ty_le_su_dung = f'{(day / tong_vi_tri) * 100:.2f}%'
            else:
                ty_le_su_dung = "0.00%"

            if (tong_vi_tri - trong) > 0:
                hieu_suat = f'{(day / (tong_vi_tri - trong)) * 100:.2f}%'
            else:
                hieu_suat = "0.00%"

            can_bao_tri = ViTriKho.objects.filter(trang_thai='Bảo_trì').count()
            today = date.today()
            target_date = today + timedelta(days=3)
            pallets_sap_het_han = Pallet.objects.filter(han_su_dung = target_date).count()
            khu_vuc_can_bao_tri = KhuVuc.objects.filter(trang_thai = 'Bảo_trì').values_list('ma_khu_vuc', flat=True)
            vi_tri_can_bao_tri = ViTriKho.objects.filter(trang_thai = 'Bảo_trì').values_list('ma_vi_tri', flat=True)
            pallets_can_kiem_tra_cl = Pallet.objects.filter(ngay_kiem_tra_cl = today).count()
            data = {
                "tong_vi_tri": tong_vi_tri,
                "tong_pallets": tong_pallets,
                "can_bao_tri": can_bao_tri,
                "ty_le_su_dung": ty_le_su_dung,
                "trong": trong,
                "day": day,
                "bao_tri": can_bao_tri,
                "hieu_suat": hieu_suat,
                "pallets_sap_het_han": pallets_sap_het_han,
                "khu_vuc_can_bao_tri": list(khu_vuc_can_bao_tri),
                "vi_tri_can_bao_tri": list(vi_tri_can_bao_tri),
                "tinh_trang": hieu_suat,
                "pallets_can_kiem_tra_cl": pallets_can_kiem_tra_cl
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import ViTriKho
from ..serializers import ViTriKhoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ViTriKhoViewSet(viewsets.ModelViewSet):
    queryset = ViTriKho.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ViTriKhoSerializer

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
        
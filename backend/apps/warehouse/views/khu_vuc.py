from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import KhuVuc
from ..serializers import KhuVucSerializer, ViTriKhoSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class KhuVucViewSet(viewsets.ModelViewSet):
    queryset = KhuVuc.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = KhuVucSerializer

    #API lấy ra phần thống kê của khu vực
    @swagger_auto_schema(
        method='get',
        operation_summary="Thống kê khu vực",
        operation_description="API trả về thống kê chi tiết của khu vực theo ID.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='get_statistic')
    def get_statistic(self, request, pk=None):
        try:
            khu_vuc = self.get_object()
            data = khu_vuc.get_statistics()
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API khởi tạo tất cả vị trí trong khu vực
    @swagger_auto_schema(
        method='post',
        operation_summary="Khởi tạo các vị trí",
        operation_description="API khởi tạo các vị trí trong 1 khu vực.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['post'], url_path='create_positions')
    def create_positions(self, request, pk=None):
        try:
            khu_vuc = self.get_object()
            created_count = khu_vuc.create_all_positions()
            return Response({"message":f"Tạo thành công {created_count} vị trí."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #API lấy ra các vị trí trong khu vực theo thứ tự hàng và cột
    @swagger_auto_schema(
        method='get',
        operation_summary="Lấy ra các vị trí theo thứ tự",
        operation_description="API lấy ra các vị trí trong khu vực.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='get_grid_layout')
    def get_grid_layout(self, request, pk=None):
        try:
            khu_vuc = self.get_object()
            grid = khu_vuc.get_grid_layout()
            return Response(grid)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    #API lấy ra tất cả các vị trí trống trong khu vực
    @swagger_auto_schema(
        method='get',
        operation_summary="Lấy ra các vị trí trống",
        operation_description="API lấy ra các vị trí trống trong khu vực.",
        responses={200: openapi.Response(description="Thành công")}
    )
    @action(detail=True, methods=['get'], url_path='available_positions')
    def available_positions(self, request, pk=None):
        try:
            khu_vuc = self.get_object()
            data = khu_vuc.get_available_positions()
            serializer = ViTriKhoSerializer(data, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

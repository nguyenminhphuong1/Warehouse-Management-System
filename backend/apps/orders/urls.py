from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChiTietDonViewSet, CuaHangViewSet, LichSuXuatNhapViewSet, ThuTuXuatHangViewSet, DonXuatViewSet

router = DefaultRouter()
router.register(r'chitietdon', ChiTietDonViewSet)
router.register(r'cuahang', CuaHangViewSet)
router.register(r'lichsuxuatnhap', LichSuXuatNhapViewSet)
router.register(r'thutuxuathang', ThuTuXuatHangViewSet)
router.register(r'donxuat', DonXuatViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
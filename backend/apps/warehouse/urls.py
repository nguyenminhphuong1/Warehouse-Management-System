from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NhomHangViewSet, SanPhamViewSet, PalletViewSet, ViTriKhoViewSet, NhaCungCapViewSet, KhuVucViewSet

router = DefaultRouter()
router.register(r'nhomhang', NhomHangViewSet)
router.register(r'sanpham', SanPhamViewSet)
router.register(r'pallet', PalletViewSet)
router.register(r'vitri', ViTriKhoViewSet)
router.register(r'nhacungcap', NhaCungCapViewSet)
router.register(r'khuvuc', KhuVucViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

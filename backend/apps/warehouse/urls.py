from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

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

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

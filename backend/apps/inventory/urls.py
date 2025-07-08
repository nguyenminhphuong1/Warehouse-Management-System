from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BaoTriViewSet, KiemKeViewSet, ChiTietKiemKeViewSet, TinhTrangHangViewSet

router = DefaultRouter()
router.register(r'baotri', BaoTriViewSet)
router.register(r'kiemke', KiemKeViewSet)
router.register(r'chitietkiemke', ChiTietKiemKeViewSet)
router.register(r'tinhtranghang', TinhTrangHangViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class ThuTuXuatHang(models.Model):
    don_xuat = models.ForeignKey(
        'orders.DonXUat', 
        models.PROTECT
        )
    
    san_pham = models.ForeignKey(
        'warehouse.SanPham', 
        models.PROTECT
        )

    thu_tu_mac_dinh = models.IntegerField(null=False)
    thu_tu_tuy_chinh = models.IntegerField()
    thoi_gian_uoc_tinh = models.IntegerField(null=False, default=0)
    khoang_cach_uoc_tinh = models.IntegerField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'thu_tu_xuat_hang'
        verbose_name = 'Thứ tự xuất hàng'
        verbose_name_plural = 'Thứ tự xuất hàng'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.don_xuat.ma_don_xuat} - {self.san_pham.ten_san_pham}"
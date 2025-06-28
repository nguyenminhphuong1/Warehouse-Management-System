from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class ChiTietKiemKe(models.Model):
    kiem_ke = models.ForeignKey(
        'inventory.KiemKe', 
        models.PROTECT
        )
    
    pallet = models.ForeignKey(
        'warehouse.Pallet', 
        models.PROTECT
        )
    
    so_luong_he_thong = models.IntegerField(null=False, default=0)

    so_luong_thuc_te = models.IntegerField(blank=True, null=True)

    chenh_lech = models.IntegerField()

    trang_thai_hang = models.CharField(max_length=100, null=False, default='')

    nguoi_kiem_ke = models.CharField(max_length=50, null=False, default='')

    thoi_gian_kiem_ke = models.DateTimeField(default=timezone.now)

    ghi_chu = models.CharField(null=False, default='')

    hinh_anh = models.JSONField(null=False, default=[])

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chi_tiet_kiem_ke'
        verbose_name = 'Chi tiết kiểm kê'
        verbose_name_plural = 'Chi tiết kiểm kê'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.phien_kiem_ke.ma_kiem_ke} - {self.pallet.ma_pallet} ({self.nguoi_kiem_ke})"
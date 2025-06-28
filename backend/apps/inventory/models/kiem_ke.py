from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class KiemKe(models.Model):
    ma_kiem_ke = models.CharField(unique=True, max_length=20, null=False)
    loai_kiem_ke = models.CharField(max_length=30, choices=[
        ('Toàn_kho', 'Toàn kho'),
        ('Khu_vực', 'Khu vực'),
        ('Theo_nhóm', 'Theo nhóm'),
        ('Theo_hạn_sử_dụng', 'Theo hạn sử dụng')
    ], null=False)
    pham_vi_kiem_ke = models.JSONField(null=False, default={})
    ngay_kiem_ke = models.DateField(null=False, default=timezone.now)
    nguoi_tao = models.CharField(max_length=50, null=False)
    danh_sach_nguoi_phu_trach = models.JSONField(null=False, default=[])
    trang_thai = models.CharField(max_length=20, choices=[
        ('Chuẩn_bị', 'Chuẩn bị'),
        ('Đang_kiểm_kê', 'Đang kiểm kê'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Chuẩn_bị')
    ghi_chu = models.TextField(null=False, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'kiem_ke'
        verbose_name = 'Kiểm kê'
        verbose_name_plural = 'Kiểm kê'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.ma_kiem_ke} - {self.nguoi_phu_trach}"
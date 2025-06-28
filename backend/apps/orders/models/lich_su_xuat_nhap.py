from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class LichSuXuatNhap(models.Model):
    LOAI_GIAO_DICH_CHOICES = [
        ('Nhập', 'Nhập'),
        ('Xuất', 'Xuất'),
        ('Di_chuyển', 'Di chuyển'),
        ('Điều_chỉnh', 'Điều chỉnh'),
    ]
    pallets = models.ForeignKey('warehouse.Pallet', models.PROTECT)
    loai_giao_dich = models.CharField(
        max_length=20,
        null=False,
        choices=LOAI_GIAO_DICH_CHOICES,
        default='Nhập'
        )
    so_luong = models.IntegerField(null=False)
    don_xuat = models.ForeignKey('orders.DonXUat', models.PROTECT)
    nguoi_thuc_hien = models.CharField(null=False, default='')
    ngay_thuc_hien = models.DateTimeField(auto_now_add=True)
    ghi_chu = models.TextField(null=False, default='')

    class Meta:
        db_table = 'lich_su_xuat_nhap'
        verbose_name = 'Lịch sử xuất nhập'
        verbose_name_plural = 'Lịch sử xuất nhập'
        ordering = ['-ngay_thuc_hien']

    def __str__(self):
        return f"{self.pallets.ma_pallet} - {self.loai_giao_dich}"
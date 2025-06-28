from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class ChiTietDon(models.Model):
    don_xuat = models.ForeignKey(
        'orders.DonXuat', 
        models.PROTECT
        )
    
    san_pham = models.ForeignKey(
        'warehouse.SanPham', 
        models.PROTECT
        )
    
    so_luong_can = models.IntegerField(
        validators=[MinValueValidator(1)],
        null=False,
    )

    so_luong_da_xuat = models.IntegerField(
        null=False,
        default=0,
        validators=[MinValueValidator(0)],
    )

    pallet_assignments = models.JSONField(
        null=False,
        default=[]
        )
    
    da_xuat_xong = models.BooleanField(
        null=True, 
        default=False
        )
    
    ghi_chu = models.TextField(
        null=False,
        default=''
        )

    class Meta:
        db_table = 'chi_tiet_don'
        verbose_name = 'Chi tiết đơn'
        verbose_name_plural = 'Chi tiết đơn'

    def __str__(self):
        return f"{self.don_xuat} - {self.san_pham}"
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class DonXuat(models.Model):
    TRANG_THAI_CHOICES = [
        ('Chờ_xuất', 'Chờ xuất'),
        ('Đang_xuất', 'Đang xuất'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ]

    ma_don = models.CharField(
        unique=True, 
        max_length=20,
        null=False
        )
    
    cua_hang = models.ForeignKey(
        'orders.CuaHang', 
        models.PROTECT
        )
    
    ngay_tao = models.DateField(
        null=False,
        default=timezone.now
    )

    ngay_giao = models.DateField(
        blank=True, 
        null=True
        )
    
    trang_thai = models.CharField(
        max_length=20, 
        null=False,
        choices=TRANG_THAI_CHOICES, 
        default='Chờ_xuất'
    )

    qr_code_data = models.TextField(
        null=False,
        default=''
        )
    
    da_in_qr = models.BooleanField( 
        null=False, 
        default=False
        )
    
    nguoi_tao = models.CharField(
        max_length=50, 
        null=False,
        default=''
        )
    
    ghi_chu = models.TextField(
        null=False,
        default=''
        )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'don_xuat'
        verbose_name = 'Đơn xuất'
        verbose_name_plural = 'Đơn xuất'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ma_don} - {self.cua_hang}"
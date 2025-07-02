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
    )
    
    cua_hang = models.ForeignKey(
        'orders.CuaHang', 
        models.PROTECT
    )
    
    ngay_tao = models.DateField(
        default=timezone.now,
        blank=True,
    )

    ngay_giao = models.DateField(
        blank=True, 
        null=True
    )
    
    trang_thai = models.CharField(
        max_length=20, 
        choices=TRANG_THAI_CHOICES, 
        default='Chờ_xuất'
    )

    qr_code_data = models.TextField(
        default='',
        blank=True,
    )
    
    da_in_qr = models.BooleanField( 
        default=False
    )
    
    nguoi_tao = models.CharField(
        max_length=50,
        blank=True, 
        default=''
    )
    
    ghi_chu = models.TextField(
        default='',
        blank=True,
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'don_xuat'
        verbose_name = 'Đơn xuất'
        verbose_name_plural = 'Đơn xuất'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ma_don} - {self.cua_hang.ten_cua_hang}"
    
    def save(self, *args, **kwargs):
        """Override save để tự động tạo mã order"""
        if not self.ma_don:
            self.generate_order_code(self.cua_hang, self.ngay_giao)
        super().save(*args, **kwargs)
    

    def generate_order_code(self, cua_hang, ngay_giao):
        """Tạo mã đơn xuất tự động"""
        auto_order_code = f"Order-{cua_hang}-{ngay_giao}"
        return auto_order_code
    

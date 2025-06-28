from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta

class CuaHang(models.Model):
    TRANG_THAI_CHOICES = [
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng')
    ]

    ma_cua_hang = models.CharField(
        unique=True, 
        max_length=20, 
        null=False
        )
    
    ten_cua_hang = models.CharField(
        max_length=100, 
        null=False
        )
    
    dia_chi = models.CharField(
        max_length=100, 
        null=False
        )
    
    so_dien_thoai = models.CharField(
        max_length=15,  
        null=False,
        default='',
        )
    
    khu_vuc = models.CharField(
        max_length=50,
        null=False,
        default=''
    )
    
    trang_thai = models.CharField(
        max_length=20, 
        choices=TRANG_THAI_CHOICES, 
        default='Hoạt_động'
        )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cua_hang'
        verbose_name = 'Cửa hàng'
        verbose_name_plural = 'Cửa hàng'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.ma_cua_hang} - {self.ten_cua_hang} ({self.dia_chi})"
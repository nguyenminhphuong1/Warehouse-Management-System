from django.db import models
from django.core.exceptions import ValidationError
import re

class CuaHang(models.Model):
    TRANG_THAI_CHOICES = [
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng')
    ]

    ma_cua_hang = models.CharField(
        unique=True, 
        max_length=20, 
    )
    
    ten_cua_hang = models.CharField(
        max_length=100, 
    )
    
    dia_chi = models.CharField(
        max_length=100, 
        blank=True,
    )
    
    so_dien_thoai = models.CharField(
        max_length=15,  
        default='',
        blank=True,
    )
    
    khu_vuc = models.CharField(
        max_length=50,
        default='',
        blank=True,
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
    
    def clean(self):
        """Validate model"""
        errors = {}
        if not re.match(r'^0\d{9}$', self.so_dien_thoai):
            errors['so_dien_thoai'] = "SĐT phải bắt đầu bằng 0 và đủ 10 số."

        if errors:
            raise ValidationError(errors)
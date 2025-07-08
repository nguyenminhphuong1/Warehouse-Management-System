
from django.db import models
from django.core.exceptions import ValidationError
import re

class NhaCungCap(models.Model):
    ma_nha_cung_cap = models.CharField(
        unique=True, 
        max_length=20, 
    )

    ten_nha_cung_cap = models.CharField(
        max_length=200, 
    )

    dia_chi = models.TextField(
        blank=True,
        default=''
    )

    so_dien_thoai = models.CharField(
        blank=True,
        max_length=20, 
        default=''
    )

    email = models.EmailField(
        max_length=100, 
        blank=True,
        error_messages={'invalid':'Email không hợp lệ!'},
        default=''
    )

    nguoi_lien_he = models.CharField(
        max_length=100, 
        blank=True,
        default=''
    )

    so_dien_thoai_lien_he = models.CharField(
        max_length=20, 
        blank=True,
        default=''
    )

    email_lien_he = models.EmailField(
        max_length=100, 
        blank=True,
        error_messages={'invalid':'Email không hợp lệ!'},
        default=''
    )

    ma_so_thue = models.CharField(
        max_length=50, 
        blank=True,
        default=''
    )

    loai_hang_cung_cap = models.JSONField(
        blank=True,
        default=[]
    )

    xep_hang = models.CharField(
        max_length=1, 
        choices=[
            ('A', 'A'),
            ('B', 'B'),
            ('C', 'C'),
            ('D', 'D')
        ], 
        default='B'
    )

    trang_thai = models.CharField(
        max_length=20, 
        choices=[
            ('Hoạt_động', 'Hoạt động'),
            ('Tạm_dừng', 'Tạm dừng'),
            ('Ngừng', 'Ngừng')
        ], 
        default='Hoạt_động'
    )

    ghi_chu = models.TextField(
        blank=True,
        default=''
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'nha_cung_cap'
        verbose_name = 'Nhà cung cấp'
        verbose_name_plural = 'Nhà cung cấp'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ma_nha_cung_cap} - {self.ten_nha_cung_cap}"
    
    def clean(self):
        """Validate model"""
        errors = {}
        if not re.match(r'^0\d{9}$', self.so_dien_thoai):
            errors['so_dien_thoai'] = "SĐT phải bắt đầu bằng 0 và đủ 10 số."
        if not re.match(r'^0\d{9}$', self.so_dien_thoai_lien_he):
            errors['so_dien_thoai_lien_he'] = "SĐT phải bắt đầu bằng 0 và đủ 10 số."

        if errors:
            raise ValidationError(errors)       


from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class NhaCungCap(models.Model):
    ma_nha_cung_cap = models.CharField(unique=True, max_length=20, null=False)
    ten_nha_cung_cap = models.CharField(max_length=200, null=False)
    dia_chi = models.TextField(null=False, default='')
    so_dien_thoai = models.CharField(max_length=20, null=False, default='')
    email = models.CharField(max_length=100, null=False, default='')
    nguoi_lien_he = models.CharField(max_length=100, null=False, default='')
    so_dien_thoai_lien_he = models.CharField(max_length=20, null=False, default='')
    email_lien_he = models.CharField(max_length=100, null=False, default='')
    ma_so_thue = models.CharField(max_length=50, null=False, default='')
    loai_hang_cung_cap = models.JSONField(null=False, default=[])
    xep_hang = models.CharField(max_length=1, null=False, choices=[
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D')
    ], default='B')
    trang_thai = models.CharField(max_length=20, null=False, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng'),
        ('Ngừng', 'Ngừng')
    ], default='Hoạt_động')
    ghi_chu = models.TextField(null=False, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'nha_cung_cap'
        verbose_name = 'Nhà cung cấp'
        verbose_name_plural = 'Nhà cung cấp'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ma_nha_cung_cap} - {self.ten_nha_cung_cap}"

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone

class SanPham(models.Model):
    TRANG_THAI_CHOICES = [
        ('Hoạt_động', 'Hoạt động'),
        ('Ngừng', 'Ngừng')
    ]

    ma_san_pham = models.CharField(
        unique=True, 
        max_length=50,
    )
    
    ten_san_pham = models.CharField(
        max_length=100,
    )
    
    nhom_hang = models.ForeignKey(
        'warehouse.NhomHang', 
        models.PROTECT,
        related_name='san_pham_set'
    )
    
    thuong_hieu = models.CharField(
        max_length=100,  
        blank=True,
        default=''
    )
    
    dung_tich = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    
    don_vi_tinh = models.CharField(
        max_length=20, 
        blank=True,
        default='thùng'
    )
    
    so_luong_per_thung = models.IntegerField(
        default=1,
        blank=True,
    )
    
    ma_vach = models.CharField(
        max_length=100,  
        default='',
        blank=True,
    )
    
    nha_cung_cap = models.ForeignKey(
        'warehouse.NhaCungCap', 
        models.PROTECT
    )
    
    han_su_dung_mac_dinh = models.IntegerField( 
        null=True,
        blank=True,
        default=365
    )
    
    chu_ky_kiem_tra_cl = models.IntegerField(
        null=True,
        blank=True,
        default=30
    )
    
    hinh_anh = models.CharField(
        max_length=255, 
        blank=True,
        default=''
    )
    
    mo_ta = models.TextField(
        default='',
        blank=True,
    )
    
    trang_thai = models.CharField(
        max_length=20, 
        choices=TRANG_THAI_CHOICES, 
        default='Hoạt_động'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'san_pham'
        verbose_name = 'Sản phẩm'
        verbose_name_plural = 'Sản phẩm'
        ordering = ['ma_san_pham']

    def __str__(self):
        return f"{self.ma_san_pham} - {self.ten_san_pham}"

    def save(self, *args, **kwargs):
        if not self.chu_ky_kiem_tra_cl:
            cycle_days = self.san_pham.chu_ky_kiem_tra_cl or 30
            self.chu_ky_kiem_tra_cl = self.ngay_san_xuat + timedelta(days=cycle_days)
        
        super().save(*args, **kwargs)

    
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
import re

class BaoTri(models.Model):
    ma_bao_tri = models.CharField(
        unique=True, 
        max_length=20,
    )
    
    tieu_de = models.CharField(max_length=200)

    loai_bao_tri = models.CharField(max_length=20, choices=[
        ('Vệ_sinh', 'Vệ sinh'),
        ('Sửa_chữa', 'Sửa chữa'),
        ('Kiểm_tra', 'Kiểm tra'),
        ('Thay_thế', 'Thay thế'),
        ('Bảo_dưỡng', 'Bảo dưỡng')
    ])

    doi_tuong = models.CharField(max_length=50, choices=[
        ('Khu_vực', 'Khu vực'),
        ('Vị_trí', 'Vị trí'),
        ('Thiết_bị', 'Thiết bị'),
        ('Hệ_thống', 'Hệ thống')
    ])

    doi_tuong_id = models.CharField(
        max_length=50, 
        blank=True, 
        null=True)
    
    mo_ta = models.TextField(default='', blank=True,)

    muc_do_uu_tien = models.CharField(
        max_length=8, 
        choices=[
           ('Thấp', 'Thấp'),
            ('Vừa', 'Vừa'),
            ('Cao', 'Cao'),
            ('Khẩn_cấp', 'Khẩn cấp') 
        ],
        default='Vừa'
    )
    
    nguoi_tao = models.CharField(max_length=50, null=False)

    nguoi_thuc_hien = models.JSONField(
        default=[],
        blank=True,
    )
    
    thoi_gian_bat_dau = models.DateTimeField(
        blank=True, 
        null=True,
    )
    
    thoi_gian_ket_thuc = models.DateTimeField(
        blank=True, 
        null=True
    )
    
    thoi_gian_uoc_tinh = models.IntegerField(
        blank=True, 
        null=True,
        validators=[MinValueValidator(1)]
    )
    
    chi_phi_uoc_tinh = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(0)]
    )
    
    chi_phi_thuc_te = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(0)]
    )
    
    trang_thai = models.CharField(max_length=14, choices=[
        ('Kế_hoạch', 'Kế hoạch'),
        ('Đang_thực_hiện', 'Đang_thực_hiện'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Tạm_dừng', 'Tạm dừng'),
        ('Hủy', 'Hủy')
    ], default='Kế_hoạch')

    ket_qua = models.TextField(
        default=''
    )
    
    hinh_anh_truoc = models.JSONField(
        default=[],
        blank=True,
    )
    
    hinh_anh_sau = models.JSONField(
        default=[],
        blank=True,
    )
    
    ghi_chu = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bao_tri'
        verbose_name = 'Bảo trì'
        verbose_name_plural = 'Bảo trì'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.ma_bao_tri} - {self.tieu_de} - {self.doi_tuong}"
    
    def clean(self):
        """Validate model"""
        errors = {}

        if self.thoi_gian_bat_dau >= self.thoi_gian_ket_thuc:
            errors['thoi_gian_bat_dau'] = "Thời gian bắt đầu phải trước thời gian kết thúc."

        if errors:
            raise ValidationError(errors)
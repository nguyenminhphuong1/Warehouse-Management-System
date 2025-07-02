from django.db import models
from django.core.exceptions import ValidationError


class TinhTrangHang(models.Model):
    pallet = models.ForeignKey('warehouse.Pallet', models.PROTECT)
    loai_tinh_trang = models.CharField(max_length=30, choices=[
        ('Bình_thường', 'Bình thường'),
        ('Sắp_hết_hạn', 'Sắp hết hạn'),
        ('Cần_kiểm_tra_CL', 'Cần kiểm tra CL'),
        ('Có_vấn_đề', 'Có vấn đề'),
        ('Ưu_tiên_xuất', 'Ưu tiên xuất')
    ])
    muc_do = models.CharField(max_length=20, choices=[
        ('Thấp', 'Thấp'),
        ('Vừa', 'Vừa'),
        ('Cao', 'Cao'),
        ('Khẩn_cấp', 'Khẩn cấp')
    ], default='Vừa')
    mo_ta = models.TextField(default='', blank=True,)
    ngay_phat_hien = models.DateField()
    ngay_xu_ly = models.DateField(blank=True, null=True)
    nguoi_phat_hien = models.CharField(max_length=50, default='', blank=True,)
    nguoi_xu_ly = models.CharField(max_length=50, default='', blank=True,)
    trang_thai = models.CharField(max_length=10, choices=[
        ('Mới', 'Mới'),
        ('Đang_xử_lý', 'Đang xử lý'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Mới')
    ghi_chu = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tinh_trang_hang'
        verbose_name = 'Tình trạng hàng'
        verbose_name_plural = 'Tình trạng hàng'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.pallet.ma_pallet} - {self.loai_tinh_trang} ({self.muc_do})"
    
    def clean(self):
        """Validate model"""
        errors = {}
        if self.ngay_xu_ly > self.ngay_phat_hien:
            errors['ngay_xu_ly'] = "Ngày xử lý phải sau ngày phát hiện"

        if errors:
            raise ValidationError(errors)
from django.db import models
from django.core.validators import MinValueValidator


class LichSuXuatNhap(models.Model):
    LOAI_GIAO_DICH_CHOICES = [
        ('Nhập', 'Nhập'),
        ('Xuất', 'Xuất'),
        ('Di_chuyển', 'Di chuyển'),
        ('Điều_chỉnh', 'Điều chỉnh'),
    ]

    pallets = models.ForeignKey(
        'warehouse.Pallet', 
        models.PROTECT
    )

    loai_giao_dich = models.CharField(
        max_length=20,
        choices=LOAI_GIAO_DICH_CHOICES,
        default='Nhập'
    )

    so_luong = models.IntegerField(
        validators=[MinValueValidator(1)],
        blank=True,
    )

    don_xuat = models.ForeignKey(
        'orders.DonXUat', 
        models.PROTECT,
        null=True,
        blank=True,  
    )

    nguoi_thuc_hien = models.CharField(
        default='',
        blank=True,
    )

    ngay_thuc_hien = models.DateTimeField(auto_now_add=True)

    ghi_chu = models.TextField(
        blank=True,
        default=''
    )

    class Meta:
        db_table = 'lich_su_xuat_nhap'
        verbose_name = 'Lịch sử xuất nhập'
        verbose_name_plural = 'Lịch sử xuất nhập'
        ordering = ['-ngay_thuc_hien']

    def __str__(self):
        return f"{self.pallets.ma_pallet} - {self.loai_giao_dich}"
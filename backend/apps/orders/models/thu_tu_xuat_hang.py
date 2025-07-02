from django.db import models

class ThuTuXuatHang(models.Model):
    don_xuat = models.ForeignKey(
        'orders.DonXUat', 
        models.PROTECT
    )
    
    san_pham = models.ForeignKey(
        'warehouse.SanPham', 
        models.PROTECT
    )

    thu_tu_mac_dinh = models.IntegerField(blank=True,)
    thu_tu_tuy_chinh = models.IntegerField(null=True, blank=True,)
    thoi_gian_uoc_tinh = models.IntegerField(default=0, blank=True,)
    khoang_cach_uoc_tinh = models.IntegerField(default=0, blank=True,)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'thu_tu_xuat_hang'
        verbose_name = 'Thứ tự xuất hàng'
        verbose_name_plural = 'Thứ tự xuất hàng'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.don_xuat.ma_don_xuat} - {self.san_pham.ten_san_pham}"
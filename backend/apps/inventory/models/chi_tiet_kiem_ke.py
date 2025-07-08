from django.db import models
from django.utils import timezone

class ChiTietKiemKe(models.Model):
    kiem_ke = models.ForeignKey(
        'inventory.KiemKe', 
        models.PROTECT
        )
    
    pallet = models.ForeignKey(
        'warehouse.Pallet', 
        models.PROTECT
        )
    
    so_luong_he_thong = models.IntegerField(default=0, blank=True,)
    so_luong_thuc_te = models.IntegerField(blank=True, null=True)
    chenh_lech = models.IntegerField(blank=True,)
    trang_thai_hang = models.CharField(max_length=100, blank=True, default='')
    nguoi_kiem_ke = models.CharField(max_length=50, blank=True, default='')
    thoi_gian_kiem_ke = models.DateTimeField(default=timezone.now, blank=True,)
    ghi_chu = models.CharField(default='', blank=True,)
    hinh_anh = models.JSONField(default=[], blank=True,)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chi_tiet_kiem_ke'
        verbose_name = 'Chi tiết kiểm kê'
        verbose_name_plural = 'Chi tiết kiểm kê'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.phien_kiem_ke.ma_kiem_ke} - {self.pallet.ma_pallet} ({self.nguoi_kiem_ke})"
    
    def save(self, *args, **kwargs):
        """Override save để tính chênh lệch"""
        if self.so_luong_he_thong and self.so_luong_thuc_te:
            self.chenh_lech = abs(self.so_luong_thuc_te - self.so_luong_he_thong)
        else:
            self.chenh_lech = 0
        
        super().save(*args, **kwargs)


# backend/apps/warehouse/models/vi_tri.py

from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

class ViTriKho(models.Model):
    """
    Model quản lý vị trí trong kho
    """
    LOAI_VI_TRI_CHOICES = [
        ('Pallet', 'Pallet'),
        ('Carton', 'Carton'),
        ('Bulk', 'Bulk')
    ]
    
    TRANG_THAI_CHOICES = [
        ('Trống', 'Trống'),
        ('Có_hàng', 'Có hàng'),
        ('Bảo_trì', 'Bảo trì'),
        ('Hỏng', 'Hỏng')
    ]
    
    # Thông tin cơ bản
    ma_vi_tri = models.CharField(
        max_length=10,
        unique=True,
        help_text="Mã vị trí (A1, A2, B1, B2...)"
    )
    
    khu_vuc = models.ForeignKey(
        'warehouse.KhuVuc',
        on_delete=models.CASCADE,
        related_name='vi_tri_set',
        help_text="Khu vực chứa vị trí này"
    )
    
    hang = models.CharField(
        max_length=1,
        help_text="Hàng (A, B, C, D, E...)"
    )
    
    cot = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Cột (1, 2, 3, 4, 5...)"
    )
    
    # Phân loại
    loai_vi_tri = models.CharField(
        max_length=10,
        blank=True,
        choices=LOAI_VI_TRI_CHOICES,
        default='Pallet',
        help_text="Loại vị trí lưu trữ"
    )
    
    # Thông số kỹ thuật
    tai_trong_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Tải trọng tối đa (kg)"
    )
    
    chieu_cao_max = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Chiều cao tối đa (cm)"
    )
    
    # Trạng thái
    trang_thai = models.CharField(
        max_length=20,
        choices=TRANG_THAI_CHOICES,
        default='Trống',
        blank=True,
        help_text="Trạng thái vị trí"
    )
    
    # Quan hệ với pallet
    pallet = models.ForeignKey(
        'warehouse.Pallet',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vi_tri_set',
        help_text="Pallet đang được lưu trữ"
    )
    
    # Cấu hình đặc biệt
    uu_tien_fifo = models.BooleanField(
        default=True,
        help_text="Ưu tiên FIFO (First In First Out)"
    )
    
    gan_cua_ra = models.BooleanField(
        default=False,
        help_text="Gần cửa ra (xuất hàng nhanh)"
    )
    
    vi_tri_cach_ly = models.BooleanField(
        default=False,
        help_text="Vị trí cách ly (hàng đặc biệt)"
    )
    
    # Ghi chú
    ghi_chu = models.TextField(
        blank=True,
        help_text="Ghi chú về vị trí"
    )
    
    # Thời gian
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vi_tri_kho'
        verbose_name = 'Vị trí kho'
        verbose_name_plural = 'Vị trí kho'
        ordering = ['khu_vuc__ma_khu_vuc', 'hang', 'cot']
        indexes = [
            models.Index(fields=['ma_vi_tri']),
            models.Index(fields=['khu_vuc', 'trang_thai']),
            models.Index(fields=['hang', 'cot']),
            models.Index(fields=['trang_thai']),
            models.Index(fields=['uu_tien_fifo']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['khu_vuc', 'hang', 'cot'],
                name='unique_khu_vuc_hang_cot'
            )
        ]
    
    def __str__(self):
        return f"{self.ma_vi_tri} ({self.get_trang_thai_display()})"
    
    def save(self, *args, **kwargs):
        """Override save để tự động tạo mã vị trí"""
        if not self.ma_vi_tri:
            self.ma_vi_tri = f"{self.khu_vuc.ma_khu_vuc}{self.hang}{self.cot}"

        # Kiểm tra nếu có pallet thì trạng thái phải là "Có_hàng"
        if self.pallet:
            self.trang_thai = "Có_hàng"
        
        super().save(*args, **kwargs)
    
    def clean(self):
        """Validate model"""
        errors = {}        
        # Kiểm tra hang phải là chữ cái
        if not self.hang.isalpha() or len(self.hang) != 1:
            errors['hang'] = "Hàng phải là chữ cái. VD: A, B, ..."  
                  
        # Kiểm tra vị trí có trong phạm vi khu vực không
        hang_index = ord(self.hang.upper()) - ord('A')
        if hang_index >= self.khu_vuc.kich_thuoc_hang:
            errors['hang'] = f"Hàng {self.hang} vượt quá kích thước khu vực."
        
        if self.cot > self.khu_vuc.kich_thuoc_cot:
            errors['cot'] = f"Cột {self.cot} vượt quá kích thước khu vực."
        
        if errors:
            raise ValidationError(errors)
    
    def is_available(self):
        """Kiểm tra vị trí có sẵn để lưu trữ không"""
        return (self.trang_thai == 'Trống' and 
                self.khu_vuc.trang_thai == 'Hoạt_động' and
                not self.pallet)
    
    def can_store_pallet(self, pallet):
        """Kiểm tra có thể lưu trữ pallet này không"""
        if not self.is_available():
            return False, "Vị trí không khả dụng"
        
        # Kiểm tra tải trọng
        if self.tai_trong_max > 0 and pallet.tong_trong_luong > self.tai_trong_max:
            return False, f"Vượt quá tải trọng (max: {self.tai_trong_max}kg)"
        
        # Kiểm tra chiều cao
        if self.chieu_cao_max > 0 and pallet.chieu_cao > self.chieu_cao_max:
            return False, f"Vượt quá chiều cao (max: {self.chieu_cao_max}cm)"
        
        # Kiểm tra yêu cầu môi trường của sản phẩm
        can_store, reason = self.khu_vuc.can_store_product(pallet.san_pham)
        if not can_store:
            return False, reason
        
        # Kiểm tra vị trí cách ly
        if self.vi_tri_cach_ly and not pallet.san_pham.nhom_hang.hang_nguy_hiem:
            return False, "Vị trí cách ly chỉ dành cho hàng nguy hiểm"
        
        return True, "OK"
    
    def assign_pallet(self, pallet, user=None):
        """Gán pallet vào vị trí"""
        can_store, reason = self.can_store_pallet(pallet)
        if not can_store:
            raise ValidationError(reason)
        
        # Cập nhật vị trí
        self.pallet = pallet
        self.trang_thai = 'Có_hàng'
        self.save()
        
        
        # Log thay đổi
        from apps.orders.models import LichSuXuatNhap
        LichSuXuatNhap.objects.create(
            pallets=pallet,
            loai_giao_dich='Nhập',
            so_luong=pallet.so_thung_ban_dau,
            nguoi_thuc_hien=user.username if user else 'System',
            ghi_chu=f'Gán vào pallet {self.pallet.ma_pallet} vị trí {self.ma_vi_tri}'
        )
    
    def remove_pallet(self, user=None, reason=""):
        """Xóa pallet khỏi vị trí"""
        if not self.pallet:
            raise ValidationError("Vị trí không có pallet")
        
        pallet = self.pallet
        
        # Log thay đổi
        from apps.orders.models import LichSuXuatNhap
        LichSuXuatNhap.objects.create(
            pallets=pallet,
            loai_giao_dich='Xuất',
            so_luong=pallet.so_thung_con_lai,
            nguoi_thuc_hien=user.username if user else 'System',
            ghi_chu=f'Xóa pallet {self.pallet.ma_pallet} khỏi vị trí {self.ma_vi_tri}. {reason}'
        )
        
        self.pallet = None
        self.trang_thai = 'Trống'
        self.save()
    
    def set_maintenance(self, reason="", user=None):
        """Đặt vị trí vào trạng thái bảo trì"""
        if self.pallet:
            raise ValidationError("Không thể bảo trì vị trí có hàng")
        
        self.trang_thai = 'Bảo_trì'
        self.ghi_chu = f"Bảo trì: {reason}"
        self.save()
        
        # Tạo task bảo trì
        from apps.inventory.models.bao_tri import BaoTri
        BaoTri.objects.create(
            ma_bao_tri=f"BT-{self.ma_vi_tri}-{timezone.now().strftime('%Y%m%d')}",
            tieu_de=f"Bảo trì vị trí {self.ma_vi_tri}",
            loai_bao_tri='Bảo_dưỡng',
            doi_tuong='Vị_trí',
            doi_tuong_id=str(self.id),
            mo_ta=reason,
            nguoi_tao=user.username if user else 'System',
            trang_thai='Kế_hoạch'
        )
    
    def complete_maintenance(self, user=None):
        """Hoàn thành bảo trì"""
        self.trang_thai = 'Trống'
        self.ghi_chu = ""
        self.save()
        
        # Cập nhật task bảo trì
        from apps.inventory.models.bao_tri import BaoTri
        BaoTri.objects.filter(
            doi_tuong='Vị_trí',
            doi_tuong_id=str(self.id),
            trang_thai__in=['Kế_hoạch', 'Đang_thực_hiện']
        ).update(
            trang_thai='Hoàn_thành',
            thoi_gian_ket_thuc=timezone.now()
        )
    
    def get_neighbors(self, radius=1):
        """Lấy các vị trí lân cận"""
        hang_index = ord(self.hang) - ord('A')
        neighbors = []
        
        for dh in range(-radius, radius + 1):
            for dc in range(-radius, radius + 1):
                if dh == 0 and dc == 0:
                    continue
                
                new_hang_index = hang_index + dh
                new_cot = self.cot + dc
                
                if (0 <= new_hang_index < self.khu_vuc.kich_thuoc_hang and
                    1 <= new_cot <= self.khu_vuc.kich_thuoc_cot):
                    
                    new_hang = chr(ord('A') + new_hang_index)
                    try:
                        neighbor = ViTriKho.objects.get(
                            khu_vuc=self.khu_vuc,
                            hang=new_hang,
                            cot=new_cot
                        )
                        neighbors.append(neighbor)
                    except ViTriKho.DoesNotExist:
                        pass
        
        return neighbors
    
    def get_distance_to_exit(self):
        """Tính khoảng cách đến cửa ra gần nhất"""
        # Giả sử cửa ra ở góc (0,0)
        hang_index = ord(self.hang) - ord('A')
        return abs(hang_index) + abs(self.cot - 1)
    
    def get_pickup_priority(self):
        """Tính độ ưu tiên khi lấy hàng (càng nhỏ càng ưu tiên)"""
        priority = 0
        
        # Ưu tiên vị trí gần cửa ra
        if self.gan_cua_ra:
            priority -= 10
        
        # Ưu tiên FIFO
        if self.uu_tien_fifo and self.pallet:
            # Hàng cũ hơn có priority thấp hơn
            days_old = (timezone.now().date() - self.pallet.ngay_san_xuat).days
            priority -= days_old * 0.1

        if self.pallet:
            is_priority = self.pallet.tinh_trang_hang_set.filter(trang_thai="Ưu_tiên").exists()
        
        # Khoảng cách đến cửa ra
        priority += self.get_distance_to_exit()
        
        return priority
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'ma_vi_tri': self.ma_vi_tri,
            'khu_vuc': self.khu_vuc.ma_khu_vuc,
            'hang': self.hang,
            'cot': self.cot,
            'loai_vi_tri': self.loai_vi_tri,
            'trang_thai': self.trang_thai,
            'tai_trong_max': float(self.tai_trong_max),
            'chieu_cao_max': float(self.chieu_cao_max),
            'pallet': self.pallet.ma_pallet if self.pallet else None,
            'uu_tien_fifo': self.uu_tien_fifo,
            'gan_cua_ra': self.gan_cua_ra,
            'vi_tri_cach_ly': self.vi_tri_cach_ly,
            'is_available': self.is_available(),
            'pickup_priority': self.get_pickup_priority(),
            'ghi_chu': self.ghi_chu
        }
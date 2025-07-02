# backend/apps/warehouse/models/khu_vuc.py

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class KhuVuc(models.Model):
    """
    Model quản lý khu vực kho
    """
    TRANG_THAI_CHOICES = [
        ('Hoạt_động', 'Hoạt động'),
        ('Bảo_trì', 'Bảo trì'),
        ('Ngừng', 'Ngừng hoạt động')
    ]
    
    # Thông tin cơ bản
    ma_khu_vuc = models.CharField(
        max_length=10,
        unique=True,
        help_text="Mã khu vực (A, B, C, D...)"
    )
    
    ten_khu_vuc = models.CharField(
        max_length=100,
        help_text="Tên khu vực"
    )
    
    mo_ta = models.TextField(
        blank=True,
        help_text="Mô tả chi tiết khu vực"
    )
    
    # Kích thước
    kich_thuoc_hang = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(50)],
        help_text="Số hàng trong khu vực"
    )
    
    kich_thuoc_cot = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(50)],
        help_text="Số cột trong khu vực"
    )
    
    # Thông số kỹ thuật
    tai_trong_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Tải trọng tối đa (kg)"
    )
    
    nhiet_do_min = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=0,
        help_text="Nhiệt độ tối thiểu (°C)"
    )
    
    nhiet_do_max = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=40,
        help_text="Nhiệt độ tối đa (°C)"
    )
    
    do_am_min = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Độ ẩm tối thiểu (%)"
    )
    
    do_am_max = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Độ ẩm tối đa (%)"
    )
    
    # Trạng thái
    trang_thai = models.CharField(
        max_length=20,
        choices=TRANG_THAI_CHOICES,
        default='Hoạt_động',
        help_text="Trạng thái khu vực"
    )
    
    # Thời gian
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'khu_vuc'
        verbose_name = 'Khu vực'
        verbose_name_plural = 'Khu vực'
        ordering = ['ma_khu_vuc']
        indexes = [
            models.Index(fields=['ma_khu_vuc']),
            models.Index(fields=['trang_thai']),
        ]
    
    def __str__(self):
        return f"{self.ma_khu_vuc} - {self.ten_khu_vuc}"
    
    def clean(self):
        """Validate model"""  
        errors = {}      
        if self.nhiet_do_min >= self.nhiet_do_max:
            errors['nhiet_do_min'] = "Nhiệt độ tối thiểu phải nhỏ hơn nhiệt độ tối đa."        
        if self.do_am_min >= self.do_am_max:
            errors['do_am_min'] = "Độ ẩm tối thiểu phải nhỏ hơn độ ẩm tối đa."    

        if errors:
            raise ValidationError(errors)

    @property
    def tong_vi_tri(self):
        """Tổng số vị trí trong khu vực"""
        return self.kich_thuoc_hang * self.kich_thuoc_cot
    
    @property
    def vi_tri_trong(self):
        """Số vị trí trống"""
        return self.vi_tri_set.filter(trang_thai='Trống').count()
    
    @property
    def vi_tri_co_hang(self):
        """Số vị trí có hàng"""
        return self.vi_tri_set.filter(trang_thai='Có_hàng').count()
    
    @property
    def ty_le_su_dung(self):
        """Tỷ lệ sử dụng khu vực (%)"""
        if self.tong_vi_tri == 0:
            return 0
        return round((self.vi_tri_co_hang / self.tong_vi_tri) * 100, 2)
    
    def can_store_product(self, san_pham):
        """Kiểm tra có thể lưu trữ sản phẩm không"""
        if not san_pham.nhom_hang:
            return True, "OK"
        
        nhom_hang = san_pham.nhom_hang
        
        # Kiểm tra nhiệt độ
        if (nhom_hang.yeu_cau_nhiet_do_min is not None and 
            nhom_hang.yeu_cau_nhiet_do_min < self.nhiet_do_min):
            return False, f"Nhiệt độ khu vực quá cao (min: {nhom_hang.yeu_cau_nhiet_do_min}°C)"
        
        if (nhom_hang.yeu_cau_nhiet_do_max is not None and 
            nhom_hang.yeu_cau_nhiet_do_max > self.nhiet_do_max):
            return False, f"Nhiệt độ khu vực quá thấp (max: {nhom_hang.yeu_cau_nhiet_do_max}°C)"
        
        # Kiểm tra độ ẩm
        if (nhom_hang.yeu_cau_do_am_min is not None and 
            nhom_hang.yeu_cau_do_am_min < self.do_am_min):
            return False, f"Độ ẩm khu vực quá cao (min: {nhom_hang.yeu_cau_do_am_min}%)"
        
        if (nhom_hang.yeu_cau_do_am_max is not None and 
            nhom_hang.yeu_cau_do_am_max > self.do_am_max):
            return False, f"Độ ẩm khu vực quá thấp (max: {nhom_hang.yeu_cau_do_am_max}%)"
        
        return True, "OK"
    
    def get_available_positions(self):
        """Lấy danh sách vị trí trống"""
        return self.vi_tri_set.filter(trang_thai='Trống').order_by('hang', 'cot')
    
    def get_grid_layout(self):
        """Lấy layout grid của khu vực"""
        grid = []
        for hang in range(self.kich_thuoc_hang):
            row = []
            for cot in range(self.kich_thuoc_cot):
                hang_char = chr(65 + hang)  # A, B, C...
                cot_num = cot + 1
                
                try:
                    vi_tri = self.vi_tri_set.get(hang=hang_char, cot=cot_num)
                    row.append({
                        'id': vi_tri.id,
                        'ma_vi_tri': vi_tri.ma_vi_tri,
                        'trang_thai': vi_tri.trang_thai,
                        'pallet': vi_tri.pallet.ma_pallet if vi_tri.pallet else None,
                        'hang': hang_char,
                        'cot': cot_num
                    })
                except:
                    # Vị trí chưa được tạo
                    row.append({
                        'id': None,
                        'ma_vi_tri': f"{self.ma_khu_vuc}{hang_char}{cot_num}",
                        'trang_thai': 'Chưa_tạo',
                        'pallet': None,
                        'hang': hang_char,
                        'cot': cot_num
                    })
            grid.append(row)
        
        return grid
    
    def create_all_positions(self):
        """Tạo tất cả vị trí trong khu vực"""
        from .vi_tri import ViTriKho
        
        created_count = 0
        for hang in range(self.kich_thuoc_hang):
            for cot in range(self.kich_thuoc_cot):
                hang_char = chr(65 + hang)  # A, B, C...
                cot_num = cot + 1
                ma_vi_tri = f"{self.ma_khu_vuc}{hang_char}{cot_num}"
                
                vi_tri, created = ViTriKho.objects.get_or_create(
                    khu_vuc=self,
                    hang=hang_char,
                    cot=cot_num,
                    defaults={
                        'ma_vi_tri': ma_vi_tri,
                        'tai_trong_max': self.tai_trong_max,
                    }
                )
                
                if created:
                    created_count += 1
        
        return created_count
    
    def get_statistics(self):
        """Lấy thống kê khu vực"""
        return {
            'tong_vi_tri': self.tong_vi_tri,
            'vi_tri_trong': self.vi_tri_trong,
            'vi_tri_co_hang': self.vi_tri_co_hang,
            'vi_tri_bao_tri': self.vi_tri_set.filter(trang_thai='Bảo_trì').count(),
            'vi_tri_hong': self.vi_tri_set.filter(trang_thai='Hỏng').count(),
            'ty_le_su_dung': self.ty_le_su_dung,
            'tong_pallet': self.vi_tri_set.filter(pallet__isnull=False).count(),
            'nhiet_do_range': f"{self.nhiet_do_min}°C - {self.nhiet_do_max}°C",
            'do_am_range': f"{self.do_am_min}% - {self.do_am_max}%"
        }
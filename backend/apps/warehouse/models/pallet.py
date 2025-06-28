# backend/apps/warehouse/models/pallet.py

from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime, timedelta
import qrcode
from io import BytesIO
from django.core.files import File

class Pallet(models.Model):
    """
    Model quản lý pallet hàng hóa
    """
    TRANG_THAI_CHOICES = [
        ('Mới', 'Mới nhập'),
        ('Đã_mở', 'Đã mở (xuất một phần)'),
        ('Trống', 'Đã xuất hết'),
        ('Hỏng', 'Hàng hỏng'),
        ('Cách_ly', 'Cách ly kiểm tra'),
        ('Chờ_xuất', 'Chờ xuất hàng')
    ]
    
    # Thông tin cơ bản
    ma_pallet = models.CharField(
        max_length=20,
        unique=True,
        help_text="Mã pallet tự động (P-YYYY-XXX)"
    )
    
    # Thông tin sản phẩm
    san_pham = models.ForeignKey(
        'warehouse.SanPham',
        on_delete=models.PROTECT,
        help_text="Sản phẩm trong pallet"
    )
    
    nha_cung_cap = models.ForeignKey(
        'warehouse.NhaCungCap',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Nhà cung cấp"
    )
    
    # Số lượng
    so_thung_ban_dau = models.IntegerField(
        validators=[MinValueValidator(1)],
        help_text="Số thùng ban đầu khi nhập"
    )
    
    so_thung_con_lai = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="Số thùng còn lại hiện tại"
    )
    
    # Vị trí
    vi_tri_kho = models.ForeignKey(
        'warehouse.ViTriKho',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pallet_set',
    )
    
    # Thông tin thời gian
    ngay_san_xuat = models.DateField(
        help_text="Ngày sản xuất hàng hóa"
    )
    
    han_su_dung = models.DateField(
        help_text="Hạn sử dụng"
    )
    
    ngay_nhap_kho = models.DateTimeField(
        auto_now_add=True,
        help_text="Ngày nhập kho"
    )
    
    ngay_kiem_tra_cl = models.DateField(
        help_text="Ngày kiểm tra chất lượng tiếp theo"
    )
    
    # Thông tin vật lý
    trong_luong_thung = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Trọng lượng mỗi thùng (kg)"
    )
    
    chieu_cao = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Chiều cao pallet (cm)"
    )
    
    chieu_dai = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=120,
        validators=[MinValueValidator(0)],
        help_text="Chiều dài pallet (cm)"
    )
    
    chieu_rong = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=80,
        validators=[MinValueValidator(0)],
        help_text="Chiều rộng pallet (cm)"
    )
    
    # Trạng thái
    trang_thai = models.CharField(
        max_length=20,
        choices=TRANG_THAI_CHOICES,
        default='Mới',
        help_text="Trạng thái pallet"
    )
    
    # Thông tin bổ sung
    lo_san_xuat = models.CharField(
        max_length=50,
        blank=True,
        help_text="Lô sản xuất"
    )
    
    so_phieu_nhap = models.CharField(
        max_length=50,
        blank=True,
        help_text="Số phiếu nhập kho"
    )
    
    nhiet_do_bao_quan = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Nhiệt độ bảo quản yêu cầu (°C)"
    )
    
    do_am_bao_quan = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Độ ẩm bảo quản yêu cầu (%)"
    )
    
    # QR Code
    qr_code = models.ImageField(
        upload_to='qr_codes/pallets/',
        blank=True,
        null=True,
        help_text="QR Code của pallet"
    )
    
    # Người tạo và ghi chú
    nguoi_tao = models.CharField(
        max_length=50,
        help_text="Người tạo pallet"
    )
    
    ghi_chu = models.TextField(
        blank=True,
        help_text="Ghi chú về pallet"
    )
    
    # Thời gian
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pallets'
        verbose_name = 'Pallet'
        verbose_name_plural = 'Pallets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ma_pallet']),
            models.Index(fields=['san_pham', 'trang_thai']),
            models.Index(fields=['han_su_dung']),
            models.Index(fields=['ngay_kiem_tra_cl']),
            models.Index(fields=['trang_thai']),
            models.Index(fields=['vi_tri_kho']),
        ]
    
    def __str__(self):
        return f"{self.ma_pallet} - {self.san_pham.ten_san_pham} ({self.so_thung_con_lai}/{self.so_thung_ban_dau})"
    
    def save(self, *args, **kwargs):
        """Override save để tự động tạo mã pallet và QR code"""
        if not self.ma_pallet:
            self.ma_pallet = self.generate_pallet_code()
        
        # Tự động tính ngày kiểm tra CL nếu chưa có
        if not self.ngay_kiem_tra_cl:
            cycle_days = self.san_pham.chu_ky_kiem_tra_cl or 30
            self.ngay_kiem_tra_cl = self.ngay_san_xuat + timedelta(days=cycle_days)
        
        super().save(*args, **kwargs)
        
        # Tạo QR code nếu chưa có
        if not self.qr_code:
            self.generate_qr_code()
    
    def clean(self):
        """Validate model"""
        super().clean()
        
        # Kiểm tra số thùng còn lại không vượt quá ban đầu
        if self.so_thung_con_lai > self.so_thung_ban_dau:
            raise ValidationError('Số thùng còn lại không được vượt quá số thùng ban đầu')
        
        # Kiểm tra ngày sản xuất không được trong tương lai
        if self.ngay_san_xuat > timezone.now().date():
            raise ValidationError('Ngày sản xuất không được ở tương lai')
        
        # Kiểm tra hạn sử dụng phải sau ngày sản xuất
        if self.han_su_dung <= self.ngay_san_xuat:
            raise ValidationError('Hạn sử dụng phải sau ngày sản xuất')
        
        # Tự động cập nhật trạng thái dựa trên số thùng
        if self.so_thung_con_lai == 0:
            self.trang_thai = 'Trống'
        elif self.so_thung_con_lai < self.so_thung_ban_dau and self.trang_thai == 'Mới':
            self.trang_thai = 'Đã_mở'
    
    @classmethod
    def generate_pallet_code(cls):
        """Tạo mã pallet tự động"""
        current_year = timezone.now().year
        prefix = f"P-{current_year}-"
        
        # Lấy số sequence tiếp theo
        last_pallet = cls.objects.filter(
            ma_pallet__startswith=prefix
        ).order_by('-ma_pallet').first()
        
        if last_pallet:
            try:
                last_number = int(last_pallet.ma_pallet.split('-')[-1])
                next_number = last_number + 1
            except (IndexError, ValueError):
                next_number = 1
        else:
            next_number = 1
        
        return f"{prefix}{next_number:03d}"
    
    def generate_qr_code(self):
        """Tạo QR code cho pallet"""
        qr_data = {
            'type': 'pallet',
            'ma_pallet': self.ma_pallet,
            'san_pham': self.san_pham.ten_san_pham,
            'so_thung': self.so_thung_con_lai,
            'han_su_dung': self.han_su_dung.isoformat(),
            'vi_tri': self.vi_tri_kho.ma_vi_tri if self.vi_tri_kho else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        import json
        qr_text = json.dumps(qr_data, ensure_ascii=False)
        
        # Tạo QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_text)
        qr.make(fit=True)
        
        # Tạo image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Lưu vào file
        buffer = BytesIO()
        qr_img.save(buffer, format='PNG')
        file_name = f"pallet_{self.ma_pallet}.png"
        
        self.qr_code.save(
            file_name,
            File(buffer),
            save=False
        )
        buffer.close()
    
    # Properties
    @property
    def tong_trong_luong(self):
        """Tổng trọng lượng pallet (kg)"""
        return self.so_thung_con_lai * self.trong_luong_thung
    
    @property
    def the_tich(self):
        """Thể tích pallet (cm³)"""
        return self.chieu_dai * self.chieu_rong * self.chieu_cao
    
    @property
    def so_thung_da_xuat(self):
        """Số thùng đã xuất"""
        return self.so_thung_ban_dau - self.so_thung_con_lai
    
    @property
    def ty_le_con_lai(self):
        """Tỷ lệ còn lại (%)"""
        if self.so_thung_ban_dau == 0:
            return 0
        return round((self.so_thung_con_lai / self.so_thung_ban_dau) * 100, 2)
    
    @property
    def ngay_con_lai_han_su_dung(self):
        """Số ngày còn lại đến hạn sử dụng"""
        delta = self.han_su_dung - timezone.now().date()
        return delta.days if delta.days > 0 else 0
    
    @property
    def ngay_con_lai_kiem_tra_cl(self):
        """Số ngày còn lại đến kiểm tra CL"""
        delta = self.ngay_kiem_tra_cl - timezone.now().date()
        return delta.days if delta.days > 0 else 0
    
    @property
    def is_sap_het_han(self):
        """Kiểm tra sắp hết hạn (< 7 ngày)"""
        return self.ngay_con_lai_han_su_dung <= 7 and self.ngay_con_lai_han_su_dung > 0
    
    @property
    def is_het_han(self):
        """Kiểm tra đã hết hạn"""
        return self.han_su_dung < timezone.now().date()
    
    @property
    def is_can_kiem_tra_cl(self):
        """Kiểm tra cần kiểm tra chất lượng"""
        return self.ngay_kiem_tra_cl <= timezone.now().date()
    
    @property
    def fifo_priority(self):
        """Tính độ ưu tiên FIFO (càng nhỏ càng ưu tiên)"""
        # Hàng sắp hết hạn có ưu tiên cao nhất
        if self.is_het_han:
            return -1000
        if self.is_sap_het_han:
            return -100 - (7 - self.ngay_con_lai_han_su_dung)
        
        # Hàng nhập trước xuất trước
        days_since_production = (timezone.now().date() - self.ngay_san_xuat).days
        return days_since_production
    
    # Methods
    def can_export(self, so_luong):
        """Kiểm tra có thể xuất số lượng này không"""
        if self.trang_thai in ['Trống', 'Hỏng']:
            return False, f"Pallet đang ở trạng thái {self.get_trang_thai_display()}"
        
        if so_luong > self.so_thung_con_lai:
            return False, f"Không đủ hàng (còn {self.so_thung_con_lai} thùng)"
        
        if self.is_het_han:
            return False, "Hàng đã hết hạn sử dụng"
        
        return True, "OK"
    
    def export_quantity(self, so_luong, don_xuat=None, nguoi_xuat=None):
        """Xuất số lượng từ pallet"""
        can_export, reason = self.can_export(so_luong)
        if not can_export:
            raise ValidationError(reason)
        
        # Cập nhật số lượng
        self.so_thung_con_lai -= so_luong
        
        # Cập nhật trạng thái
        if self.so_thung_con_lai == 0:
            self.trang_thai = 'Trống'
        elif self.trang_thai == 'Mới':
            self.trang_thai = 'Đã_mở'
        
        self.save()
        
        # Ghi log
        from orders.models import LichSuXuatNhap
        LichSuXuatNhap.objects.create(
            pallet=self,
            loai_giao_dich='Xuất',
            so_luong=so_luong,
            don_xuat=don_xuat,
            nguoi_thuc_hien=nguoi_xuat,
            ghi_chu=f'Xuất {so_luong} thùng - còn {self.so_thung_con_lai}/{self.so_thung_ban_dau}'
        )
        
        return True
    
    def move_to_position(self, vi_tri_moi, nguoi_thuc_hien=None):
        """Di chuyển pallet đến vị trí mới"""
        vi_tri_cu = self.vi_tri_kho
        
        # Kiểm tra vị trí mới có sẵn không
        if vi_tri_moi and not vi_tri_moi.is_available():
            raise ValidationError(f"Vị trí {vi_tri_moi.ma_vi_tri} không khả dụng")
        
        # Kiểm tra có thể lưu trữ không
        if vi_tri_moi:
            can_store, reason = vi_tri_moi.can_store_pallet(self)
            if not can_store:
                raise ValidationError(reason)
        
        # Cập nhật vị trí cũ
        if vi_tri_cu:
            vi_tri_cu.pallet = None
            vi_tri_cu.trang_thai = 'Trống'
            vi_tri_cu.save()
        
        # Cập nhật vị trí mới
        if vi_tri_moi:
            vi_tri_moi.pallet = self
            vi_tri_moi.trang_thai = 'Có_hàng'
            vi_tri_moi.save()
        
        # Cập nhật pallet
        self.vi_tri_kho = vi_tri_moi
        self.save()
        
        # Ghi log
        from orders.models import LichSuXuatNhap
        LichSuXuatNhap.objects.create(
            pallet=self,
            loai_giao_dich='Di_chuyển',
            so_luong=self.so_thung_con_lai,
            nguoi_thuc_hien=nguoi_thuc_hien,
            ghi_chu=f'Di chuyển từ {vi_tri_cu.ma_vi_tri if vi_tri_cu else "N/A"} đến {vi_tri_moi.ma_vi_tri if vi_tri_moi else "N/A"}'
        )
    
    def update_quality_check(self, ngay_kiem_tra_tiep_theo=None, ket_qua="", nguoi_kiem_tra=None):
        """Cập nhật kiểm tra chất lượng"""
        if ngay_kiem_tra_tiep_theo:
            self.ngay_kiem_tra_cl = ngay_kiem_tra_tiep_theo
        else:
            # Tự động tính ngày kiểm tra tiếp theo
            cycle_days = self.san_pham.chu_ky_kiem_tra_cl or 30
            self.ngay_kiem_tra_cl = timezone.now().date() + timedelta(days=cycle_days)
        
        self.save()
        
        # Tạo bản ghi kiểm tra chất lượng
        from apps.inventory.models.tinh_trang_hang import TinhTrangHang
        TinhTrangHang.objects.create(
            pallet=self,
            loai_tinh_trang='Cần_kiểm_tra_CL',
            muc_do='Vừa',
            mo_ta=ket_qua,
            ngay_phat_hien=timezone.now().date(),
            ngay_xu_ly=timezone.now().date(),
            nguoi_phat_hien=nguoi_kiem_tra,
            nguoi_xu_ly=nguoi_kiem_tra,
            trang_thai='Hoàn_thành'
        )
    
    def set_isolation(self, ly_do="", nguoi_thuc_hien=None):
        """Đặt pallet vào trạng thái cách ly"""
        self.trang_thai = 'Cách_ly'
        self.ghi_chu = f"Cách ly: {ly_do}"
        self.save()
        
        # Tạo bản ghi tình trạng hàng
        from apps.inventory.models.tinh_trang_hang import TinhTrangHang
        TinhTrangHang.objects.create(
            pallet=self,
            loai_tinh_trang='Có_vấn_đề',
            muc_do='Cao',
            mo_ta=ly_do,
            ngay_phat_hien=timezone.now().date(),
            nguoi_phat_hien=nguoi_thuc_hien,
            trang_thai='Đang_xử_lý'
        )
    
    def get_export_history(self):
        """Lấy lịch sử xuất hàng"""
        return self.lichsuxuatnhap_set.filter(
            loai_giao_dich='Xuất'
        ).order_by('-ngay_thuc_hien')
    
    def get_remaining_shelf_life_percentage(self):
        """Tính % thời gian còn lại của hạn sử dụng"""
        total_days = (self.han_su_dung - self.ngay_san_xuat).days
        remaining_days = self.ngay_con_lai_han_su_dung
        
        if total_days <= 0:
            return 0
        
        return round((remaining_days / total_days) * 100, 2)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'ma_pallet': self.ma_pallet,
            'san_pham': {
                'id': self.san_pham.id,
                'ten': self.san_pham.ten_san_pham,
                'ma': self.san_pham.ma_san_pham
            },
            'so_thung_ban_dau': self.so_thung_ban_dau,
            'so_thung_con_lai': self.so_thung_con_lai,
            'so_thung_da_xuat': self.so_thung_da_xuat,
            'ty_le_con_lai': self.ty_le_con_lai,
            'vi_tri_kho': self.vi_tri_kho.ma_vi_tri if self.vi_tri_kho else None,
            'ngay_san_xuat': self.ngay_san_xuat.isoformat(),
            'han_su_dung': self.han_su_dung.isoformat(),
            'ngay_kiem_tra_cl': self.ngay_kiem_tra_cl.isoformat(),
            'ngay_con_lai_han_su_dung': self.ngay_con_lai_han_su_dung,
            'ngay_con_lai_kiem_tra_cl': self.ngay_con_lai_kiem_tra_cl,
            'is_sap_het_han': self.is_sap_het_han,
            'is_het_han': self.is_het_han,
            'is_can_kiem_tra_cl': self.is_can_kiem_tra_cl,
            'trang_thai': self.trang_thai,
            'tong_trong_luong': float(self.tong_trong_luong),
            'qr_code_url': self.qr_code.url if self.qr_code else None,
            'fifo_priority': self.fifo_priority,
            'remaining_shelf_life_percentage': self.get_remaining_shelf_life_percentage(),
            'created_at': self.created_at.isoformat(),
            'nguoi_tao': self.nguoi_tao,
            'ghi_chu': self.ghi_chu
        }
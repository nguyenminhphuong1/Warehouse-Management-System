from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class NhomHang(models.Model):
    TRANG_THAI_CHOICES = [
        ('Hoạt_động', 'Hoạt động'),
        ('Ngừng', 'Ngừng')
    ]

    ma_nhom = models.CharField(
        unique=True,
        max_length=20,
        null=False
        )
    
    ten_nhom = models.CharField(
        max_length=100,
        null=False
        )
    
    mo_ta = models.TextField( 
        null=False,
        default=''
        )
    
    icon = models.CharField( 
        null=False,
        default=''
        )
    
    mau_sac = models.CharField(
        max_length=7, 
        null=False,
        default='#007bff'
        )
    
    yeu_cau_nhiet_do_min = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True, 
        blank=True
        )
    
    yeu_cau_nhiet_do_max = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True, 
        blank=True
        )
    
    yeu_cau_do_am_min = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True, 
        blank=True
        )
    
    yeu_cau_do_am_max = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True, 
        blank=True
        )
    
    tranh_anh_sang = models.BooleanField(
        null=False, 
        default=False
        )
    
    tranh_rung_dong = models.BooleanField(
        null=False, 
        default=False
        )
    
    hang_de_vo = models.BooleanField(
        null=False, 
        default=False
        )
    
    hang_nguy_hiem = models.BooleanField(
        null=False, 
        default=False
        )
    
    thu_tu_hien_thi = models.IntegerField( 
        null=False,
        default=0
        )
    
    trang_thai = models.CharField(
        max_length=20,
        null=False,
        choices= TRANG_THAI_CHOICES,
        default='Hoạt_động'
        )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'nhom_hang'
        verbose_name = 'Nhóm hàng'
        verbose_name_plural = 'Nhóm hàng'
        ordering = ['ma_nhom']
    
    def __str__(self):
        return f"{self.ma_nhom} - {self.ten_nhom}"
    
    def clean(self):
        """Validate model"""
        super().clean()
        
        if self.yeu_cau_do_am_min >= self.yeu_cau_nhiet_do_max:
            raise ValidationError('Nhiệt độ tối thiểu phải nhỏ hơn nhiệt độ tối đa')
        
        if self.yeu_cau_do_am_min >= self.yeu_cau_do_am_max:
            raise ValidationError('Độ ẩm tối thiểu phải nhỏ hơn độ ẩm tối đa')
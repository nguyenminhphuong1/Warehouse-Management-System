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
    )
    
    ten_nhom = models.CharField(
        max_length=100,
    )
    
    mo_ta = models.TextField( 
        blank=True,
        default=''
    )
    
    icon = models.CharField( 
        blank=True,
        default=''
    )
    
    mau_sac = models.CharField(
        blank=True,
        max_length=7, 
        default='#007bff'
    )
    
    yeu_cau_nhiet_do_min = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        blank=True,
        default=0
    )
    
    yeu_cau_nhiet_do_max = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        blank=True,
        default=30
    )
    
    yeu_cau_do_am_min = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        blank=True,
        default=0
    )
    
    yeu_cau_do_am_max = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        blank=True,
        default=100
    )
    
    tranh_anh_sang = models.BooleanField(
        default=False
    )
    
    tranh_rung_dong = models.BooleanField(
        default=False
    )
    
    hang_de_vo = models.BooleanField(
        default=False
        )
    
    hang_nguy_hiem = models.BooleanField(
        default=False
    )
    
    thu_tu_hien_thi = models.IntegerField( 
        blank=True,
        default=0
    )
    
    trang_thai = models.CharField(
        max_length=20,
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
        errors = {}    
        if self.yeu_cau_nhiet_do_min >= self.yeu_cau_nhiet_do_max:
            errors['nhiet_do_min'] = "Nhiệt độ tối thiểu phải nhỏ hơn nhiệt độ tối đa."        
        if self.yeu_cau_do_am_min >= self.yeu_cau_do_am_max:
            errors['do_am_min'] = "Độ ẩm tối thiểu phải nhỏ hơn độ ẩm tối đa."    

        if errors:
            raise ValidationError(errors)
    

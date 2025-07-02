from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import ExpressionWrapper
import re

class ChiTietDon(models.Model):
    don_xuat = models.ForeignKey(
        'orders.DonXuat', 
        models.PROTECT
    )
    
    san_pham = models.ForeignKey(
        'warehouse.SanPham', 
        models.PROTECT
    )
    
    so_luong_can = models.IntegerField(
        validators=[MinValueValidator(1)],
        blank=True,
    )

    so_luong_da_xuat = models.IntegerField(
        default=0,
        blank=True,
        validators=[MinValueValidator(1)],
    )

    pallet_assignments = models.JSONField(
        default=[],
        blank=True,
        null=False
    )
    
    da_xuat_xong = models.BooleanField(
        null=True, 
        blank=True,
        default=False
    )
    
    ghi_chu = models.TextField(
        blank=True,
        default=''
    )

    class Meta:
        db_table = 'chi_tiet_don'
        verbose_name = 'Chi tiết đơn'
        verbose_name_plural = 'Chi tiết đơn'

    def __str__(self):
        return f"{self.don_xuat.ma_don} - {self.san_pham.ten_san_pham}"
    
    def update_order_quantity(self, so_luong_moi, so_luong_cu):
        if so_luong_moi < so_luong_cu:
            #Lấy ra id các pallet vừa được lấy ra (Lấy cái sau cùng để phù hợp trả lại)
            reversed_ids = [p["id"] for p in self.pallet_assignments[::-1]]

            from apps.warehouse.models import Pallet
            pallets = Pallet.objects.filter(
                id__in=reversed_ids,
            )

            #Loại bỏ đi pallet trong danh sách pallet
            result = self.import_goods(pallets, so_luong_cu - so_luong_moi, self.don_xuat)
            pallet_map = {p['id']: p for p in self.pallet_assignments}
            result_map = {p['id']: p for p in result}
            
            for pallet_id in pallet_map:
                if pallet_id in result_map:
                    pallet_map[pallet_id]['so_thung'] -= result_map[pallet_id]['so_thung']
                    
            self.pallet_assignments = [
                p for p in pallet_map.values() if p['so_thung'] > 0
            ]

        else:
            new_quantity = so_luong_moi-so_luong_cu
            self.get_suitable_pallet(new_quantity)

    #Hàm thêm số lượng vào pallet nếu số lượng bị thay đổi ít đi
    def import_goods(self, pallets, quantity, don_xuat, result=None):
        if result == None:
            result = []

        pallet = pallets[0]
        if quantity + pallet.so_thung_con_lai <= pallet.so_thung_ban_dau:
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": quantity
            })
            pallet.import_quantity(quantity, don_xuat, don_xuat.nguoi_tao)
            return result
        else:
            much = pallet.so_thung_ban_dau - pallet.so_thung_con_lai
            remaining = quantity - much
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": much
            })
            pallet.import_quantity(much, don_xuat, don_xuat.nguoi_tao)
            return self.import_goods(pallets[1:], remaining, don_xuat, result)

    #Hàm lấy ra pallet phù hợp để lấy
    def get_suitable_pallet(self, so_luong):
        from apps.warehouse.models import Pallet
        pallets = Pallet.objects.filter(
            san_pham=self.san_pham,    
        ).exclude(
            trang_thai__in=['Hỏng', 'Trống']
        ).select_related('vi_tri_kho')

        priority_pallets = sorted(
            [p for p in pallets if p.vi_tri_kho],
            key=lambda p: p.vi_tri_kho.get_pickup_priority(),
            reverse=False
        )
        result = self.get_goods(priority_pallets, so_luong, self.don_xuat)

        #Gán pallet cho pallet asignment
        #Cập nhật số thùng pallets nếu lấy thêm
        pallet_map = {p['id']: p for p in self.pallet_assignments}
        result_map = {p['id']: p for p in result}
        
        for pallet_id in pallet_map:
            if pallet_id in result_map:
                result_map[pallet_id]['so_thung'] += pallet_map[pallet_id]['so_thung']
    
        self.pallet_assignments = [
            p for p in self.pallet_assignments if p['id'] not in result_map
        ]

        self.pallet_assignments.extend(result)

    #Hàm trừ đi số lượng ở các pallet
    def get_goods(self, pallets, quantity, don_xuat, result=None):
        if result == None:
            result = []

        if not pallets:
            raise ValueError("Không đủ pallet để xuất.")
        
        pallet = pallets[0]
        
        if quantity <= pallet.so_thung_con_lai:
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": quantity
            })
            pallet.export_quantity(quantity, don_xuat, don_xuat.nguoi_tao)
            return result
        else:
            remaining = quantity - pallet.so_thung_con_lai
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": pallet.so_thung_con_lai
            })
            pallet.export_quantity(pallet.so_thung_con_lai, don_xuat, don_xuat.nguoi_tao)
            return self.get_goods(pallets[1:], remaining, don_xuat, result)



    
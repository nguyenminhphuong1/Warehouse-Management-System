from rest_framework import serializers
from ..models import LichSuXuatNhap

class LichSuXuatNhapSerializer(serializers.ModelSerializer):
    class Meta:
        model = LichSuXuatNhap
        fields = '__all__'
        read_only_fields = ['ngay_thuc_hien']
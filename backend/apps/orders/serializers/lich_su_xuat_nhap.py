from rest_framework import serializers
from ..models import LichSuXuatNhap
from apps.core.utils.validators import ModelCleanMixin

class LichSuXuatNhapSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = LichSuXuatNhap
        fields = '__all__'
        read_only_fields = ['ngay_thuc_hien']
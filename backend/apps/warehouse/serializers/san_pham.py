from rest_framework import serializers
from ..models import SanPham
from apps.core.utils.validators import ModelCleanMixin

class SanPhamSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = SanPham
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
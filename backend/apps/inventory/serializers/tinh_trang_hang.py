from rest_framework import serializers
from ..models import TinhTrangHang
from apps.core.utils.validators import ModelCleanMixin

class TinhTrangHangSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = TinhTrangHang
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
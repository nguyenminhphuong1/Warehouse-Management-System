from rest_framework import serializers
from ..models import ThuTuXuatHang
from apps.core.utils.validators import ModelCleanMixin

class ThuTuXuatHangSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = ThuTuXuatHang
        fields = '__all__'
        read_only_fields = ['created_at']
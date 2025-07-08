from rest_framework import serializers
from ..models import CuaHang
from apps.core.utils.validators import ModelCleanMixin

class CuaHangSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = CuaHang
        fields = '__all__'
        read_only_fields = ['created_at']
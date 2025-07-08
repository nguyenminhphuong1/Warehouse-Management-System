from rest_framework import serializers
from ..models import NhomHang
from apps.core.utils.validators import ModelCleanMixin

class NhomHangSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = NhomHang
        fields = '__all__'
        read_only_fields = ['created_at']
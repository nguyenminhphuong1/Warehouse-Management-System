from rest_framework import serializers
from ..models import NhaCungCap
from apps.core.utils.validators import ModelCleanMixin

class NhaCungCapSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = NhaCungCap
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
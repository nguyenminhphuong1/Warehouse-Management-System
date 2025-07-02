from rest_framework import serializers
from ..models import ChiTietKiemKe
from apps.core.utils.validators import ModelCleanMixin

class ChiTietKiemKeSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = ChiTietKiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
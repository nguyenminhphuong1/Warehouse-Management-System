from rest_framework import serializers
from ..models import KiemKe
from apps.core.utils.validators import ModelCleanMixin

class KiemKeSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = KiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
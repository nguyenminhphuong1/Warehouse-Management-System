from rest_framework import serializers
from ..models import ViTriKho
from apps.core.utils.validators import ModelCleanMixin

class ViTriKhoSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = ViTriKho
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
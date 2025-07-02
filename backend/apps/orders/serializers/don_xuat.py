from rest_framework import serializers
from ..models import DonXuat
from apps.core.utils.validators import ModelCleanMixin

class DonXuatSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = DonXuat
        fields = '__all__'
        read_only_fields = ['created_at']
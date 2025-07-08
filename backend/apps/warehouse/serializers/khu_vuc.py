from rest_framework import serializers
from ..models import KhuVuc
from apps.core.utils.validators import ModelCleanMixin

class KhuVucSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = KhuVuc
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
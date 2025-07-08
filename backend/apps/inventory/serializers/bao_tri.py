from rest_framework import serializers
from ..models import BaoTri
from apps.core.utils.validators import ModelCleanMixin

class BaoTriSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = BaoTri
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
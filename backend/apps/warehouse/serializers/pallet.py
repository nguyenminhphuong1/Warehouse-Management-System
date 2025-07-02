from rest_framework import serializers
from ..models import Pallet
from apps.core.utils.validators import ModelCleanMixin

class PalletSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = Pallet
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
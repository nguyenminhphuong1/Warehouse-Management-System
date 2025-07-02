from rest_framework import serializers
from ..models import ChiTietDon
from apps.core.utils.validators import ModelCleanMixin
from django.db import transaction

class ChiTietDonSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = ChiTietDon
        fields = '__all__'

    def create(self, validated_data):
        with transaction.atomic():
            instance = super().create(validated_data)
            try:
                instance.get_suitable_pallet(instance.so_luong_can)
                instance.save()
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})
        
        return instance
    
    def update(self, instance , validated_data):
        with transaction.atomic():
            so_luong_cu = instance.so_luong_can
            so_luong_moi = validated_data.get('so_luong_can', so_luong_cu)

            instance = super().update(instance, validated_data)
            try:
                if so_luong_moi != so_luong_cu:
                    instance.update_order_quantity(so_luong_moi, so_luong_cu)
                    instance.save()
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})     
        
        return instance


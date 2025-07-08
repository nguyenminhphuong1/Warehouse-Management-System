from rest_framework import serializers
from ..models import Pallet
from apps.core.utils.validators import ModelCleanMixin
from django.db import transaction

class PalletSerializer(ModelCleanMixin, serializers.ModelSerializer):
    class Meta:
        model = Pallet
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        with transaction.atomic():
            instance = super().create(validated_data)
            user = self.context['request'].user
            try:
                instance.vi_tri_kho.assign_pallet(instance, user)
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})
        
        return instance
    
    def update(self, instance , validated_data):
        with transaction.atomic():
            vi_tri_cu = instance.vi_tri_kho
            vi_tri_moi = validated_data.get('vi_tri_kho', vi_tri_cu)
            ly_do = validated_data.get('ghi_chu', '')
            user = self.context['request'].user

            instance = super().update(instance, validated_data)
            try:
                if vi_tri_moi != vi_tri_cu:
                    vi_tri_cu.remove_pallet(user, ly_do)
                    vi_tri_moi.assign_pallet(instance, user) 
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})     
        
        return instance
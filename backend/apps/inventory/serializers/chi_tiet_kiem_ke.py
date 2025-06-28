from rest_framework import serializers
from ..models import ChiTietKiemKe

class ChiTietKiemKeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiTietKiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
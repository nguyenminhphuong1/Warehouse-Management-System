from rest_framework import serializers
from ..models import KiemKe

class KiemKeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
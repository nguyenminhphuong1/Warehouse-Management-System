from rest_framework import serializers
from ..models import TinhTrangHang

class TinhTrangHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = TinhTrangHang
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
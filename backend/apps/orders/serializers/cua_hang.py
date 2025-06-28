from rest_framework import serializers
from ..models import CuaHang

class CuaHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuaHang
        fields = '__all__'
        read_only_fields = ['created_at']
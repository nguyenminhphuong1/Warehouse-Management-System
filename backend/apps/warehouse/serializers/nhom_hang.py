from rest_framework import serializers
from ..models import NhomHang

class NhomHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = NhomHang
        fields = '__all__'
        read_only_fields = ['created_at']
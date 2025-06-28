from rest_framework import serializers
from ..models import ThuTuXuatHang

class ThuTuXuatHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThuTuXuatHang
        fields = '__all__'
        read_only_fields = ['created_at']
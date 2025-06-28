from rest_framework import serializers
from ..models import ViTriKho

class ViTriKhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViTriKho
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
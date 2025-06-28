from rest_framework import serializers
from ..models import BaoTri

class BaoTriSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaoTri
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
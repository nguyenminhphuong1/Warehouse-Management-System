from rest_framework import serializers
from ..models import KhuVuc

class KhuVucSerializer(serializers.ModelSerializer):
    class Meta:
        model = KhuVuc
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
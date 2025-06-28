from rest_framework import serializers
from ..models import ChiTietDon

class ChiTietDonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiTietDon
        fields = '__all__'

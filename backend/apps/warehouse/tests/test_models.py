import pytest
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from ..serializers import PalletSerializer
from ..models import ViTriKho, Pallet

User = get_user_model()

@pytest.mark.django_db
def test_create_pallet():
    data = {
        "ma_pallet": "P001",
        "san_pham": "SP1",
        "so_thung_con_lai": 10
    }

    serializer = PalletSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    pallet = serializer.save()

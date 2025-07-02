from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

class ModelCleanMixin:
    def validate(self, attrs):
        instance = self.instance or self.Meta.model(**attrs)
        try:
            instance.full_clean()
        except DjangoValidationError as e:
            raise DRFValidationError(e.message_dict)
        return attrs

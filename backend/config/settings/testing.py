from .base import *
from dotenv import load_dotenv
load_dotenv()


DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'warehouse_db'),
        'USER': os.environ.get('DB_USER', 'warehouse_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'password'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'options': '-c default_transaction_isolation=serializable'
        }
    }
}
# Optional: Disable some heavy settings during test
CACHES['default']['BACKEND'] = 'django.core.cache.backends.locmem.LocMemCache'
CELERY_TASK_ALWAYS_EAGER = True  # Không cần Redis khi test
CHANNEL_LAYERS = {
    'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}
}
# backend/config/settings/base.py

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ALLOWED_HOSTS=['127.0.0.1', 'localhost']

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-warehouse-management-system-dev-key')
DEBUG = os.environ.get('DEBUG')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'drf_yasg',
    'drf_spectacular',
    'celery',
    'channels',
    'django_extensions',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.warehouse',
    'apps.orders',
    'apps.inventory',
    'apps.reports',
    'apps.notifications',
    'apps.core',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'apps.core.middleware.auth.JWTAuthenticationMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

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

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'vi'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    #'EXCEPTION_HANDLER': 'apps.core.utils.exception_handler.custom_exception_handler',
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=8),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': 'warehouse-management-system',
    'JSON_ENCODER': None,
    'JWK_URL': None,
    'LEEWAY': 0,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    
    'JTI_CLAIM': 'jti',
    
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(hours=8),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    
    "TOKEN_OBTAIN_SERIALIZER": "apps.accounts.serializers.auth.LoginSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-api-key',
]

# Security Settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Session Settings
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_AGE = 86400  # 24 hours

# CSRF Settings
CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# Cache Configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        },
        'KEY_PREFIX': 'warehouse_cache',
        'TIMEOUT': 300,
    }
}

# Celery Configuration
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://127.0.0.1:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://127.0.0.1:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_ENABLE_UTC = True

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'check-expiry-warnings': {
        'task': 'apps.inventory.tasks.check_expiry_warnings',
        'schedule': timedelta(hours=6),  # Check every 6 hours
    },
    'quality-check-reminders': {
        'task': 'apps.inventory.tasks.send_quality_check_reminders',
        'schedule': timedelta(hours=12),  # Check every 12 hours
    },
    'cleanup-old-logs': {
        'task': 'apps.core.tasks.cleanup_old_logs',
        'schedule': timedelta(days=1),  # Daily cleanup
    },
    'generate-daily-reports': {
        'task': 'apps.reports.tasks.generate_daily_reports',
        'schedule': timedelta(hours=24),  # Daily at midnight
    },
}

# Channels Configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/2')],
        },
    },
}

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'localhost')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@warehouse.com')

# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
FILE_UPLOAD_PERMISSIONS = 0o644

#  Logging Configuration
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': False,
#     'formatters': {
#         'verbose': {
#             'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
#             'style': '{',
#         },
#         'simple': {
#             'format': '{levelname} {message}',
#             'style': '{',
#         },
#     },
#     'filters': {
#         'require_debug_true': {
#             '()': 'django.utils.log.RequireDebugTrue',
#         },
#     },
#     'handlers': {
#         'console': {
#             'level': 'INFO',
#             'filters': ['require_debug_true'],
#             'class': 'logging.StreamHandler',
#             'formatter': 'simple'
#         },
#         'file': {
#             'level': 'INFO',
#             'class': 'logging.FileHandler',
#             'filename': BASE_DIR / 'logs/django.log',
#             'formatter': 'verbose',
#         },
#         'error_file': {
#             'level': 'ERROR',
#             'class': 'logging.FileHandler',
#             'filename': BASE_DIR / 'logs/django_error.log',
#             'formatter': 'verbose',
#         },
#     },
#     'root': {
#         'handlers': ['console'],
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console', 'file'],
#             'level': 'INFO',
#         },
#         'django.request': {
#             'handlers': ['error_file'],
#             'level': 'ERROR',
#             'propagate': True,
#         },
#         'apps': {
#             'handlers': ['console', 'file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#         'celery': {
#             'handlers': ['console', 'file'],
#             'level': 'INFO',
#             'propagate': True,
#         },
#     },
# }

# API Documentation Settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'Warehouse Management System API',
    'DESCRIPTION': 'API documentation for Warehouse Management System',
    'VERSION': '2.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': '/api/',
}

# Custom Settings for Warehouse Management
WAREHOUSE_SETTINGS = {
    'DEFAULT_EXPIRY_WARNING_DAYS': 7,
    'DEFAULT_QUALITY_CHECK_CYCLE_DAYS': 30,
    'MAX_WAREHOUSE_CAPACITY_PERCENTAGE': 85,
    'DEFAULT_WORKING_HOURS': {
        'start': '07:00',
        'end': '18:00',
    },
    'QR_CODE_SETTINGS': {
        'version': 1,
        'error_correction': 'M',
        'box_size': 10,
        'border': 4,
    },
    'PALLET_CODE_FORMAT': 'P-{year}-{sequence:03d}',
    'ORDER_CODE_FORMAT': 'XK-{year}{month:02d}-{sequence:03d}',
    'AUDIT_LOG_RETENTION_DAYS': 365,
    'SESSION_TIMEOUT_MINUTES': 480,  # 8 hours
    'MAX_LOGIN_ATTEMPTS': 5,
    'ACCOUNT_LOCKOUT_DURATION_MINUTES': 30,
}

# Notification Settings
NOTIFICATION_SETTINGS = {
    'ENABLE_EMAIL_NOTIFICATIONS': True,
    'ENABLE_PUSH_NOTIFICATIONS': True,
    'ENABLE_SMS_NOTIFICATIONS': False,
    'NOTIFICATION_CHANNELS': [
        'email',
        'in_app',
        'websocket',
    ],
    'DEFAULT_NOTIFICATION_PREFERENCES': {
        'expiry_warnings': True,
        'quality_check_reminders': True,
        'inventory_alerts': True,
        'order_updates': True,
        'maintenance_reminders': True,
        'security_alerts': True,
    },
}

# Permission Settings
PERMISSION_SETTINGS = {
    'ENABLE_MODULE_PERMISSIONS': True,
    'ENABLE_ACTION_PERMISSIONS': True,
    'ENABLE_CONDITIONAL_PERMISSIONS': True,
    'DEFAULT_PERMISSION_EXPIRY_DAYS': 365,
    'REQUIRE_PERMISSION_REASON': True,
    'ENABLE_PERMISSION_INHERITANCE': False,
    'AUDIT_PERMISSION_CHANGES': True,
}

# Security Settings
SECURITY_SETTINGS = {
    'ENABLE_IP_WHITELIST': False,
    'ALLOWED_IPS': [],
    'ENABLE_RATE_LIMITING': True,
    'RATE_LIMIT_REQUESTS_PER_MINUTE': 60,
    'ENABLE_REQUEST_LOGGING': True,
    'LOG_SENSITIVE_DATA': False,
    'REQUIRE_HTTPS': False,  # Set to True in production
    'ENABLE_2FA': False,  # Future feature
}

# Performance Settings
PERFORMANCE_SETTINGS = {
    'ENABLE_QUERY_OPTIMIZATION': True,
    'ENABLE_CACHING': True,
    'CACHE_TIMEOUT_SECONDS': 300,
    'ENABLE_COMPRESSION': True,
    'MAX_BULK_OPERATIONS': 1000,
    'DATABASE_QUERY_TIMEOUT': 30,
}

# Integration Settings
INTEGRATION_SETTINGS = {
    'ENABLE_API_VERSIONING': True,
    'API_VERSION': 'v1',
    'ENABLE_WEBHOOKS': False,
    'WEBHOOK_TIMEOUT_SECONDS': 30,
    'ENABLE_EXTERNAL_AUTH': False,
    'EXTERNAL_AUTH_PROVIDERS': [],
}
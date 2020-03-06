import os
from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'api.checkma.it',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DJANGO_DATABASE_NAME'),
        'USER': os.environ.get('DJANGO_DATABASE_USER'),
        'PASSWORD': os.environ.get('DJANGO_DATABASE_PASSWORD'),
        'HOST': os.environ.get('DJANGO_DATABASE_HOST'),
        'PORT': os.environ.get('DJANGO_DATABASE_PORT'),
    }
}

CSRF_TRUSTED_ORIGINS = [
    'api.checkma.it',
]

STATIC_URL = 'https://s3.eu-west-3.amazonaws.com/api.checkma.it/'
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = [
    "https://app.checkma.it",
    "https://api.checkma.it",
]

EMAIL_BACKEND = 'django_ses.SESBackend'

import os
from .base import *


DEBUG = False

ALLOWED_HOSTS = [
    'api.checkma.it',
    'api.loff.io',
    'api.checkmate.best',
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
    'api.loff.io',
    'api.checkmate.best',
]

STATIC_URL = 'https://s3.eu-west-3.amazonaws.com/api.checkmate.best/'
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = [
    "https://app.checkma.it",
    "https://api.checkma.it",
    "https://app.loff.io",
    "https://api.loff.io",
    "https://app.checkmate.best",
    "https://api.checkmate.best",
]

EMAIL_BACKEND = 'django_ses.SESBackend'

"""
WSGI config for play_live project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "play_live.settings")

application = get_wsgi_application()
application = DjangoWhiteNoise(application)
application.add_files('/usr/local/lib/python3.6/dist-packages/django/contrib/admin/static')
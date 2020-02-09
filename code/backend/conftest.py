import pytest
from rest_framework.test import APIClient

from users import models as um


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return um.User.objects.create_user('test@email.com', 'Complexpassword123')
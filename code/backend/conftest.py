import pytest
from rest_framework.test import APIClient

from users import models as um


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return um.User.objects.create_user('test@email.com', 'Complexpassword123')


@pytest.fixture
def user2():
    return um.User.objects.create_user('test2@email.com', 'Complexpassword123')


@pytest.fixture
def api_user_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client
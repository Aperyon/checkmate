import pytest
from rest_framework import status
from rest_framework.reverse import reverse


pytestmark = pytest.mark.django_db


def test_login(api_client, user):
    rv = api_client.post(
        reverse('token_obtain_pair'),
        {
            'email': user.email,
            'password': 'Complexpassword123'
        },
        format='json'
    )
    assert rv.status_code == status.HTTP_200_OK
    assert 'access' in rv.data, rv.data
    assert 'refresh' in rv.data


def test_login_wrong_password(api_client, user):
    rv = api_client.post(
        reverse('token_obtain_pair'),
        {
            'email': user.email,
            'password': 'Comp2lexpassword123'
        }
    )
    assert rv.status_code == status.HTTP_401_UNAUTHORIZED
    assert rv.data['detail'] == 'Invalid credentials'
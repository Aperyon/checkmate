import pytest
from rest_framework.reverse import reverse
from rest_framework import status

from users import models as m

pytestmark = pytest.mark.django_db


def test_signup(api_client):
    rv = api_client.post(
        reverse('user-list'),
        {
            'email': 'test@email.com',
            'password': 'complexpass123'
        }
    )
    assert rv.status_code == status.HTTP_201_CREATED
    assert m.User.objects.count() == 1


def test_signup_email_taken(api_client, user):
    rv = api_client.post(
        reverse('user-list'),
        {
            'email': user.email,
            'password': 'complexpass123'
        }
    )
    assert rv.status_code == status.HTTP_400_BAD_REQUEST
    assert rv.data['email'][0] == 'user with this email already exists.'
    assert m.User.objects.count() == 1


def test_signup_wrong_email(api_client):
    rv = api_client.post(
        reverse('user-list'),
        {
            'email': 'test',
            'password': 'complexpass123'
        }
    )
    assert rv.status_code == status.HTTP_400_BAD_REQUEST
    assert rv.data['email'][0] == 'Enter a valid email address.'
    assert m.User.objects.count() == 0


def test_signup_wrong_password(api_client):
    rv = api_client.post(
        reverse('user-list'),
        {
            'email': 'test@email.com',
            'password': ''
        },
    )
    assert rv.status_code == status.HTTP_400_BAD_REQUEST
    assert rv.data['password'][0] == 'This field may not be blank.'
    assert m.User.objects.count() == 0
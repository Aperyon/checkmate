import pytest
from rest_framework.test import APIClient

from users import models as um
from checklists import models as cm


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


@pytest.fixture
def checklist(user):
    return cm.CheckList.objects.create(
        user=user,
        title='First Checklist',
        description='First description'
    )


@pytest.fixture
def checklist_run(checklist):
    return cm.CheckListRun.objects.create(
        checklist=checklist,
        user=checklist.user,
        title=checklist.title,
        description=checklist.description,
    )
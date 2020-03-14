import datetime as dt

import pytest
from django.utils import timezone
from django.utils.timezone import make_aware as maw
from rest_framework import status
from rest_framework.reverse import reverse

from checklists import models as m
from checklists import services as s


pytestmark = pytest.mark.django_db


def test_prepare_run(user, monkeypatch):
    monkeypatch.setattr(
        timezone,
        'now',
        lambda: maw(dt.datetime(2020, 1, 1, 12))
    )
    checklist = m.CheckList(
        title='Title',
        description='Description',
        is_latest_run_complete=True,
        user=user
    )
    items = [
        m.CheckListItem(checklist=checklist, text='item1', order=0),
        m.CheckListItem(checklist=checklist, text='item2', order=1),
        m.CheckListItem(checklist=checklist, text='item3', order=2),
    ]

    run, run_items = s.prepare_run(checklist, items, user)
    assert checklist.latest_run == run
    assert checklist.is_latest_run_complete is False
    assert run.checklist == checklist
    assert run.title == 'Title'
    assert run.description == 'Description'
    assert len(run_items) == 3

    assert run_items[0].text == 'item1'
    assert run_items[0].is_checked is False
    assert run_items[0].is_checked is False
    assert run_items[0].checklist_run == run
    assert run_items[1].text == 'item2'
    assert run_items[1].is_checked is False
    assert run_items[1].is_checked is False
    assert run_items[1].checklist_run == run
    assert run_items[2].text == 'item3'
    assert run_items[2].is_checked is False
    assert run_items[2].is_checked is False
    assert run_items[2].checklist_run == run


def test_toggle_checklist_run_item():
    checklist = m.CheckList(title='Test Title', description='Test')
    run = m.CheckListRun(checklist=checklist, title='Test Title', description='Test')
    item1 = m.CheckListRunItem(checklist_run=run, text='item 1')
    item2 = m.CheckListRunItem(checklist_run=run, text='item 2')

    s.toggle_checklist_run_item(item1, True, [item2])
    assert checklist.is_latest_run_complete is False
    assert run.is_closed is False

    s.toggle_checklist_run_item(item2, True, [item1])
    assert checklist.is_latest_run_complete is True
    assert run.is_closed is True

    s.toggle_checklist_run_item(item2, False, [item1])
    assert checklist.is_latest_run_complete is False
    assert run.is_closed is False


class TestChecklistRunFilters:
    def test_without_filter(self, api_user_client, user, user2):
        cl1 = m.CheckList.objects.create(user=user)
        cl2 = m.CheckList.objects.create(user=user)
        cl_other = m.CheckList.objects.create(user=user2)
        clr1 = m.CheckListRun.objects.create(checklist=cl1, user=user)
        clr2 = m.CheckListRun.objects.create(checklist=cl1, user=user)
        clr3 = m.CheckListRun.objects.create(checklist=cl2, user=user)
        clr4 = m.CheckListRun.objects.create(checklist=cl_other, user=user2)

        run_url = reverse('checklistrun-list')

        rv = api_user_client.get(run_url)
        assert rv.status_code == status.HTTP_200_OK
        assert len(rv.data) == 3

        rv = api_user_client.get(f'{run_url}?checklist={cl1.pk}')
        assert rv.status_code == status.HTTP_200_OK
        assert len(rv.data) == 2


class TestChecklistRunCreate:
    def test_create_without_items(self, api_user_client, user):
        cl = m.CheckList.objects.create(user=user, title='Title', description='Example')
        m.CheckListItem.objects.create(order=1, text='Item 1', checklist=cl)
        m.CheckListItem.objects.create(order=2, text='Item 2', checklist=cl)

        rv = api_user_client.post(
            reverse('checklistrun-list'),
            {
                'checklist': reverse('checklist-detail', kwargs={'pk': cl.pk})
            }
        )
        assert rv.status_code == status.HTTP_201_CREATED
        assert m.CheckListRun.objects.exists()

        run = m.CheckListRun.objects.first()
        assert run.user == user
        assert run.checklist == cl
        assert run.title == 'Title'
        assert run.description == 'Example'
        assert run.items.count() == 2
        assert run.items.first().text == 'Item 1'
        assert run.items.first().order == 1
        assert run.items.last().text == 'Item 2'
        assert run.items.last().order == 2


class TestChecklistRunUpdate:
    def test_remove_field(self, api_user_client, user):
        cl = m.CheckList.objects.create(user=user)
        run = m.CheckListRun.objects.create(user=user, checklist=cl)
        item1 = m.CheckListRunItem.objects.create(checklist_run=run, order=1, text='Yolo')
        item2 = m.CheckListRunItem.objects.create(checklist_run=run, order=2, text='Yolo')
        item3 = m.CheckListRunItem.objects.create(checklist_run=run, order=3, text='Yolo')
        item4 = m.CheckListRunItem.objects.create(checklist_run=run, order=4, text='Yolo')

        rv = api_user_client.patch(
            reverse('checklistrun-detail', kwargs={'pk': run.pk}),
            {
                'title': 'Hello',
                'items': [
                    {
                        'order': item1.order,
                        'text': item1.text,
                    },
                    {
                        'order': item2.order,
                        'text': item2.text,
                    },
                ]
            },
            format='json'
        )
        assert rv.status_code == status.HTTP_200_OK, rv.data
        assert run.items.count() == 2

        assert run.items.first().order == 1
        assert run.items.last().order == 2

    def test_remove_field(self, api_user_client, user):
        cl = m.CheckList.objects.create(user=user)
        run = m.CheckListRun.objects.create(user=user, checklist=cl)
        item1 = m.CheckListRunItem.objects.create(checklist_run=run, order=1, text='Yolo')
        item2 = m.CheckListRunItem.objects.create(checklist_run=run, order=2, text='Yolo')

        rv = api_user_client.patch(
            reverse('checklistrun-detail', kwargs={'pk': run.pk}),
            {
                'title': 'Hello',
                'items': [
                    {
                        'order': item1.order,
                        'text': item1.text,
                    },
                    {
                        'order': item2.order,
                        'text': item2.text,
                    },
                    {
                        'order': 3,
                        'text': "new Item",
                    },
                ]
            },
            format='json'
        )
        assert rv.status_code == status.HTTP_200_OK, rv.data
        assert run.items.count() == 3

        assert run.items.all()[0].order == 1
        assert run.items.all()[1].order == 2
        assert run.items.all()[2].order == 3
        assert run.items.all()[2].text == 'new Item'

from checklists import models as m
from checklists import services as s


def test_prepare_run():
    checklist = m.CheckList(
        title='Title',
        description='Description',
        is_latest_run_complete=True
    )
    items = [
        m.CheckListItem(checklist=checklist, text='item1', order=0),
        m.CheckListItem(checklist=checklist, text='item2', order=1),
        m.CheckListItem(checklist=checklist, text='item3', order=2),
    ]

    run, run_items = s.prepare_run(checklist, items)
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
    assert run.is_complete is False

    s.toggle_checklist_run_item(item2, True, [item1])
    assert checklist.is_latest_run_complete is True
    assert run.is_complete is True

    s.toggle_checklist_run_item(item2, False, [item1])
    assert checklist.is_latest_run_complete is False
    assert run.is_complete is False
from checklists import models as m
from checklists import services as s


def test_prepare_run():
    checklist = m.CheckList(title='Title', description='Description')
    items = [
        m.CheckListItem(checklist=checklist, text='item1', order=0),
        m.CheckListItem(checklist=checklist, text='item2', order=1),
        m.CheckListItem(checklist=checklist, text='item3', order=2),
    ]

    run, run_items = s.prepare_run(checklist, items)
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
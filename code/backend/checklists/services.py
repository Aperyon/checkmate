from django.utils import timezone

from . import models as m


def prepare_run(checklist, items, user, save=False):
    checklist_run = m.CheckListRun(
        checklist=checklist,
        title=checklist.title,
        description=checklist.description,
        user=checklist.user,
    )
    checklist.latest_run = checklist_run
    checklist.is_latest_run_complete = False

    if save:
        checklist_run.save()
        checklist.save()

    run_items = []
    for item in items:
        run_items.append(
            m.CheckListRunItem(
                checklist_run=checklist_run,
                text=item.text,
                order=item.order,
                is_checked=False
            )
        )

    if save:
        m.CheckListRunItem.objects.bulk_create(run_items)

    return checklist_run, run_items


def toggle_checklist_run_item(run_item, new_value, other_items, save=False):
    checklist_run = run_item.checklist_run
    checklist = run_item.checklist_run.checklist
    run_item.is_checked = new_value
    if new_value:
        if all([i.is_checked for i in other_items]):
            checklist_run.is_closed = True
            checklist.is_latest_run_complete = True
        else:
            checklist_run.is_closed = False
            checklist.is_latest_run_complete = False
    else:
        checklist_run.is_closed = False
        checklist.is_latest_run_complete = False

    if save:
        run_item.save()
        checklist.save()
        checklist_run.save()


def toggle_checklist_run_is_closed(checklist_run, is_closed_value, save=False):
    if is_closed_value is None:
        return

    checklist = checklist_run.checklist

    if checklist_run == checklist.latest_run and is_closed_value is True:
        checklist.is_latest_run_complete = True
        checklist_run.is_closed = is_closed_value

    if save:
        checklist_run.save()
        checklist.save()


def setup_checklist_run_items(checklist_run, items):
    checklist_run.items.all().delete()
    m.CheckListRunItem.objects.bulk_create(
        [m.CheckListRunItem(checklist_run=checklist_run, **item) for item in items]
    )

from . import models as m


def prepare_run(checklist, items, save=False):
    checklist_run = m.CheckListRun(
        checklist=checklist,
        title=checklist.title,
        description=checklist.description,
    )

    if save:
        checklist_run.save()

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
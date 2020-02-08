from django.db import models


class CheckList(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)


class CheckListItem(models.Model):
    checklist = models.ForeignKey('CheckList', on_delete=models.CASCADE, related_name='items')
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order', )


class CheckListRun(models.Model):
    checklist = models.ForeignKey('CheckList', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)


class CheckListRunItem(models.Model):
    checklist_run = models.ForeignKey('CheckListRun', on_delete=models.CASCADE, related_name='items')
    text = models.CharField(max_length=255)
    is_checked = models.BooleanField(default=False)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ('order', )
# Generated by Django 3.0.3 on 2020-02-21 15:46

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('checklists', '0006_auto_20200209_2039'),
    ]

    operations = [
        migrations.AddField(
            model_name='checklist',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2020, 2, 21, 15, 46, 28, 401668, tzinfo=utc)),
            preserve_default=False,
        ),
    ]

from django.contrib import admin

from . import models as m


admin.site.register(m.CheckList)
admin.site.register(m.CheckListItem)
admin.site.register(m.CheckListRun)
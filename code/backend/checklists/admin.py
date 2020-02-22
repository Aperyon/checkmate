from django.contrib import admin

from . import models as m


class CheckListAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'created_at']
    search_fields = ['title', 'user__email']


class CheckListRunAdmin(admin.ModelAdmin):
    list_display = ['title', 'user']
    search_fields = ['title', 'user__email']

admin.site.register(m.CheckList, CheckListAdmin)
admin.site.register(m.CheckListItem)
admin.site.register(m.CheckListRun, CheckListRunAdmin)
from django_filters import rest_framework as filters

from . import models as m


class CheckListRunFilter(filters.FilterSet):
    class Meta:
        model = m.CheckListRun
        fields = ['checklist', ]
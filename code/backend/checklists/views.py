from rest_framework import viewsets

from . import models as m
from . import serializers as s

class CheckListViewSet(viewsets.ModelViewSet):
    queryset = m.CheckList.objects.all()
    serializer_class = s.CheckListSerializer


class CheckListRunViewSet(viewsets.ModelViewSet):
    queryset = m.CheckListRun.objects.all()
    serializer_class = s.CheckListRunSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        return super().create(request, *args, **kwargs)


class CheckListRunItemViewSet(viewsets.ModelViewSet):
    queryset = m.CheckListRunItem.objects.all()
    serializer_class = s.ChecklistRunItemSerializer

from rest_framework import viewsets

from . import models as m
from . import serializers as s

class CheckListViewSet(viewsets.ModelViewSet):
    queryset = m.CheckList.objects.all()
    serializer_class = s.CheckListSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CheckListRunViewSet(viewsets.ModelViewSet):
    queryset = m.CheckListRun.objects.all()
    serializer_class = s.CheckListRunSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CheckListRunItemViewSet(viewsets.ModelViewSet):
    queryset = m.CheckListRunItem.objects.all()
    serializer_class = s.ChecklistRunItemSerializer

    def get_queryset(self):
        return self.queryset.filter(checklist_run__user=self.request.user)

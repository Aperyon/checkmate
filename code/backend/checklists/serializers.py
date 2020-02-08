from rest_framework import serializers

from . import models as m
from . import services as s


class ChecklistItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = m.CheckListItem
        fields = ('text', )


class ChecklistRunItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = m.CheckListRunItem
        fields = ('url', 'is_checked', 'text')
        read_only_fields = ('url', 'text')


class CheckListSerializer(serializers.HyperlinkedModelSerializer):
    items = ChecklistItemSerializer(many=True)

    class Meta:
        model = m.CheckList
        fields = ('url', 'pk', 'title', 'description', 'items')

    def create(self, validated_data):
        items = validated_data.pop('items', [])
        checklist = super().create(validated_data)

        item_objects = []
        for index, item in enumerate(items):
            item_objects.append(
                m.CheckListItem(
                    checklist=checklist,
                    order=index,
                    text=item['text']
                )
            )

        if item_objects:
            m.CheckListItem.objects.bulk_create(item_objects)
        return checklist

    def update(self, instance, validated_data):
        items = validated_data.pop('items', [])
        checklist = super().update(instance, validated_data)

        if not items:
            return checklist

        item_objects = []
        for index, item in enumerate(items):
            item_objects.append(
                m.CheckListItem(
                    checklist=checklist,
                    order=index,
                    text=item['text']
                )
            )

        if item_objects:
            checklist.items.all().delete()
            m.CheckListItem.objects.bulk_create(item_objects)

        return checklist


class CheckListRunSerializer(serializers.HyperlinkedModelSerializer):
    checklist = serializers.HyperlinkedRelatedField(view_name='checklist-detail', queryset=m.CheckList.objects.all())
    items = ChecklistRunItemSerializer(many=True, read_only=True)

    class Meta:
        model = m.CheckListRun
        fields = ('url', 'pk', 'title', 'description', 'checklist', 'items')
        read_only_fields = ('title', 'description')

    def create(self, validated_data):
        print(validated_data)
        checklist = validated_data.pop('checklist')
        run, run_items = s.prepare_run(checklist, checklist.items.all(), save=True)
        return run

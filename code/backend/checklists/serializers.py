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
        read_only_fields = ('url',)

    # def update(self, instance, validated_data):
    #     is_checked = validated_data.pop('is_checked', False)
    #     # other_items = instance.checklist_run.items.exclude(pk=instance.pk)
    #     # s.toggle_checklist_run_item(instance, is_checked, other_items, save=True)
    #     return instance


class CheckListSerializer(serializers.HyperlinkedModelSerializer):
    items = ChecklistItemSerializer(many=True)

    class Meta:
        model = m.CheckList
        fields = ('url', 'pk', 'title', 'description', 'items', 'is_latest_run_complete',
                  'latest_run')
        read_only_fields = ('is_latest_run_complete', 'latest_run')

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
    checklist_pk = serializers.IntegerField(source='checklist.pk', read_only=True)
    items = ChecklistRunItemSerializer(many=True, read_only=True)

    class Meta:
        model = m.CheckListRun
        fields = ('url', 'pk', 'title', 'description', 'checklist', 'items', 'is_closed', 'checklist_pk', 'name')
        read_only_fields = ('checklist', )
        extra_kwargs = {
            'title': {
                'required': False,
            },
            'description': {
                'required': False,
            }
        }

    def create(self, validated_data):
        checklist = validated_data.pop('checklist')
        run, run_items = s.prepare_run(
            checklist,
            checklist.items.all(),
            checklist.user,
            save=True
        )
        return run

    def update(self, instance, validated_data):
        is_closed = validated_data.pop('is_closed', None)
        s.toggle_checklist_run_is_closed(instance, is_closed, save=True)
        updated_instance = super().update(instance, validated_data)
        return updated_instance

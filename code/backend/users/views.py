from rest_framework import viewsets
from rest_framework import mixins as drf_mix
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from . import serializers as s


class UserViewSet(drf_mix.CreateModelMixin,
                  drf_mix.RetrieveModelMixin,
                  drf_mix.UpdateModelMixin,
                  drf_mix.DestroyModelMixin,
                  viewsets.GenericViewSet):
    serializer_class = s.UserSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (AllowAny,)

        return super().get_permissions()

    def get_object(self):
        return self.request.user

    def create(self, request, *args, **kwargs):
        serializer = s.CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


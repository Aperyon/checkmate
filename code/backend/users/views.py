from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import viewsets
from rest_framework import mixins as drf_mix
from rest_framework import status
from rest_framework.decorators import permission_classes, action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.reverse import reverse

from . import serializers as s
from . import models as m
from . import emails


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

    @action(detail=False, methods=['post'], url_path='forgot-password')
    @permission_classes([AllowAny])
    def forgot_password(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not email:
            return Response()

        try:
            user = m.User.objects.get(email=email)
        except (m.User.DoesNotExist, m.User.MultipleObjectsReturned):
            return Response()

        uid = urlsafe_base64_encode(str(user.pk).encode())
        token = default_token_generator.make_token(user)
        url = f'{request.META["HTTP_ORIGIN"]}/reset-password/{uid}/{token}/'
        emails.send_forgot_password_email(user.email, url)
        return Response()

    @action(detail=False, methods=['post'], url_path='reset-password/(?P<uidb64>.+)/(?P<token>.+)')
    @permission_classes([AllowAny])
    def reset_password(self, request, uidb64=None, token=None, *args, **kwargs):
        password = request.data.get('password')

        if not password:
            raise ValidationError({'password': 'This field is required'})

        pk = urlsafe_base64_decode(uidb64).decode()
        try:
            user = m.User.objects.get(pk=pk)
        except:
            raise ValidationError({'non_field_error': 'The link has expired'})

        is_valid = default_token_generator.check_token(user, token)
        if not is_valid:
            raise ValidationError({'non_field_error': 'The link has expired'})

        user.set_password(password)
        user.save()
        return Response()


from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as SimpleJWTTokenObtainPairSerializer

from . import models as m


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.User
        fields = ('email', 'password')

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data['password']
        user = m.User.objects.create_user(email, password)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.User
        fields = ('email', )


class TokenObtainSerializer(SimpleJWTTokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Invalid credentials'
    }
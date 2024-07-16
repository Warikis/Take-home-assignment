from rest_framework import serializers
from django.contrib.auth import get_user_model
from .validations import validate_email, validate_username, validate_password

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validate_email])
    username = serializers.CharField(validators=[validate_username])
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Ensure the password is hashed when creating a user
        user = User.objects.create_user(**validated_data)
        return user
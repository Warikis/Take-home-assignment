from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.core.validators import validate_email as django_validate_email
import re

User = get_user_model()

def validate_email(value):
    # Use Django's built-in email validator
    try:
        django_validate_email(value)
    except ValidationError:
        raise ValidationError("Invalid email format")
    
    # Check for email uniqueness
    if User.objects.filter(email=value).exists():
        raise ValidationError("Email is already taken")
    return value

def validate_username(value):
    value = value.strip()
    if not value:
        raise ValidationError('Username cannot be empty')
    
    # Check for username uniqueness
    if User.objects.filter(username=value).exists():
        raise ValidationError('Username is already taken')
    
    # Additional username format validations can be added here
    return value

def validate_password(value):
    value = value.strip()
    if not value:
        raise ValidationError('Password cannot be empty')
    
    # Password strength validation
    if len(value) < 8:
        raise ValidationError('Password must be at least 8 characters long')
    
    if not re.search("[a-z]", value):
        raise ValidationError('Password must contain at least one lowercase letter')
    
    if not re.search("[A-Z]", value):
        raise ValidationError('Password must contain at least one uppercase letter')
    
    if not re.search("[0-9]", value):
        raise ValidationError('Password must contain at least one digit')
    
    if not re.search("[!@#$%^&*(),.?\":{}|<>]", value):
        raise ValidationError('Password must contain at least one special character')
    
    return value
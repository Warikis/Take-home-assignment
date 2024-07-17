from rest_framework import serializers
from .models import Recipe
import datetime

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'
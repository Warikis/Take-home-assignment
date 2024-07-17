from django.urls import path
from .views import RecipeViewSet, RecipesFormView

app_name = "recipes"

urlpatterns = [
    path('', RecipeViewSet.as_view(), name='recipe_list_create'),
    path('new/', RecipesFormView.as_view(), name='recipes_form'),
]
# Import necessary modules and classes
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Recipe
from .serializers import RecipeSerializer

# Define the RecipeViewSet class
class RecipeViewSet(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(RecipeViewSet, self).get_permissions()

    def get(self, request, format=None):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk, format=None):
        recipe = get_object_or_404(Recipe, pk=pk)
        if recipe.user_id == request.user.id:
            recipe.delete()
            Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You do not have permission to delete this recipe."}, status=status.HTTP_403_FORBIDDEN)
    

class RecipesFormView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        # Existing GET logic
        return Response({"message": "This is the recipes form view."})

    def post(self, request, format=None):
        modified_data = request.data.copy()  # Create a mutable copy of the request data
        modified_data['user'] = request.user.id  # Automatically add the authenticated user's ID
        serializer = RecipeSerializer(data=modified_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)  # Log or debug the errors
        return Response(serializer.errors, status=400)
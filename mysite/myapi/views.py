from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserRegistrationSerializer

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, Duck!'})


class LoginView(APIView):
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Logged in successfully'})
        else:
            raise AuthenticationFailed('Invalid username or password')
        

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            login(request, user)
            return Response({'message': 'User created successfully'})
        else:
            return Response(serializer.errors, status=400)
        

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'})
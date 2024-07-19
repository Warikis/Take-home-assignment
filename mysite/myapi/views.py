from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .serializers import UserRegistrationSerializer

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, Duck!'})


class LoginView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'message': 'Logged in successfully', 'token': token.key})
        else:
            raise AuthenticationFailed('Invalid username or password')
        

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'message': 'User created successfully', 'token': token.key})
        else:
            return Response(serializer.errors, status=400)
        

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'})
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'is_staff': user.is_staff,
        })
    

@api_view(['GET'])
def health(request):
    return Response({'message': 'Healthy!'})
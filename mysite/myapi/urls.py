from django.urls import path

from . import views

app_name = "api"
urlpatterns = [
   path("", views.hello_world, name = "index"),
   path("hello-world/", views.hello_world, name = "hello_world"),
   path('login/', views.LoginView.as_view(), name='login'),
   path('register/', views.RegisterView.as_view(), name='register'),
]
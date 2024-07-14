from django.urls import path

from . import views

app_name = "api"
urlpatterns = [
   path("", views.hello_world, name = "index"),
   path("hello-world/", views.hello_world, name = "hello_world"),
]
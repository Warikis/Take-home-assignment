from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path("", views.index, name="index"),
    #path for questions
    # the 'name' value as called by the {% url %} template tag
    # added the word 'specifics'
    path("<int:question_id>/", views.detail, name="detail"),
    #path for results
    path("<int:question_id>/results/", views.results, name="results"),
    #path for votes
    path("<int:question_id>/vote/", views.vote, name="vote"),
]
from django.db import models
from django.conf import settings

class Recipe(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    number_of_persons = models.IntegerField()
    total_time_to_prepare = models.DurationField()
    ingredients = models.TextField()
    steps = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    votes = models.IntegerField(default=0)
    

    def __str__(self):
        return self.name
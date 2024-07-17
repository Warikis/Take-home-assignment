from django.db import models

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    number_of_persons = models.IntegerField()
    total_time_to_prepare = models.DurationField()
    ingredients = models.TextField()
    steps = models.TextField()
    video_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name
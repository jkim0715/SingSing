from django.db import models 
from imagekit.models import ImageSpecField, ProcessedImageField
from imagekit.processors import ResizeToFill, ResizeToFit, Thumbnail
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

class Post(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    address_name=models.CharField(max_length=30)
    payment = models.CharField(max_length= 16)
    genre = models.TextField()
    time = models.CharField(max_length= 16)
    contents = models.TextField()
    created_date = models.DateTimeField(auto_now_add= True)
    updated_date = models.DateTimeField(auto_now= True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def comments(self):
        return Comment.objects.filter(post_id=self.id).order_by('-created_date')

    def profile(self):
        return Profile.objects.get(user_id =self.user_id)
      
class Place(models.Model):
    place_id = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=30)
    x = models.CharField(max_length=40)
    y = models.CharField(max_length=40)

class Comment(models.Model):
    contents = models.TextField()
    created_date = models.DateTimeField(auto_now_add= True)
    updated_date = models.DateTimeField(auto_now= True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
   


class Profile(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    age = models.IntegerField()
    birthdate = models.DateField()
    gender = models.CharField(max_length=16)
    user_likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="profile_likes")
    image = models.ImageField(blank=True, null=True)
    image_thumbnail = ImageSpecField(
        source='image',
        processors=[ResizeToFit(300,300)],
        format='JPEG',
        options={'quality':90},
    )

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Room(models.Model):
    title = models.CharField(max_length=32)
    #채널 이름 다른 방에서 전송한 메시지가 오면 안되니까 각각 유니크 한걸로.
    code = models.CharField(max_length=16, unique =True)
    max_connection = models.IntegerField()
    master = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="rooms")

class Message(models.Model):
    contents = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
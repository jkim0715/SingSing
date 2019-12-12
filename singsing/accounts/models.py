from django.db import models
from django.conf import settings



class Room(models.Model):
    #채널 이름 다른 방에서 전송한 메시지가 오면 안되니까 각각 유니크 한걸로.
    code = models.CharField(max_length=16, unique =True)
    starter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='started_rooms')
    guest = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invited_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="rooms")

class Message(models.Model):
    contents = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # created_at = models.DateTimeField(auto_now_add=True)
    # user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

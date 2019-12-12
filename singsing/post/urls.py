from django.contrib import admin
from django.urls import path
from . import views




urlpatterns = [
    #처음 접속했을 때 메인 페이지 (GET) 
    #게시글 작성 (POST)
    path('', views.index, name = "index"),
    path('check/', views.check, name = "check"),
    path('delete/',views.delete_post, name="delete_post"),
    #노래방 등록
    path('garaokay/',views.garaokay,name="garaokay"),
    #게시글 작성 (POST)
    path('comment/', views.comment, name= "comment"),
    path('comment/delete/', views.comment_delete, name="comment_delete"),
]

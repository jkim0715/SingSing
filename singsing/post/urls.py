from django.contrib import admin
from django.urls import path
from . import views




urlpatterns = [
    #처음 접속했을 때 메인 페이지 (GET) 
    #게시글 작성 (POST)
    path('', views.index, name = "index"),
    path('new/', views.new, name= "name")
    #게시글 수정
    #게시글 삭제 

    #댓글 작성
    #댓글 수정
    #댓글 삭제 
]
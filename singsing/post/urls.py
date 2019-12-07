from django.contrib import admin
from django.urls import path
from . import views




urlpatterns = [
    #처음 접속했을 때 메인 페이지 (GET) 
    #게시글 작성 (POST)
    path('', views.index, name = "index"),
    #게시글 작성 (POST)
    path('new/', views.new, name= "new"),

]
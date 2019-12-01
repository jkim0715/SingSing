from django.shortcuts import render, redirect
from bs4 import BeautifulSoup
import requests
from django.http.response import HttpResponse
from .models import Post, Comment
import json

# Create your views here.
def index(request):
    if request.method == 'POST':
        post = Post()
        post.contents = request.POST['contents']
        post.user_id= request.POST['userId']
        post.save()
        print("done")
        return redirect('index')
    else:

        posts = Post.objects.all().order_by("-created_date")
        context = {
            'posts':posts
        }
        return render(request, 'index.html', context)



def new(request):
    user = request.user.id
 
    context = {
        'user':user
    }
    return render(request, 'new.html', context)


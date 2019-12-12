from django.shortcuts import render, redirect
from bs4 import BeautifulSoup
import requests
from django.http.response import HttpResponse
from .models import Post, Comment, Profile, Place
from datetime import datetime
from .forms import MyModelForm
import json

# Create your views here.
def index(request):
    if request.method == 'POST':
        post = Post()
        post.contents = request.POST['contents']
        post.user_id= request.POST['userId']
        post.latitude =1.1 #request.POST['latitude']
        post.longitude =1.1#request.POST['longitude']
        post.genre = request.POST['genre']
        post.payment = request.POST['payment']
        now = datetime.now()
        date = now.strftime("%y-%m-%d")
        time = request.POST['time']
        
        post.time = date+' '+time
        
        #post.save()
        return redirect('index')
    else:

        posts = Post.objects.all().order_by("-created_date")
        form = MyModelForm()
        context = {
            'posts':posts,
            'form':form
    
        }
        return render(request, 'index.html', context)



def delete_post(request):
    if request.method  =='POST':
        id = request.POST['post_id']
        post= Post.objects.get(id=id)
        post.delete()
        context = {
            'post_id':id
        }
    return HttpResponse(json.dumps(context), content_type="application/json")



def comment(request):
    if request.method=="POST":
        if request.user.is_authenticated:
            contents = request.POST["comment"]
            post_id= request.POST["post_id"]
            comment = Comment()
            comment.contents = contents
            comment.post_id= post_id
            comment.user_id = request.user.id 
            comment.save()
            context = {
                'content': comment.contents,
                'id':post_id,
                'comment_id':comment.id
            }
    return HttpResponse(json.dumps(context), content_type="application/json")

def garaokay(request):
    if request.method=="POST":
        place, created = Place.objects.get_or_create(
            place_id= request.POST["place_id"],
            name= request.POST["place_title"],
            x= request.POST["place_x"],
            y= request.POST["place_y"]
        )
        if not created:
         return HttpResponse('저장실패')
        else:
         return HttpResponse('저장성공')
        

    

def comment_delete(request):
    if request.method  =='POST':
        id = request.POST['comment_id']
        comment= Comment.objects.get(id=id)
        if comment.user_id == request.user.id:
            comment.delete()
            context = {
                'comment_id':id
            }
            return HttpResponse(json.dumps(context), content_type="application/json")
        else:
            return HttpResponse('', status=401)


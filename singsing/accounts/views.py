from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.shortcuts import get_object_or_404
from post.models import Profile
from .models import Room, Message
from datetime import datetime 
from django.http.response import HttpResponse 
import secrets
import json
import pusher

pusher_client = pusher.Pusher(
  app_id='916208',
  key='a29dc435598c373f2627',
  secret='cff9fea296472be3698a',
  cluster='ap3',
  ssl=True
)


# Create your views here.
def signup(request):
    if request.method == "POST":
        # print('heel')
        #POST방식으로 오면 create진행
        # 요청을 통째로 넣으면 됨.
        ## UserCreationForm이 자동으로 다해줌.. 비번두개 맞는지 틀린지 등등 name=username name=password1 / name=password2 는 고정 정해진거임
        form = UserCreationForm(request.POST)
        #validation
        # print(form)

        if form.is_valid():
            # print(form)
            #form.save()로 저장 후 user라는 변수에 담기.
            user = form.save()
            profile = Profile()
            birthdate =  request.POST['birthdate']
            profile.user_id = user.id
            profile.birthdate = birthdate
            profile.gender = request.POST['gender']
            age = datetime.now().year-(int)(birthdate.split("-")[0])
            profile.age = age
            profile.save()
            ##로그인도 시켜주자
            auth_login(request, user)
            return redirect('index')
        else: 
            return render(request, 'signup.html')
    else:
        if request.user.is_authenticated:
            return redirect('index')
        else:
        #get방식으로 오면 회원가입 페이지로 랜더링
            return render(request,'signup.html')



def login(request):
    if request.method=='POST':
        form = AuthenticationForm(request, request.POST)
        print(form)
        if form.is_valid():
            auth_login(request, form.get_user())
            return redirect('index')
        else:
            return render(request, 'login.html')
    else:
        if request.user.is_authenticated:
            return redirect('index')
        else:
            return render(request,'login.html')



def logout(request):
    auth_logout(request)
    return redirect('index')


def profile(request, user_id):
    # if request.method=='POST':
    if request.method=="POST":
        profile = Profile.objects.get(user_id = user_id)
        profile.image= request.FILES['image']
        profile.save(0)
        return redirect('index')
    else:
        profile = Profile.objects.get(user_id = user_id)
        author_id = user_id
        context ={
            'author_id': author_id,
            'profile' : profile
        }

        return render(request, 'profile.html', context )



def chat(request, guest_id):
  
    me = request.user
    you = get_object_or_404(User, id=guest_id)

    if me.started_rooms.filter(guest=you).exists():
        room = me.started_rooms.get(guest=you)
    elif me.invited_rooms.filter(starter=you):
        room = me.invited_rooms.get(starter=you) 
    else:
        room = Room()
        room.starter = me
        room.guest = you
        room.code = secrets.token_urlsafe(16)
        room.save()

    messages = Message.objects.filter(room_id = room.id)
    if messages.exists():
        context ={
            'messages': messages,
            'room' : room
        }

        return render(request,'chat.html', context)
    else:
        context2 ={
            'messages': messages,
            'room' : room
        }
        return render(request,'chat.html', context2)



def message(request, room_id):
    room = Room.objects.get(id=room_id)
    message = Message()
    message.room_id = room.id
    message.contents = request.POST['contents']
    message.user_id = request.user.id 
    message.save()

    context ={
        'contents': message.contents,
        'user' : request.user.username
    }
    ## 메인에서 대화내용 보지도 않을건데 굳이 채널을 main이랑 같이 쓸 필요 없음
    pusher_client.trigger(room.code, 'chat', json.dumps(context))
    return HttpResponse('', status =204 )




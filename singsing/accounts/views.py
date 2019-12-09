from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout

from post.models import Profile
from datetime import datetime 

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




from django.urls import path
from . import views as accounts_views
app_name = 'accounts'


urlpatterns = [
    path('login/', accounts_views.login, name="login"),
    path('logout/', accounts_views.logout, name="logout"),
    path('signup/', accounts_views.signup, name="signup"), 
    #프로필 창
    #프로필 등록 / 수정
    path('profile/<int:user_id>/', accounts_views.profile, name="profile"),
]
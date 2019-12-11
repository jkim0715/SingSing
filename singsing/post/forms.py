from django import forms
from .models import Post
class MyModelForm(forms.ModelForm):
    time = forms.DateField(widget=forms.DateInput(attrs={'class':'timepicker'}))
    class Meta:
         model = Post
         fields = ['time']

    
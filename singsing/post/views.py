from django.shortcuts import render
from bs4 import BeautifulSoup
import requests


#url = '/maps/preview/opensearch.xml?hl=ko'
# response = requests.get(url)

# html = BeautifulSoup(response.text,'html.parser')

# company_list = html.find('button',{"class" })
# print(company_list)
# Create your views here.
def index(request):

    return render(request, 'index.html')


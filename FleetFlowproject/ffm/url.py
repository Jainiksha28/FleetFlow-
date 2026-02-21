from django.url import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('register/', views.register, name='register'),
]
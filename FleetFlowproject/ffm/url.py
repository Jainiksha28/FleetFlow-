from django.urls import path
from . import views

urlpatterns = [
     path('', views.login_view, name='index'),
    path('register/', views.register, name='register'),
    path('manager/', views.manager_dashboard, name='Dashboard'),

]
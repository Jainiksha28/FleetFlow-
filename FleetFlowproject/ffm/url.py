from django.urls import path
from . import views

urlpatterns = [
     path('', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    
#     path('drivers/', driver_list, name='driver'),
#     path('drivers/toggle/<int:driver_id>/', toggle_status, name='toggle_status'),
#        path('analytics/', views.analytics_dashboard, name='analytics'),
# 
]


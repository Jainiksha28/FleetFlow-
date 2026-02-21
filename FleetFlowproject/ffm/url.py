from django.urls import path
from . import views

urlpatterns = [
     path('', views.login_view, name='index'),
    path('register/', views.register, name='register'),

    path('manager/', views.manager_dashboard, name='Dashboard'),
    path('tripmanager/', views.trip_manager, name='Tripmanagement'),
    path('vehicle/', views.vehicle, name='Vehicle'),
    path('maintenance/', views.Maintenance, name='Maintenance'),
    path('trip_expense/', views.Trip_expense, name='Trip_expense'),
    path('analytics/', views.analytics, name='analytics'),
    path('performance/', views.driver, name='driver'),


]

    




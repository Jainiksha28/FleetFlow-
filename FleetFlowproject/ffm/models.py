from django.db import models
from django.contrib.auth.models import User


class Userprofile(models.Model):

    ROLE_CHOICES = [
        ('Manager', 'Manager'),
        ('Dispatcher', 'Dispatcher'),
        ('Safety Officer', 'Safety Officer'),
        ('Financial Analyst', 'Financial Analyst'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    def __str__(self):
        return self.user.username


        


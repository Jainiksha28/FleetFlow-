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


        from datetime import date

# class Driver(models.Model):
#     STATUS_CHOICES = [
#         ('On Duty', 'On Duty'),
#         ('Off Duty', 'Off Duty'),
#         ('Suspended', 'Suspended'),
#     ]
#     name = models.CharField(max_length=100)
#     license_expiry = models.DateField()
#     completion_rate = models.IntegerField(default=0)
#     safety_score = models.IntegerField(default=0)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Off Duty')
#     assigned = models.BooleanField(default=False)

#     @property
#     def expired(self):
#         return self.license_expiry < date.today()
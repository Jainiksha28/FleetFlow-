from django import forms
from .models import UserProfile

class RegisterForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['full_name', 'role']
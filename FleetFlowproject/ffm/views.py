from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import Userprofile
from django.contrib import messages
from django.contrib.auth import authenticate, login

# Create your views here.



def register(request):
    if request.method == 'POST':
        full_name = request.POST['full_name']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        role = request.POST['role']

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('register')

        if User.objects.filter(username=email).exists():
            messages.error(request, "Email already exists")
            return redirect('register')

        # Create User
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Save Role
        Userprofile.objects.create(user=user, role=role)

        messages.success(request, "Account Created Successfully")
        return redirect('login')

    return render(request, 'register.html')



def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid Credentials")
            return redirect('login')

    return render(request, 'login.html')
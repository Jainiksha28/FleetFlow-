from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import Userprofile
from django.contrib import messages
from django.contrib.auth import authenticate, login


from django.contrib.auth.decorators import login_required

# Create your views here.


def register(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        role = request.POST.get('role')

        # Check empty fields
        if not full_name or not email or not password or not confirm_password or not role:
            messages.error(request, "All fields are required")
            return redirect('register')

        # Password match check
        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('register')

        # Email already exists check
        if User.objects.filter(username=email).exists():
            messages.error(request, "Email already exists")
            return redirect('register')

        # Create Django User
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        # Create UserProfile with full_name and role
        Userprofile.objects.create(
            user=user,
            full_name=full_name,
            role=role
        )

        messages.success(request, "Account Created Successfully")
        return redirect('index')

    return render(request, 'ffm/register.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)

            # Role-based redirect
            role = user.userprofile.role

            if role == "manager":
                return redirect('Dashboard')
            elif role == "dispatcher":
                return redirect('Dashboard')
            else:
                return redirect('driver_dashboard')

        else:
            messages.error(request, "Invalid credentials")
            return redirect('index')

    return render(request, 'ffm/index.html')



@login_required
def manager_dashboard(request):
    if request.user.userprofile.role != "manager":
        return redirect('index')
    return render(request, 'ffm/Dashboard.html')



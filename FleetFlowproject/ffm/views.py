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




    from django.http import JsonResponse
from .models import Driver

# def driver_list(request):
#     data = [{
#         "id": d.id,
#         "name": d.name,
#         "licenseExpiry": d.license_expiry.strftime("%Y-%m-%d"),
#         "completionRate": d.completion_rate,
#         "safetyScore": d.safety_score,
#         "status": d.status,
#         "assigned": d.assigned,
#         "expired": d.expired
#     } for d in Driver.objects.all()]
#     return JsonResponse(data, safe=False)

# def toggle_status(request, driver_id):
#     try:
#         d = Driver.objects.get(id=driver_id)
#         d.status = "Off Duty" if d.status == "On Duty" else "Suspended" if d.status == "Off Duty" else "On Duty"
#         d.save()
#         return JsonResponse({"success": True, "new_status": d.status})
#     except Driver.DoesNotExist:
#         return JsonResponse({"success": False})




#         from django.shortcuts import render

# def analytics_dashboard(request):
#     # Mock data (in real case, fetch from database)
#     revenue = 185000
#     fuel_cost = 40000
#     maintenance = 25000
#     acquisition = 100000
#     distance = 50000  # km
#     fuel_used = 3200  # liters

#     fuel_efficiency = round(distance / fuel_used, 2)
#     roi = round(((revenue - (maintenance + fuel_cost)) / acquisition) * 100, 2)
#     profit = revenue - (fuel_cost + maintenance + acquisition)

#     context = {
#         "revenue": revenue,
#         "fuel_cost": fuel_cost,
#         "maintenance": maintenance,
#         "acquisition": acquisition,
#         "fuel_efficiency": fuel_efficiency,
#         "roi": roi,
#         "profit": f"₹{profit:,}"
#     }
#     return render(request, "analytics.html", context)
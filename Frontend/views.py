from django.shortcuts import redirect, render 
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from accounts.models import user  # Import the User model from the accounts app
from django.views.decorators.cache import never_cache

# Create your views here.
@never_cache
def home(request):
    return render(request, 'index.html')


@login_required
def profile(request):
    print(f"Logged-in user: {request.user}")  # Check what is returned for request.user
    user = request.user  # Get the current logged-in user
    print(f"User data before update: {user.name}, {user.email}, {user.age}, {user.weight}, {user.gender}, {user.activity_level}")
    
    if request.method == 'POST':
        # Get the updated data from the form
        updated_name = request.POST['name']
        updated_email = request.POST['email']
        updated_age = request.POST['age']
        updated_weight = request.POST['weight']
        updated_gender = request.POST['gender']
        updated_activity_level = request.POST['activity_level']

        # Debugging prints to check the values received from the form
        print(f"Received form data: Name: {updated_name}, Email: {updated_email}, Age: {updated_age}, Weight: {updated_weight}, Gender: {updated_gender}, Activity Level: {updated_activity_level}")

        # Update the user object with the new values
        user.name = updated_name
        user.age = updated_age
        user.weight = updated_weight
        user.gender = updated_gender
        user.activity_level = updated_activity_level

        # Save the updated user data to the database
        user.save()

        # Debugging print to confirm the update
        print(f"User data after update: {user.name}, {user.email}, {user.age}, {user.weight}, {user.gender}, {user.activity_level}")
        
        # Display a success message and redirect to the profile page
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')  # Redirect to the same page to see updated data

    return render(request, 'Profile.html', {'user': user})

def analyze(request):
    # You can pass context here if needed, for now, it will just render the page
    return render(request, 'Analyze.html')

def track(request):
    # You can pass context here if needed, for now, it will just render the page
    return render(request, 'Track.html')
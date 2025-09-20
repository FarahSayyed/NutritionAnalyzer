from django.shortcuts import render, redirect 
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login, logout
from .models import User

def register(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        age = request.POST['age']
        weight = request.POST['weight']
        gender = request.POST['gender']
        activity_level = request.POST['activity_level']

         # Debug message: Check received POST data
        print(f"Received data - Name: {name}, Email: {email}, Age: {age}, Weight: {weight}, Gender: {gender}, Activity Level: {activity_level}")
        
        # Check if passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            print(f"Passwords do not match for user: {email}")
            return redirect('register')
          

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            print(f"Email already registered: {email}")
            return redirect('register')
           

        # Hash the password and create the user
        hashed_password = make_password(password)
        User.objects.create(
            name=name,
            email=email,
            password=hashed_password,
            age=age,
            weight=weight,
            gender=gender,
            activity_level=activity_level
        )
        messages.success(request, 'Registration successful! Please log in.')
        print(f"User {email} registered successfully")
        return redirect('login')  # Redirect to login page after successful registration

    return render(request, 'Register.html')  # Render registration form

# def login_view(request):
#     if request.method == 'POST':
#         email = request.POST['email']
#         password = request.POST['password']
         
#         print(f"Attempting login for email: {email}")
        
       
#         # Authenticate user with email and password
#         user = authenticate(request, username=email, password=password)
#         print(f'User: {user}')

#         # # Check if the user exists and password matches
#         # user = User.objects.filter(email=email).first()

#         # if user and check_password(password, user.password):
#         #     # Authenticate user and log them in
#         #     login(request, user)  # Django's login function sets the session
#         #     return redirect('home')  # Redirect to home page (change to your actual home view)
#         # else:
#         #     return render(request, 'Frontend/login.html', {'error': 'Invalid credentials'})  # Display error message

        
#         if user:
#             # User is authenticated, log them in 
            
#             login(request, user)
#             print("Authentication successful")
#             messages.success(request, 'Login successful!')
#             return redirect('home')  # Redirect to home page (change to your actual home view)
#         else:
#             messages.error(request, 'Invalid credentials')
#             print("Authentication failed")
#             return redirect('login')  # Display error message

    
#     return render(request, 'login.html')  # Render login form


def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        
        print(f"Attempting login for email: {email}")
        
        # Authenticate user using the custom user model
        try:
            # Retrieve the user from the custom User model
            user = User.objects.get(email=email) 
            print(f"user={user}")
            
            # Check if the provided password matches the hashed password
            if check_password(password, user.password):
                login(request, user)  # Log the user in
                messages.success(request, 'Login successful!')
                print("Authentication successful")
                # return redirect('home')  # Redirect to home page after successful login
                return render(request, 'index.html', {'user': user})
            else:
                messages.error(request, 'Invalid credentials')
                print("Authentication failed - wrong password")
        except User.DoesNotExist:
            messages.error(request, 'Invalid credentials')
            print("Authentication failed - user does not exist")
        
        return redirect('login')  # Return to the login page if authentication fails
    
    return render(request, 'login.html')  # Render the login form

def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out successfully.')
    print(f"User logged out") 
    return redirect('home')  # Redirect to login page after logout 
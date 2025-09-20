


# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db import models
# from django.utils import timezone


# class UserManager(BaseUserManager):
#     # Method to create a regular user
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError("The Email field is required")
#         email = self.normalize_email(email)
#         extra_fields.setdefault('is_active', True)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user


# class User(AbstractBaseUser, PermissionsMixin):
#     GENDER_CHOICES = [
#         ('Male', 'Male'),
#         ('Female', 'Female'),
#         ('Other', 'Other'),
#     ]
    
#     ACTIVITY_LEVEL_CHOICES = [
#         ('Sedentary', 'Little or no exercise, sitting most of the day'),
#         ('Lightly Active', 'Light exercise or sports 1-3 days per week'),
#         ('Moderately Active', 'Moderate exercise or sports 3-5 days per week'),
#         ('Very Active', 'Hard exercise or sports 6-7 days per week'),
#     ]

#     # Define the fields
#     email = models.EmailField(unique=True)
#     name = models.CharField(max_length=50)
#     age = models.PositiveIntegerField()
#     weight = models.PositiveIntegerField()
#     gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
#     activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES)
#     registration_date = models.DateTimeField(default=timezone.now)
    
#     # Permissions-related fields
#     is_active = models.BooleanField(default=True)

#     # Manager for the User model
#     objects = UserManager()

#     # Specify email as the unique identifier for authentication
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['name']

#     def __str__(self):
#         return f'{self.name} ({self.email})'

#     # Custom validation for age and weight
#     def clean(self):
#         if self.age < 10 or self.age > 100:
#             raise models.ValidationError("Age must be between 10 and 100.")
#         if self.weight < 20 or self.weight > 200:
#             raise models.ValidationError("Weight must be between 20 and 200 kg.")
#         super().clean()  # Call the parent clean() method







from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and returns a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    
    ACTIVITY_LEVEL_CHOICES = [
        ('Sedentary', 'Little or no exercise, sitting most of the day'),
        ('Lightly Active', 'Light exercise or sports 1-3 days per week'),
        ('Moderately Active', 'Moderate exercise or sports 3-5 days per week'),
        ('Very Active', 'Hard exercise or sports 6-7 days per week'),
    ]

    # Define the fields
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Store password (hashed later)
    name = models.CharField(max_length=50)
    age = models.PositiveIntegerField()  # Age should be an integer between 10 and 100
    weight = models.PositiveIntegerField()  # Weight should be a number between 20 and 200
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_LEVEL_CHOICES)
    
    # Optional: Add date of registration
    registration_date = models.DateTimeField(auto_now_add=True)

    # Fields inherited from AbstractBaseUser
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)

    # Add related_name to avoid reverse access issues
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='accounts_user_set',  # Added related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='accounts_user_permissions_set',  # Added related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    # Specify email as the username field for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']  # Add any other fields you want to be mandatory

    # Custom manager for handling user creation
    objects = CustomUserManager()

    def __str__(self):
        return f'{self.name} ({self.email})'

    # Custom validation for age and weight
    def clean(self):
        if self.age < 10 or self.age > 100:
            raise models.ValidationError("Age must be between 10 and 100.")
        if self.weight < 20 or self.weight > 200:
            raise models.ValidationError("Weight must be between 20 and 200 kg.")
        super().clean()  # Call parent clean() method

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies and gunicorn
RUN apt-get update && apt-get install -y build-essential \
    && pip install --no-cache-dir gunicorn \
    && rm -rf /var/lib/apt/lists/*

# Install project dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose Django port
EXPOSE 8000

# Start the app
# Ensure 'Nutrition_Analyzing_Website' matches the folder name where settings.py and wsgi.py live
CMD ["sh", "-c", "python manage.py makemigrations accounts && python manage.py migrate && gunicorn --bind 0.0.0.0:8000 Nutrition_Analyzing_Website.wsgi:application"]

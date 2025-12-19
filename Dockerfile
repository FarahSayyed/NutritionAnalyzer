FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your project code
COPY . .

# Expose the port Django runs on
EXPOSE 8000

# Start the application using gunicorn
# Note: Replace 'Nutrition_Analyzing_Website' if your wsgi.py is in a different folder
CMD ["gunicorn", "Nutrition_Analyzing_Website.wsgi:application", "--bind", "0.0.0.0:8000"]

# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Python script and any necessary files
COPY script.py ./

# Install any Python dependencies if required
# RUN pip install -r requirements.txt

# Set the command to run the Python script
CMD ["python3", "script.py"]

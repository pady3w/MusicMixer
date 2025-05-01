FROM python:3.10-slim

# Install system packages
RUN apt-get update && apt-get install -y ffmpeg git build-essential && apt-get clean

# Set working dir
WORKDIR /app

# Clone Audiocraft
RUN git clone https://github.com/facebookresearch/audiocraft.git
WORKDIR /app/audiocraft
RUN pip install -e .

# Flask for serving requests
RUN pip install flask boto3 torch flask-cors

# Back to /app and copy the Flask app
WORKDIR /app
COPY app.py /app/app.py

COPY download_weights.py /app/download_weights.py

# Expose the port Flask listens on
EXPOSE 8080

# Run the server
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]

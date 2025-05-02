# MusicGen Container

A Docker container for generating music using AI based on text prompts.

## EC2 Summary

- I have setup a server in AWS that can be turned on and off as needed to handle the compute needed for fast generation

## Prerequisites to run locally

- Docker installed (with NVIDIA Container Toolkit if you want GPU acceleration)
- NVIDIA GPU on your machine (recommended for faster generation, otherwise the app falls back to the CPU)
- Access to a `.env` file
- AWS credentials (configured within the environment variable file)

## Setup Instructions

### NVIDIA Driver Setup Locally (Optional for GPU acceleration)

- Download the latest GPU drivers for your machine: https://www.nvidia.com/en-us/drivers/

### Environment Configuration

Create a `.env` file in the project root with the following variables:
- `AWS_ACCESS_KEY_ID=your_access_key`
- `AWS_SECRET_ACCESS_KEY=your_secret_key`
- `[Add any other required environment variables here]`

## Development Workflow

1. Pull the latest code from the GitHub repo.
2. Edit `app.py` to make backend changes.
3. Rebuild the Docker image locally:
   ```bash
   docker build -t musicgen-dev .
   ```
4. Run the container with GPU support:
   ```bash
   docker run --gpus all --env-file .env -p 8080:8080 musicgen-dev
   ```
   *Note: If you don't have an NVIDIA GPU or the NVIDIA Container Toolkit installed, remove the `--gpus all` flag to run using the CPU.*

## Deployment to Amazon ECR
**Important:** The target EC2 GPU instance for deployment has already been set up. You only need to push the updated Docker image to ECR and pull it onto the existing instance.

Push your image to Amazon ECR:
```bash
# Authenticate Docker to your ECR registry
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 257394461261.dkr.ecr.us-east-2.amazonaws.com

# Tag your local image with the ECR repository URI
docker tag musicgen-dev 257394461261.dkr.ecr.us-east-2.amazonaws.com/capstone:latest

# Push the tagged image to ECR
docker push 257394461261.dkr.ecr.us-east-2.amazonaws.com/capstone:latest
```

Pull the latest version of the container from ECR (e.g., on a deployment server):
```bash
docker pull 257394461261.dkr.ecr.us-east-2.amazonaws.com/capstone:latest
```

## Testing the API

### Local testing:
Use `curl` or a similar tool to send a POST request to the running container:
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"lofi hip hop"}'
```

### Remote testing (after deployment):
Replace `<EC2-public-IP>` with the actual public IP address of your EC2 instance or wherever the container is deployed:
```bash
curl -X POST http://<EC2-public-IP>:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"lofi hip hop"}'
```

## Frontend/Backend Integration

The backend currently forwards music generation requests to a Flask server. During local development, the Flask server runs on:
http://localhost:5001/generate


In production, the Flask server is deployed on an **EC2 instance**, and traffic should be sent to:
http://<EC2-public-IP>:8080/generate

So currently in the server.js you have:
const response = await axios.post('http://localhost:5001/generate', { prompt }, { responseType: 'arraybuffer' });

Replace that with:
const response = await axios.post('http://<EC2-public-IP>:8080/generate', { prompt }, { responseType: 'arraybuffer' });
 - the instance IP address can be found following these steps:
-Navigate EC2
-Click Instances
-Click the instance ID of the capstone instance when it is running and the IP should be there
-after running stop the instance, do not terminate stop it instead


import os
import json
import boto3
import time

# AWS S3 Config
s3_bucket = "our-bucket-name"  # Using the bucket name from your metadata
s3_client = boto3.client("s3")

# Local paths
base_dir = "/mnt/c/Documents/Capstone/"
separated_audio_dir = os.path.join(base_dir, "separated_audio")
metadata_file = os.path.join(base_dir, "metadata.json")

def upload_file(file_path, s3_key):
    """Uploads a file to S3 with retries."""
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            s3_client.upload_file(file_path, s3_bucket, s3_key)
            print(f"Uploaded: {file_path} → s3://{s3_bucket}/{s3_key}")
            return True
        except Exception as e:
            print(f"Attempt {attempt+1}/{max_retries} failed for {file_path}: {e}")
            if attempt < max_retries - 1:
                print(f"   Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                print(f"Failed to upload {file_path} after {max_retries} attempts")
                return False

def upload_dataset():
    """Uploads all audio chunks and metadata to S3."""
    
    if not os.path.exists(metadata_file):
        print("metadata.json not found! Run dataset preparation first.")
        return
    
    # Load dataset
    with open(metadata_file, "r") as f:
        dataset = json.load(f)

    print(f"Uploading {len(dataset)} song chunks to S3...")
    
    # Track progress
    total_files = len(dataset)
    uploaded_count = 0
    failed_count = 0
    already_uploaded = []
    
    for idx, entry in enumerate(dataset):
        # Get S3 path from metadata (already contains the correct path structure)
        if "self_wav" in entry:
            s3_path = entry["self_wav"]
            s3_key = s3_path.replace(f"s3://{s3_bucket}/", "")
            
            # Get local path
            audio_file = s3_key.split("/")[-1]
            local_audio_path = os.path.join(separated_audio_dir, audio_file)
            
            # Skip if already uploaded in this session
            if s3_key in already_uploaded:
                print(f"⏭️ Skipping duplicate: {s3_key}")
                continue
                
            # Check if file exists before uploading
            if os.path.exists(local_audio_path):
                progress = f"[{idx+1}/{total_files}]"
                print(f"{progress} Uploading: {local_audio_path}")
                
                if upload_file(local_audio_path, s3_key):
                    uploaded_count += 1
                    already_uploaded.append(s3_key)
                else:
                    failed_count += 1
            else:
                print(f"Skipping: {local_audio_path} not found")
                failed_count += 1
                
            # Update progress every 25 files
            if (idx + 1) % 25 == 0:
                print(f"Progress: {uploaded_count} uploaded, {failed_count} failed, {idx+1}/{total_files} processed")

    # Upload metadata file to S3
    # Upload metadata file to S3
    metadata_s3_key = "metadata/metadata.json"  # Keep the original filename
    upload_file(metadata_file, metadata_s3_key)
    
    # Generate a cleaner metadata file without file paths for training
    training_metadata = []
    for entry in dataset:
        # Copy entry without changing the original
        clean_entry = dict(entry)
        
        # Include only necessary fields
        keep_fields = ["title", "artist", "duration", "self_wav", "prompt"]
        clean_entry = {k: v for k, v in clean_entry.items() if k in keep_fields}
        
        training_metadata.append(clean_entry)
    
    # Save training metadata locally
    training_metadata_file = os.path.join(base_dir, "training_metadata.json")
    with open(training_metadata_file, "w") as f:
        json.dump(training_metadata, f, indent=4)
        
    # Upload training metadata to S3
    upload_file(training_metadata_file, "metadata/training_metadata.json")

    print("\nUpload Summary")
    print(f"Successfully uploaded: {uploaded_count} files")
    print(f"Failed to upload: {failed_count} files")
    print(f"Metadata files uploaded to S3")
    print("Dataset upload completed!")

if __name__ == "__main__":
    upload_dataset()
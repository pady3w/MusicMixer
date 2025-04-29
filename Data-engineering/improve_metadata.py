import os
import json
import boto3

# AWS S3 Config
s3_bucket = "our-s3-bucket"
s3_client = boto3.client("s3")

# Local paths
base_dir = "/mnt/c/Documents/Capstone/"
metadata_file = os.path.join(base_dir, "metadata.json")
enhanced_metadata_file = os.path.join(base_dir, "enhanced_training_metadata.json")

def upload_file(file_path, s3_key):
    """Uploads a file to S3."""
    try:
        s3_client.upload_file(file_path, s3_bucket, s3_key)
        print(f"Uploaded: {file_path} → s3://{s3_bucket}/{s3_key}")
        return True
    except Exception as e:
        print(f"Failed to upload {file_path}: {e}")
        return False

def create_enhanced_metadata():
    """Creates enhanced metadata with all necessary fields for training."""
    # Load existing full metadata
    with open(metadata_file, "r") as f:
        full_metadata = json.load(f)
    
    print(f"Loaded {len(full_metadata)} entries from metadata.json")
    
    # Create enhanced metadata for training
    enhanced_metadata = []
    
    for entry in full_metadata:
        # Include all important fields for training
        training_entry = {}
        
        # Essential fields
        training_entry["title"] = entry.get("title", "")
        training_entry["artist"] = entry.get("artist", "")
        training_entry["duration"] = entry.get("duration", "30")
        training_entry["self_wav"] = entry.get("self_wav", "")
        training_entry["genre"] = entry.get("genre", "")
        training_entry["bpm"] = entry.get("bpm", 0)
        training_entry["key"] = entry.get("key", "")
        training_entry["scale"] = entry.get("scale", "")
        
        # Rename moods to mood for MusicGen compatibility
        if "moods" in entry:
            training_entry["mood"] = entry["moods"]
        else:
            training_entry["mood"] = []
            
        # Other essential fields
        training_entry["keywords"] = entry.get("keywords", [])
        training_entry["instruments"] = entry.get("instruments", [])
        
        # Important field for MusicGen training
        training_entry["prompt"] = entry.get("prompt", "")
        
        enhanced_metadata.append(training_entry)
    
    # Save the enhanced metadata
    with open(enhanced_metadata_file, "w") as f:
        json.dump(enhanced_metadata, f, indent=4)
    
    print(f"Created enhanced training metadata with {len(enhanced_metadata)} entries")
    
    # Upload to S3
    upload_file(enhanced_metadata_file, "metadata/training_metadata.json")
    print(f"Uploaded enhanced metadata to S3")

if __name__ == "__main__":
    create_enhanced_metadata()
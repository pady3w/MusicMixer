import boto3
import os
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
bucket_name = os.getenv("BUCKET_NAME_MODEL", "NEW_MODEL_BUCKET")
object_key = os.getenv("OBJECT_KEY" , "checkpoint.th")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
download_path = os.path.join(BASE_DIR, "model_weights", "checkpoint.th")

def ensure_model_exists():
    try:
        s3.head_object(Bucket=bucket_name, Key=object_key)
        print(f"Model file '{object_key}' exists in S3.")
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            print(f"Model file '{object_key}' does not exist in S3.")
            return False
        else:
            raise e

def download_model_weights():
    if ensure_model_exists():
        try:
            os.makedirs(os.path.dirname(download_path), exist_ok=True)
            s3.download_file(bucket_name, object_key, download_path)
            print(f"Model weights downloaded to {download_path}")
        except Exception as e:
            print(f"Error downloading model weights: {e}")
    else:
        print("Cannot download: model weights do not exist in S3.")

if __name__ == "__main__":
    download_model_weights()

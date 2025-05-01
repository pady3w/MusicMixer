# This script is responsible for uploading songs to drive to be processed using a google colab
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request


SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def upload_file(filepath, service, drive_folder_id=None):
    file_metadata = {'name': os.path.basename(filepath)}
    if drive_folder_id:
        file_metadata['parents'] = [drive_folder_id]

    media = MediaFileUpload(filepath, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"✅ Uploaded: {os.path.basename(filepath)} | Drive ID: {file.get('id')}")

def upload_directory(directory_path, drive_folder_id=None):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".wav"):
                full_path = os.path.join(root, file)
                upload_file(full_path, service, drive_folder_id)

upload_directory("separated_audio", drive_folder_id="1h08H--pDuN6ZwWlSPEQbUDqx6vayP2GN")

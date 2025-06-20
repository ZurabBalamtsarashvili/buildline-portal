from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from fastapi import HTTPException, UploadFile
import os
import io
import pickle
from typing import Optional
from ..config import Config

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive.file']

class GoogleDriveService:
    _instance = None
    _credentials = None
    _service = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GoogleDriveService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        # Don't initialize credentials and service in __init__
        pass

    def _initialize(self):
        """Initialize credentials and service only when needed"""
        if not self._credentials:
            self._credentials = self._get_credentials()
        if not self._service:
            self._service = build('drive', 'v3', credentials=self._credentials)

    def _get_credentials(self) -> Credentials:
        """Gets valid user credentials from storage or initiates OAuth2 flow."""
        creds = None
        
        # The file token.pickle stores the user's access and refresh tokens
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)

        # If there are no (valid) credentials available, initiate OAuth2 flow
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_config(
                    {
                        "installed": {
                            "client_id": Config.GOOGLE_CLIENT_ID,
                            "client_secret": Config.GOOGLE_CLIENT_SECRET,
                            "project_id": "buildline-portal-uploads-api",
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            "token_uri": "https://oauth2.googleapis.com/token",
                            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                            "redirect_uris": ["http://localhost"]
                        }
                    },
                    SCOPES
                )
                creds = flow.run_local_server(port=0)

            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        return creds

    async def upload_file(
        self,
        file: UploadFile,
        folder_path: str,
        mime_type: Optional[str] = None
    ) -> str:
        """
        Upload a file to Google Drive and return the file ID
        """
        try:
            self._initialize()  # Initialize only when needed
            
            # Create folder structure if it doesn't exist
            folder_id = await self._get_or_create_folder_path(folder_path)

            # Prepare file metadata
            file_metadata = {
                'name': file.filename,
                'parents': [folder_id]
            }

            # Read file content
            content = await file.read()
            media = MediaIoBaseUpload(
                io.BytesIO(content),
                mimetype=mime_type or file.content_type,
                resumable=True
            )

            # Upload file
            uploaded_file = self._service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()

            return uploaded_file.get('id')

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file to Google Drive: {str(e)}"
            )

    async def delete_file(self, file_id: str):
        """
        Delete a file from Google Drive
        """
        try:
            self._initialize()  # Initialize only when needed
            self._service.files().delete(fileId=file_id).execute()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file from Google Drive: {str(e)}"
            )

    async def _get_or_create_folder_path(self, folder_path: str) -> str:
        """
        Get or create a folder path in Google Drive
        Returns the ID of the deepest folder
        """
        current_parent = Config.GOOGLE_DRIVE_FOLDER_ID
        
        # Split path and process each folder
        for folder_name in folder_path.strip('/').split('/'):
            if not folder_name:
                continue

            # Search for existing folder
            query = f"name='{folder_name}' and '{current_parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
            results = self._service.files().list(
                q=query,
                spaces='drive',
                fields='files(id, name)'
            ).execute()

            # Create folder if it doesn't exist
            if not results['files']:
                folder_metadata = {
                    'name': folder_name,
                    'mimeType': 'application/vnd.google-apps.folder',
                    'parents': [current_parent]
                }
                folder = self._service.files().create(
                    body=folder_metadata,
                    fields='id'
                ).execute()
                current_parent = folder.get('id')
            else:
                current_parent = results['files'][0]['id']

        return current_parent

# Create singleton instance
drive_service = GoogleDriveService()

# Utility functions for other modules to use
async def upload_to_drive(file: UploadFile, folder_path: str) -> str:
    """
    Upload a file to Google Drive
    Returns the file ID
    """
    return await drive_service.upload_file(file, folder_path)

async def delete_from_drive(file_id: str):
    """
    Delete a file from Google Drive
    """
    await drive_service.delete_file(file_id)

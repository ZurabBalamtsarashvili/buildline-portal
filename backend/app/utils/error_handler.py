from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import logging
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIError(HTTPException):
    """
    Custom API Error class that extends FastAPI's HTTPException
    Adds support for error codes, additional details, and logging
    """
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        additional_info: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.additional_info = additional_info or {}
        self._log_error()

    def _log_error(self):
        """Log error details"""
        logger.error(
            f"API Error: {self.error_code or 'NO_CODE'} - {self.detail}",
            extra={
                "status_code": self.status_code,
                "error_code": self.error_code,
                "additional_info": self.additional_info,
                "timestamp": datetime.utcnow().isoformat()
            }
        )

class ErrorCodes:
    """
    Enumeration of error codes used in the application
    """
    # Authentication Errors (1xxx)
    INVALID_CREDENTIALS = "ERR_1001"
    TOKEN_EXPIRED = "ERR_1002"
    INVALID_TOKEN = "ERR_1003"
    INSUFFICIENT_PERMISSIONS = "ERR_1004"

    # Resource Errors (2xxx)
    RESOURCE_NOT_FOUND = "ERR_2001"
    RESOURCE_EXISTS = "ERR_2002"
    RESOURCE_LOCKED = "ERR_2003"
    INVALID_RESOURCE_STATE = "ERR_2004"

    # Validation Errors (3xxx)
    INVALID_INPUT = "ERR_3001"
    MISSING_REQUIRED_FIELD = "ERR_3002"
    INVALID_FORMAT = "ERR_3003"
    INVALID_REFERENCE = "ERR_3004"

    # File Operation Errors (4xxx)
    FILE_UPLOAD_FAILED = "ERR_4001"
    FILE_DELETE_FAILED = "ERR_4002"
    FILE_TOO_LARGE = "ERR_4003"
    INVALID_FILE_TYPE = "ERR_4004"

    # External Service Errors (5xxx)
    GOOGLE_DRIVE_ERROR = "ERR_5001"
    EMAIL_SERVICE_ERROR = "ERR_5002"
    DATABASE_ERROR = "ERR_5003"
    EXTERNAL_API_ERROR = "ERR_5004"

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Handle HTTPException and return standardized error response
    """
    error_response = {
        "status": "error",
        "detail": exc.detail,
        "status_code": exc.status_code
    }

    if isinstance(exc, APIError):
        error_response.update({
            "error_code": exc.error_code,
            "additional_info": exc.additional_info
        })

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response
    )

async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle unhandled exceptions and return standardized error response
    """
    # Log the full exception traceback
    logger.error(
        "Unhandled exception occurred",
        extra={
            "path": request.url.path,
            "method": request.method,
            "traceback": traceback.format_exc(),
            "timestamp": datetime.utcnow().isoformat()
        }
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "detail": "An unexpected error occurred",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "error_code": "ERR_9999"
        }
    )

# Common error raising functions
def raise_not_found(
    resource_type: str,
    resource_id: Any,
    additional_info: Optional[Dict[str, Any]] = None
):
    """Raise a not found error"""
    raise APIError(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{resource_type} with id {resource_id} not found",
        error_code=ErrorCodes.RESOURCE_NOT_FOUND,
        additional_info=additional_info
    )

def raise_permission_error(
    action: str,
    resource_type: str,
    additional_info: Optional[Dict[str, Any]] = None
):
    """Raise a permission error"""
    raise APIError(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=f"Not enough permissions to {action} {resource_type}",
        error_code=ErrorCodes.INSUFFICIENT_PERMISSIONS,
        additional_info=additional_info
    )

def raise_validation_error(
    field: str,
    reason: str,
    additional_info: Optional[Dict[str, Any]] = None
):
    """Raise a validation error"""
    raise APIError(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Validation error for field '{field}': {reason}",
        error_code=ErrorCodes.INVALID_INPUT,
        additional_info=additional_info
    )

def raise_file_error(
    error_type: str,
    filename: str,
    additional_info: Optional[Dict[str, Any]] = None
):
    """Raise a file operation error"""
    error_codes = {
        "upload": ErrorCodes.FILE_UPLOAD_FAILED,
        "delete": ErrorCodes.FILE_DELETE_FAILED,
        "size": ErrorCodes.FILE_TOO_LARGE,
        "type": ErrorCodes.INVALID_FILE_TYPE
    }
    
    error_messages = {
        "upload": f"Failed to upload file: {filename}",
        "delete": f"Failed to delete file: {filename}",
        "size": f"File too large: {filename}",
        "type": f"Invalid file type: {filename}"
    }

    raise APIError(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=error_messages.get(error_type, f"File operation failed: {filename}"),
        error_code=error_codes.get(error_type, ErrorCodes.FILE_UPLOAD_FAILED),
        additional_info=additional_info
    )

def raise_external_service_error(
    service: str,
    operation: str,
    additional_info: Optional[Dict[str, Any]] = None
):
    """Raise an external service error"""
    error_codes = {
        "google_drive": ErrorCodes.GOOGLE_DRIVE_ERROR,
        "email": ErrorCodes.EMAIL_SERVICE_ERROR,
        "database": ErrorCodes.DATABASE_ERROR,
        "external_api": ErrorCodes.EXTERNAL_API_ERROR
    }

    raise APIError(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=f"{service} service error during {operation}",
        error_code=error_codes.get(service, ErrorCodes.EXTERNAL_API_ERROR),
        additional_info=additional_info
    )

from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
from ..routes.notifications import notification_manager
from ..config import Config

class NotificationType(Enum):
    PROJECT_CREATED = "project_created"
    PROJECT_UPDATED = "project_updated"
    PROJECT_DELETED = "project_deleted"
    EVENT_CREATED = "event_created"
    EVENT_UPDATED = "event_updated"
    EVENT_CANCELLED = "event_cancelled"
    FILE_UPLOADED = "file_uploaded"
    FILE_UPDATED = "file_updated"
    WIKI_CREATED = "wiki_created"
    WIKI_UPDATED = "wiki_updated"
    TASK_ASSIGNED = "task_assigned"
    TASK_COMPLETED = "task_completed"
    REMINDER = "reminder"
    SYSTEM = "system"

class NotificationPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class NotificationChannel(Enum):
    IN_APP = "in_app"
    EMAIL = "email"
    BOTH = "both"

async def send_notification(
    user_id: int,
    notification_type: NotificationType,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    channel: NotificationChannel = NotificationChannel.BOTH
) -> None:
    """
    Send a notification to a user through specified channels
    """
    notification = {
        "type": notification_type.value,
        "title": title,
        "message": message,
        "priority": priority.value,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data or {}
    }

    tasks = []

    # Send in-app notification
    if channel in [NotificationChannel.IN_APP, NotificationChannel.BOTH]:
        tasks.append(
            notification_manager.send_personal_notification(user_id, notification)
        )

    # Send email notification
    if channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
        tasks.append(
            send_email_notification(user_id, title, message, notification_type)
        )

    # Execute all notification tasks concurrently
    await asyncio.gather(*tasks)

async def send_email_notification(
    user_id: int,
    subject: str,
    message: str,
    notification_type: NotificationType
) -> None:
    """
    Send an email notification
    """
    # TODO: Implement email sending logic
    # This is a placeholder for email sending functionality
    # In production, you would:
    # 1. Get user's email from database
    # 2. Use SMTP or email service (like SendGrid) to send the email
    pass

async def send_bulk_notification(
    user_ids: list[int],
    notification_type: NotificationType,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None,
    priority: NotificationPriority = NotificationPriority.MEDIUM,
    channel: NotificationChannel = NotificationChannel.BOTH
) -> None:
    """
    Send notifications to multiple users
    """
    tasks = [
        send_notification(
            user_id,
            notification_type,
            title,
            message,
            data,
            priority,
            channel
        )
        for user_id in user_ids
    ]
    await asyncio.gather(*tasks)

# Specific notification functions for different events

async def notify_project_update(
    project_id: int,
    user_ids: list[int],
    update_type: str,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> None:
    """
    Notify users about project updates
    """
    notification_type = getattr(
        NotificationType,
        f"PROJECT_{update_type.upper()}",
        NotificationType.SYSTEM
    )
    
    await send_bulk_notification(
        user_ids,
        notification_type,
        title,
        message,
        data={
            "project_id": project_id,
            "update_type": update_type,
            **(data or {})
        }
    )

async def notify_event_update(
    event_id: int,
    user_ids: list[int],
    update_type: str,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> None:
    """
    Notify users about event updates
    """
    notification_type = getattr(
        NotificationType,
        f"EVENT_{update_type.upper()}",
        NotificationType.SYSTEM
    )
    
    await send_bulk_notification(
        user_ids,
        notification_type,
        title,
        message,
        data={
            "event_id": event_id,
            "update_type": update_type,
            **(data or {})
        }
    )

async def notify_file_upload(
    project_id: int,
    file_id: int,
    user_ids: list[int],
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> None:
    """
    Notify users about file uploads
    """
    await send_bulk_notification(
        user_ids,
        NotificationType.FILE_UPLOADED,
        title,
        message,
        data={
            "project_id": project_id,
            "file_id": file_id,
            **(data or {})
        }
    )

async def send_reminder(
    user_id: int,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> None:
    """
    Send a reminder notification
    """
    await send_notification(
        user_id,
        NotificationType.REMINDER,
        title,
        message,
        data,
        priority=NotificationPriority.HIGH,
        channel=NotificationChannel.BOTH
    )

# Template messages for common notifications
NOTIFICATION_TEMPLATES = {
    "project_created": {
        "title": "New Project Created",
        "message": "Project '{project_name}' has been created and assigned to you."
    },
    "event_reminder": {
        "title": "Event Reminder",
        "message": "Reminder: '{event_title}' starts in {time_until} minutes."
    },
    "file_uploaded": {
        "title": "New File Uploaded",
        "message": "A new file '{filename}' has been uploaded to project '{project_name}'."
    },
    "task_assigned": {
        "title": "New Task Assigned",
        "message": "You have been assigned a new task: '{task_name}' in project '{project_name}'."
    }
}

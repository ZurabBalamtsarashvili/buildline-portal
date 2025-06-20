from pydantic import BaseModel, constr
from typing import Optional, List, Dict, Any
from datetime import datetime

class EventReminderBase(BaseModel):
    remind_at: datetime
    notification_type: str = "both"  # email, in-app, or both

class EventReminderCreate(EventReminderBase):
    event_id: int
    user_id: int

class EventReminderResponse(EventReminderBase):
    id: int
    event_id: int
    user_id: int
    notification_sent: bool
    created_at: datetime

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: constr(min_length=1, max_length=255)
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    is_all_day: bool = False
    project_id: Optional[int] = None

class EventCreate(EventBase):
    attendee_ids: List[int] = []
    reminders: List[EventReminderBase] = []

class EventUpdate(EventBase):
    attendee_ids: Optional[List[int]] = None
    reminders: Optional[List[EventReminderBase]] = None

class EventResponse(EventBase):
    id: int
    creator_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    attendees: List[Dict[str, Any]] = []  # List of user details as dictionaries
    reminders: List[EventReminderResponse] = []

    class Config:
        from_attributes = True

class EventDetailResponse(EventResponse):
    creator: Dict[str, Any]  # User details as dictionary
    project: Optional[Dict[str, Any]] = None  # Project details as dictionary

    class Config:
        from_attributes = True

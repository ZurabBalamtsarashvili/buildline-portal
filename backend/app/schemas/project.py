from pydantic import BaseModel, constr
from typing import Optional, List
from datetime import datetime
from .user import UserResponse

class TimelineItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    progress: Optional[int] = 0
    dependencies: Optional[str] = None

class TimelineItemCreate(TimelineItemBase):
    project_id: int

class TimelineItemResponse(TimelineItemBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class ProjectFileBase(BaseModel):
    filename: str
    file_type: str
    version: str
    is_approved: bool = False

class ProjectFileCreate(ProjectFileBase):
    project_id: int

class ProjectFileResponse(ProjectFileBase):
    id: int
    project_id: int
    drive_file_id: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: constr(min_length=1, max_length=255)
    description: Optional[str] = None
    status: str
    construction_stage: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    customer_id: int
    team_member_ids: List[int] = []

class ProjectUpdate(ProjectBase):
    customer_id: Optional[int] = None
    team_member_ids: Optional[List[int]] = None

class ProjectResponse(ProjectBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    files: List[ProjectFileResponse] = []
    timeline_items: List[TimelineItemResponse] = []

    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    customer: UserResponse
    team_members: List[UserResponse]

    class Config:
        from_attributes = True

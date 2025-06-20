from pydantic import BaseModel, constr
from typing import Optional, List, Dict, Any
from datetime import datetime

class WikiFileBase(BaseModel):
    filename: str
    file_type: str
    file_size: int

class WikiFileCreate(WikiFileBase):
    drive_file_id: str

class WikiFileResponse(WikiFileBase):
    id: int
    drive_file_id: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class WikiRevisionBase(BaseModel):
    content: str
    comment: Optional[str] = None

class WikiRevisionCreate(WikiRevisionBase):
    wiki_page_id: int

class WikiRevisionResponse(WikiRevisionBase):
    id: int
    wiki_page_id: int
    author_id: int
    created_at: datetime
    revision_number: int

    class Config:
        from_attributes = True

class WikiPageBase(BaseModel):
    title: constr(min_length=1, max_length=255)
    content: str
    parent_id: Optional[int] = None

class WikiPageCreate(WikiPageBase):
    pass

class WikiPageUpdate(WikiPageBase):
    revision_comment: Optional[str] = None

class WikiPageResponse(WikiPageBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    attachments: List[WikiFileResponse] = []
    revision_count: int = 0

    class Config:
        from_attributes = True

class WikiPageDetailResponse(WikiPageResponse):
    children: List['WikiPageResponse'] = []
    revisions: List[WikiRevisionResponse] = []
    author: Dict[str, Any]  # Dictionary containing user details

    class Config:
        from_attributes = True

# Update forward references
WikiPageDetailResponse.update_forward_refs()

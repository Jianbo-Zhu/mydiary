from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    content: str
    due_time: Optional[datetime] = None
    contact_id: Optional[int] = None
    priority: int = 3
    repeat_rule: str = 'none'  # none/daily/weekly/monthly/yearly

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    content: Optional[str] = None
    due_time: Optional[datetime] = None
    contact_id: Optional[int] = None
    is_completed: Optional[bool] = None
    priority: Optional[int] = None
    repeat_rule: Optional[str] = None

class TodoResponse(TodoBase):
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

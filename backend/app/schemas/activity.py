from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# 基础活动模型
class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: Optional[str] = None
    location: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    reminder_time: Optional[datetime] = None
    tags: Optional[List[str]] = None

# 创建活动的请求模型
class ActivityCreate(ActivityBase):
    contact_id: Optional[int] = None

# 更新活动的请求模型
class ActivityUpdate(ActivityBase):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    contact_id: Optional[int] = None

# 响应的活动模型
class ActivityResponse(ActivityBase):
    id: int
    user_id: int
    contact_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True 
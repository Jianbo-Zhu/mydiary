from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .contact import ContactResponse

# 基础日志模型
class DiaryBase(BaseModel):
    content: str
    happened_at: datetime
    tags: Optional[List[str]] = None
    location: Optional[str] = None
    event_type: Optional[str] = None

# 创建日志的请求模型
class DiaryCreate(DiaryBase):
    contact_ids: Optional[List[int]] = None

# 更新日志的请求模型
class DiaryUpdate(DiaryBase):
    content: Optional[str] = None
    contact_ids: Optional[List[int]] = None

# 响应的日志模型
class DiaryResponse(DiaryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    contacts: Optional[List[ContactResponse]] = None
    
    class Config:
        orm_mode = True
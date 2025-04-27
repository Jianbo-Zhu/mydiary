from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# 基础日记模型
class DiaryBase(BaseModel):
    content: str
    tags: Optional[List[str]] = None
    location: Optional[str] = None
    event_type: Optional[str] = None

# 创建日记的请求模型
class DiaryCreate(DiaryBase):
    pass

# 更新日记的请求模型
class DiaryUpdate(DiaryBase):
    content: Optional[str] = None

# 响应的日记模型
class DiaryResponse(DiaryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True 
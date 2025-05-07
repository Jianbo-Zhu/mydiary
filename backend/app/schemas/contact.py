from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

# 基础联系人模型
class ContactBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    birthday: Optional[date] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    address: Optional[str] = None  # 新增地址字段
    company: Optional[str] = None  # 新增单位字段
    relation_to_me: Optional[str] = None  # 跟“我”的关系类型

# 创建联系人的请求模型
class ContactCreate(ContactBase):
    pass

# 更新联系人的请求模型
class ContactUpdate(ContactBase):
    name: Optional[str] = None

# 响应的联系人模型
class ContactResponse(ContactBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
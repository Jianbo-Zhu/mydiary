from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# 基础用户模型
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# 创建用户时的请求模型
class UserCreate(UserBase):
    provider: str  # "google" 或 "github"
    provider_id: str  # 第三方平台的用户ID

# 第三方登录请求模型
class OAuthLogin(BaseModel):
    provider: str
    token: str

# 响应的用户模型
class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Token响应模型
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse 
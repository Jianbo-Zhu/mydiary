from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# 基础用户模型
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

# 邮箱注册请求模型
class EmailRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

# 邮箱登录请求模型
class EmailLogin(BaseModel):
    email: EmailStr
    password: str

# 创建用户时的请求模型
class UserCreate(UserBase):
    provider: str  # "email", "google" 或 "github"
    provider_id: Optional[str] = None  # 第三方平台的用户ID，邮箱登录可以为空
    password: Optional[str] = None  # 密码，社交登录可以为空

# 第三方登录请求模型
class OAuthLogin(BaseModel):
    provider: str
    token: str

# 激活账号请求模型
class ActivateAccount(BaseModel):
    token: str

# 响应的用户模型
class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Token响应模型
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse 
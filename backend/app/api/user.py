from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta, datetime
import secrets

from app.core.config import settings
from app.core.auth import create_access_token, get_current_user
from app.core.email import send_activation_email
from app.models.base import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, OAuthLogin, Token, EmailRegister, EmailLogin, ActivateAccount

router = APIRouter()

# 获取当前登录用户信息
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=UserResponse)
def register_user(user: EmailRegister, db: Session = Depends(get_db)):
    # 检查邮箱是否已存在
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 生成激活令牌
    activation_token = secrets.token_urlsafe(32)
    
    # 创建新用户
    db_user = User(
        email=user.email,
        name=user.name,
        password=User.get_password_hash(user.password),
        provider="",
        is_active=False,
        activation_token=activation_token
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 发送激活邮件
    activation_link = f"{settings.FRONTEND_URL}/auth/activate?token={activation_token}"
    send_activation_email(user.email, activation_link)
    
    return db_user

@router.post("/activate", response_model=UserResponse)
def activate_account(activate: ActivateAccount, db: Session = Depends(get_db)):
    # 查找用户
    db_user = db.query(User).filter(User.activation_token == activate.token).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid activation token"
        )
    
    # 检查令牌是否过期
    if db_user.created_at + timedelta(minutes=settings.ACTIVATION_TOKEN_EXPIRE_MINUTES) < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activation token expired"
        )
    
    # 激活用户
    db_user.is_active = True
    db_user.activation_token = None
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=dict)
def login_user(user: EmailLogin, db: Session = Depends(get_db)):
    # 查找用户
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # 验证密码
    if not db_user.verify_password(user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # 检查用户是否已激活
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account not activated"
        )
    
    # 生成访问令牌
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user.name,
        "email": db_user.email
    } 
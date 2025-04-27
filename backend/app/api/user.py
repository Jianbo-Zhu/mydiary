from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import timedelta

from app.core.config import settings
from app.core.auth import create_access_token, get_current_user, get_google_user_info, get_github_user_info
from app.models.base import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, OAuthLogin, Token

router = APIRouter()

# 获取当前登录用户信息
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# OAuth登录
@router.post("/oauth/login", response_model=Token)
async def oauth_login(login_data: OAuthLogin, db: Session = Depends(get_db)):
    try:
        if login_data.provider == "google":
            user_info = await get_google_user_info(login_data.token)
            email = user_info.get("email")
            provider_id = user_info.get("id")
            name = user_info.get("name")
        elif login_data.provider == "github":
            user_info = await get_github_user_info(login_data.token)
            email = user_info.get("email")
            provider_id = str(user_info.get("id"))
            name = user_info.get("name")
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="不支持的登录提供商"
            )
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="无法获取用户邮箱"
            )
        
        # 查找或创建用户
        user = db.query(User).filter(
            User.email == email,
            User.provider == login_data.provider
        ).first()
        
        if not user:
            user = User(
                email=email,
                name=name,
                provider=login_data.provider,
                provider_id=provider_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # 创建访问令牌
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"认证失败: {str(e)}"
        ) 
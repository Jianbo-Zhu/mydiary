from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import requests

from app.core.config import settings
from app.models.user import User
from app.models.base import get_db

# OAuth2 token URL，不实际使用，用于FastAPI的依赖注入
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/token")

# 创建JWT token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# 验证JWT token
def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

# 获取当前用户
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = verify_token(token, credentials_exception)
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

# 从Google获取用户信息
async def get_google_user_info(token: str) -> dict:
    response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {token}"}
    )
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无法验证Google凭据"
        )
    return response.json()

# 从GitHub获取用户信息
async def get_github_user_info(token: str) -> dict:
    response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {token}"}
    )
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无法验证GitHub凭据"
        )
    
    user_info = response.json()
    # 获取邮箱信息（如果公开）
    email_response = requests.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"token {token}"}
    )
    if email_response.status_code == 200:
        emails = email_response.json()
        primary_email = next((e for e in emails if e.get("primary")), None)
        if primary_email:
            user_info["email"] = primary_email.get("email")
    
    return user_info 
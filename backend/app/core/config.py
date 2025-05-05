import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # 基础配置
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ACTIVATION_TOKEN_EXPIRE_MINUTES: int = 1440  # 24小时
    
    # 数据库配置
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/mydiary?ssl_disabled=true"
    )
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # OAuth配置
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GITHUB_CLIENT_ID: Optional[str] = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: Optional[str] = os.getenv("GITHUB_CLIENT_SECRET", "")
    
    # 回调URL
    OAUTH_REDIRECT_URL: str = os.getenv("OAUTH_REDIRECT_URL", "http://localhost:3000/auth/callback")
    
    # 前端URL
    FRONTEND_URL: str = "http://localhost:3000"
    
    # 邮件配置 - 163邮箱
    SMTP_USER: str = os.getenv("SMTP_USER", "mouse0407@163.com")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "EFykXumtcnfxHzAm")  # 注意：使用授权码而非邮箱密码
    SMTP_SERVER: str = os.getenv("SMTP_SERVER","smtp.163.com")
    SMTP_PORT: int = os.getenv("SMTP_PORT", 465)  # 163邮箱推荐使用SSL加密的465端口
    SMTP_SSL: bool = os.getenv("SMTP_SSL", "True").lower() == "true"  # 启用SSL加密
    MAIL_FROM_NAME: str = "MyDiary应用"  # 发件人名称

    # MySQL SSL配置
    MYSQL_SSL_CA: str = os.getenv("MYSQL_SSL_CA", "")
    MYSQL_SSL_CERT: str = os.getenv("MYSQL_SSL_CERT", "")
    MYSQL_SSL_KEY: str = os.getenv("MYSQL_SSL_KEY", "")
    MYSQL_SSL_VERIFY: bool = os.getenv("MYSQL_SSL_VERIFY", "false").lower() == "true"

    class Config:
        env_file = ".env"

settings = Settings() 
from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from app.models.base import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)  # 可以为空，因为社交登录不需要密码
    provider = Column(String(50), nullable=False)  # 登录提供商: email, google, github
    provider_id = Column(String(255), nullable=True)  # 第三方认证ID，邮箱登录可以为空
    is_active = Column(Boolean, default=False)  # 用户是否已激活
    activation_token = Column(String(255), nullable=True)  # 激活令牌
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def verify_password(self, plain_password: str) -> bool:
        if not self.password:
            return False
        return pwd_context.verify(plain_password, self.password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password) 
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from app.core.config import settings
import os

# 从环境变量获取数据库URL，默认使用本地连接
DATABASE_URL = settings.DATABASE_URL

# SSL配置
connect_args = {}
# if settings.MYSQL_SSL_CA:
#     connect_args = {
#         "ssl_ca": settings.MYSQL_SSL_CA,
#         "ssl_cert": settings.MYSQL_SSL_CERT,
#         "ssl_key": settings.MYSQL_SSL_KEY,
#         "ssl_verify_cert": settings.MYSQL_SSL_VERIFY
#     }

# 创建SQLAlchemy引擎
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    poolclass=QueuePool,
    connect_args=connect_args
)

# 创建本地会话类
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

# 导入关联表
from app.models.diary import diary_contact_association

# 获取数据库会话工厂函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
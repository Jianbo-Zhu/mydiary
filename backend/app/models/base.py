from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os

# 从环境变量获取数据库URL，默认使用本地连接
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/mydiary")

# 创建SQLAlchemy引擎
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    poolclass=QueuePool
)

# 创建本地会话类
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基础模型类
Base = declarative_base()

# 获取数据库会话工厂函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
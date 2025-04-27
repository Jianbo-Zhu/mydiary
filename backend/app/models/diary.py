from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Diary(Base):
    __tablename__ = "diaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(JSON, nullable=True)  # 存储标签的JSON数组
    location = Column(String(255), nullable=True)  # 位置信息
    event_type = Column(String(50), nullable=True)  # 事件类型：工作、生活、娱乐等
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # 关联到用户
    user = relationship("User", backref="diaries") 
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    activity_type = Column(String(50), nullable=True)  # 活动类型：聚会、会议、约会等
    location = Column(String(255), nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    reminder_time = Column(DateTime, nullable=True)  # 提醒时间
    tags = Column(JSON, nullable=True)  # 存储标签的JSON数组
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # 关联到用户
    user = relationship("User", backref="activities")
    # 关联到联系人
    contact = relationship("Contact", back_populates="activities") 
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    birthday = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # 存储标签的JSON数组
    address = Column(String(255), nullable=True)  # 新增地址字段
    company = Column(String(255), nullable=True)  # 新增单位字段
    relation_to_me = Column(String(64), nullable=True)  # 跟“我”的关系类型
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # 关联到用户
    user = relationship("User", backref="contacts")
    # 关联到互动活动
    activities = relationship("Activity", back_populates="contact")
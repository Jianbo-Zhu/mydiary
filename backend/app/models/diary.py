from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func, Table
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

# 定义diary和contact的关联表
diary_contact_association = Table('diary_contact', Base.metadata,
    Column('diary_id', Integer, ForeignKey('diaries.id'), primary_key=True),
    Column('contact_id', Integer, ForeignKey('contacts.id'), primary_key=True)
)

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
    happened_at = Column(DateTime, nullable=False)  # 新增字段，事件实际发生时间

    # 关联到用户
    user = relationship("User", backref="diaries")
    # 新增与contact的关联
    contacts = relationship("Contact", secondary=diary_contact_association, backref="diaries")
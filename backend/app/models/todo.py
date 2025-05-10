from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, func
from app.models.base import Base

class Todo(Base):
    __tablename__ = 'todos'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    due_time = Column(DateTime, nullable=True)
    contact_id = Column(Integer, ForeignKey('contacts.id'), nullable=True)
    is_completed = Column(Boolean, default=False)
    priority = Column(Integer, default=3)  # 1-5，默认3
    repeat_rule = Column(String(16), default='none')  # none/daily/weekly/monthly/yearly
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

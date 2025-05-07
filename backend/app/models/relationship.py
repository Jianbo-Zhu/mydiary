from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from .base import Base

class Relationship(Base):
    __tablename__ = 'relationship'
    id = Column(Integer, primary_key=True, autoincrement=True)
    contact_id_1 = Column(Integer, ForeignKey('contact.id', ondelete='CASCADE'), nullable=False)
    contact_id_2 = Column(Integer, ForeignKey('contact.id', ondelete='CASCADE'), nullable=False)
    relation_type = Column(String(64), nullable=False)
    notes = Column(Text)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

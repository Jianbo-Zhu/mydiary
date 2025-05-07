from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from .base import Base

class RelationshipType(Base):
    __tablename__ = 'relationship_type'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    name = Column(String(64), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

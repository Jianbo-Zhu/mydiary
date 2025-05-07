from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RelationshipTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class RelationshipTypeCreate(RelationshipTypeBase):
    user_id: int
    pass

class RelationshipTypeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class RelationshipType(RelationshipTypeBase):
    id: int
    user_id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

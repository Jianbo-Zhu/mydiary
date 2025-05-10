from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RelationshipBase(BaseModel):
    user_id: int
    contact_id_1: int
    contact_id_2: int
    relation_type: str
    notes: Optional[str] = None

class RelationshipCreate(RelationshipBase):
    pass

class RelationshipUpdate(BaseModel):
    relation_type: Optional[str] = None
    notes: Optional[str] = None

class Relationship(RelationshipBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

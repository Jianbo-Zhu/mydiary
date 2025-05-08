from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.relationship_type import RelationshipType as RelationshipTypeModel
from app.schemas.relationship_type import RelationshipType, RelationshipTypeCreate, RelationshipTypeUpdate
from app.models.base import get_db
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["Relationship Types"])

@router.post("/", response_model=RelationshipType)
def create_relationship_type(rel_type: RelationshipTypeCreate, db: Session = Depends(get_db)):
    db_type = RelationshipTypeModel(**rel_type.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type

@router.get("/", response_model=List[RelationshipType])
def list_relationship_types(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(RelationshipTypeModel).filter(RelationshipTypeModel.user_id == current_user.id).all()

@router.put("/{type_id}", response_model=RelationshipType)
def update_relationship_type(type_id: int, rel_type: RelationshipTypeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_type = db.query(RelationshipTypeModel).filter(RelationshipTypeModel.id == type_id, RelationshipTypeModel.user_id == current_user.id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Relationship type not found")
    for k, v in rel_type.dict(exclude_unset=True).items():
        setattr(db_type, k, v)
    db.commit()
    db.refresh(db_type)
    return db_type

@router.delete("/{type_id}")
def delete_relationship_type(type_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_type = db.query(RelationshipTypeModel).filter(RelationshipTypeModel.id == type_id, RelationshipTypeModel.user_id == current_user.id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Relationship type not found")
    db.delete(db_type)
    db.commit()
    return {"success": True}

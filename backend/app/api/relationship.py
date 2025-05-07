from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.relationship import Relationship as RelationshipModel
from app.schemas.relationship import Relationship, RelationshipCreate, RelationshipUpdate
from app.models.base import get_db
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["relationship"])

@router.post("/", response_model=Relationship)
def create_relationship(rel: RelationshipCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_rel = RelationshipModel(**rel.dict())
    db_rel.user_id = current_user.id
    db.add(db_rel)
    db.commit()
    db.refresh(db_rel)
    return db_rel

@router.get("/", response_model=list[Relationship])
def list_relationships(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(RelationshipModel).filter(RelationshipModel.user_id == current_user.id).all()

@router.delete("/{rel_id}")
def delete_relationship(rel_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rel = db.query(RelationshipModel).filter(RelationshipModel.id == rel_id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    db.delete(rel)
    db.commit()
    return {"success": True}

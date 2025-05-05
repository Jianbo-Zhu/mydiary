from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.auth import get_current_user
from app.models.base import get_db
from app.models.user import User
from app.models.contact import Contact
from app.models.diary import Diary
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter()

# 创建联系人
@router.post("/", response_model=ContactResponse)
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = Contact(
        user_id=current_user.id,
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        birthday=contact.birthday,
        notes=contact.notes,
        tags=contact.tags,
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# 获取用户所有联系人
@router.get("/", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(Contact).filter(
        Contact.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return contacts

# 获取最近联系的联系人
@router.get("/recent", response_model=List[ContactResponse])
def get_recent_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(Contact).join(Contact.diaries).filter(
        Contact.user_id == current_user.id
    ).order_by(Diary.happened_at.desc()).limit(10).all()
    return contacts

# 获取单个联系人
@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="联系人不存在"
        )
    return contact

# 更新联系人
@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact_update: ContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="联系人不存在"
        )
    
    update_data = contact_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact

# 删除联系人
@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    if not db_contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="联系人不存在"
        )
    
    db.delete(db_contact)
    db.commit()
    return None 
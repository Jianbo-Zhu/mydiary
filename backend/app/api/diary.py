from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.auth import get_current_user
from app.models.base import get_db
from app.models.user import User
from app.models.diary import Diary, diary_contact_association
from app.schemas.diary import DiaryCreate, DiaryUpdate, DiaryResponse
from app.models.contact import Contact

router = APIRouter()

# 创建日志
@router.post("/", response_model=DiaryResponse)
def create_diary(
    diary: DiaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_diary = Diary(
        user_id=current_user.id,
        content=diary.content,
        tags=diary.tags,
        location=diary.location,
        event_type=diary.event_type,
        happened_at=diary.happened_at
    )
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    
    # 保存与mention的contact的关联关系
    if diary.contact_ids:
        contacts = db.query(Contact).filter(Contact.id.in_(diary.contact_ids), Contact.user_id == current_user.id).all()
        db_diary.contacts.extend(contacts)
        db.commit()
        db.refresh(db_diary)
    
    return db_diary

# 获取用户所有日志
@router.get("/", response_model=List[DiaryResponse])
def get_diaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    diaries = db.query(Diary).filter(
        Diary.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return diaries

# 获取单个日志
@router.get("/{diary_id}", response_model=DiaryResponse)
def get_diary(
    diary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    diary = db.query(Diary).filter(
        Diary.id == diary_id,
        Diary.user_id == current_user.id
    ).first()
    if not diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日志不存在"
        )
    return diary

# 更新日志
@router.put("/{diary_id}", response_model=DiaryResponse)
def update_diary(
    diary_id: int,
    diary_update: DiaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_diary = db.query(Diary).filter(
        Diary.id == diary_id,
        Diary.user_id == current_user.id
    ).first()
    if not db_diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日志不存在"
        )
    
    update_data = diary_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_diary, key, value)
    
    # 更新与mention的contact的关联关系
    if 'contact_ids' in update_data:
        # 删除原有的关联关系
        db.execute(diary_contact_association.delete().where(diary_contact_association.c.diary_id == diary_id))
        # 添加新的关联关系
        if diary_update.contact_ids:
            contacts = db.query(Contact).filter(Contact.id.in_(diary_update.contact_ids), Contact.user_id == current_user.id).all()
            db_diary.contacts.extend(contacts)
        db.commit()
        db.refresh(db_diary)
    
    return db_diary

# 删除日志
@router.delete("/{diary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_diary(
    diary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_diary = db.query(Diary).filter(
        Diary.id == diary_id,
        Diary.user_id == current_user.id
    ).first()
    if not db_diary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="日志不存在"
        )
    
    db.delete(db_diary)
    db.commit()
    return None
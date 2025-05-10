from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.todo import Todo as TodoModel
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from app.models.base import get_db
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_todo = TodoModel(
        user_id=current_user.id,
        content=todo.content,
        due_time=todo.due_time,
        contact_id=todo.contact_id,
        priority=todo.priority,
        repeat_rule=todo.repeat_rule
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.get("/", response_model=List[TodoResponse])
def list_todos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(TodoModel).filter(TodoModel.user_id == current_user.id).order_by(TodoModel.due_time.asc().nullslast(), TodoModel.priority.desc()).all()

@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    todo = db.query(TodoModel).filter(TodoModel.id == todo_id, TodoModel.user_id == current_user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id, TodoModel.user_id == current_user.id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    for k, v in todo_update.dict(exclude_unset=True).items():
        setattr(db_todo, k, v)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_todo = db.query(TodoModel).filter(TodoModel.id == todo_id, TodoModel.user_id == current_user.id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return None

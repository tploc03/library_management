from sqlalchemy.orm import Session, joinedload
from app.models import models
from app.schemas import schemas

def get_book(db: Session, book_id: str):
    return db.query(models.Sach).options(
        joinedload(models.Sach.TacGia),
        joinedload(models.Sach.TheLoai)
    ).filter(models.Sach.MaSach == book_id).first()

def get_books(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Sach).options(
        joinedload(models.Sach.TacGia),
        joinedload(models.Sach.TheLoai)
    ).offset(skip).limit(limit).all()

def create_book(db: Session, book: schemas.SachCreate):
    db_book = models.Sach(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def update_book(db: Session, book_id: str, book_update: schemas.SachUpdate):
    db_book = db.query(models.Sach).filter(models.Sach.MaSach == book_id).first()
    if not db_book:
        return None
    
    update_data = book_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_book, key, value)
        
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: str):
    db_book = db.query(models.Sach).filter(models.Sach.MaSach == book_id).first()
    if not db_book:
        return None
    db.delete(db_book)
    db.commit()
    return db_book

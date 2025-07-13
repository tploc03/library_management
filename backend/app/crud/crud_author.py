from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_author(db: Session, author_id: int):
    return db.query(models.TacGia).filter(models.TacGia.MaTacGia == author_id).first()

def get_authors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TacGia).offset(skip).limit(limit).all()

def create_author(db: Session, author: schemas.TacGiaCreate):
    db_author = models.TacGia(TenTacGia=author.TenTacGia)
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author

def update_author(db: Session, author_id: int, author_update: schemas.TacGiaUpdate):
    db_author = db.query(models.TacGia).filter(models.TacGia.MaTacGia == author_id).first()
    if not db_author:
        return None
    
    update_data = author_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_author, key, value)
        
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author

def delete_author(db: Session, author_id: int):
    db_author = db.query(models.TacGia).filter(models.TacGia.MaTacGia == author_id).first()
    if not db_author:
        return None
    db.delete(db_author)
    db.commit()
    return db_author

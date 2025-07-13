from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_genre(db: Session, genre_id: int):
    return db.query(models.TheLoai).filter(models.TheLoai.MaTheLoai == genre_id).first()

def get_genres(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TheLoai).offset(skip).limit(limit).all()

def create_genre(db: Session, genre: schemas.TheLoaiCreate):
    db_genre = models.TheLoai(TenTheLoai=genre.TenTheLoai)
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

def update_genre(db: Session, genre_id: int, genre_update: schemas.TheLoaiUpdate):
    db_genre = db.query(models.TheLoai).filter(models.TheLoai.MaTheLoai == genre_id).first()
    if not db_genre:
        return None
    
    update_data = genre_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_genre, key, value)
        
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

def delete_genre(db: Session, genre_id: int):
    db_genre = db.query(models.TheLoai).filter(models.TheLoai.MaTheLoai == genre_id).first()
    if not db_genre:
        return None
    db.delete(db_genre)
    db.commit()
    return db_genre
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas

def get_reader(db: Session, reader_id: int):
    return db.query(models.DocGia).filter(models.DocGia.MaDocGia == reader_id).first()

def get_readers(db: Session, skip: int = 0, limit: int = 100):
     return db.query(models.DocGia).offset(skip).limit(limit).all()

def create_reader(db: Session, reader: schemas.DocGiaCreate):
    db_reader = models.DocGia(**reader.model_dump())
    db.add(db_reader)
    db.commit()
    db.refresh(db_reader)
    return db_reader

def update_reader(db: Session, reader_id: int, reader_update: schemas.DocGiaUpdate):
    db_reader = get_reader(db, reader_id)
    if not db_reader:
        return None
    
    update_data = reader_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reader, key, value)
        
    db.add(db_reader)
    db.commit()
    db.refresh(db_reader)
    return db_reader

def delete_reader(db: Session, reader_id: int):
    db_reader = get_reader(db, reader_id)
    if not db_reader:
        return None
    db.delete(db_reader)
    db.commit()
    return db_reader

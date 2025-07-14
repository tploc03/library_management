from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_genre
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.TheLoai, summary="Tạo thể loại mới")
def create_genre_endpoint(genre: schemas.TheLoaiCreate, db: Session = Depends(get_db)):
    return crud_genre.create_genre(db=db, genre=genre)

@router.get("/", response_model=List[schemas.TheLoai], summary="Lấy danh sách thể loại")
def read_genres_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    genres = crud_genre.get_genres(db, skip=skip, limit=limit)
    return genres

@router.get("/{genre_id}", response_model=schemas.TheLoai, summary="Lấy thông tin một thể loại")
def read_genre_endpoint(genre_id: int, db: Session = Depends(get_db)):
    db_genre = crud_genre.get_genre(db, genre_id=genre_id)
    if db_genre is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại")
    return db_genre

@router.put("/{genre_id}", response_model=schemas.TheLoai, summary="Cập nhật thông tin thể loại")
def update_genre_endpoint(genre_id: int, genre: schemas.TheLoaiUpdate, db: Session = Depends(get_db)):
    updated_genre = crud_genre.update_genre(db, genre_id=genre_id, genre_update=genre)
    if updated_genre is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để cập nhật")
    return updated_genre

@router.delete("/{genre_id}", summary="Xóa một thể loại")
def delete_genre_endpoint(genre_id: int, db: Session = Depends(get_db)):
    deleted_genre = crud_genre.delete_genre(db, genre_id=genre_id)
    if deleted_genre is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để xóa")
    return {"detail": "Thể loại đã được xóa thành công"}
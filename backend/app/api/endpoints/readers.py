# File: backend/app/api/endpoints/readers.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_reader
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.DocGia, status_code=201, summary="Tạo độc giả mới")
def create_reader_endpoint(reader: schemas.DocGiaCreate, db: Session = Depends(get_db)):
    """
    Tạo một độc giả mới trong hệ thống.
    """
    return crud_reader.create_reader(db=db, reader=reader)

@router.get("/", response_model=List[schemas.DocGia], summary="Lấy danh sách độc giả")
def read_readers_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lấy danh sách tất cả độc giả.
    """
    readers = crud_reader.get_readers(db, skip=skip, limit=limit)
    return readers

@router.get("/{reader_id}", response_model=schemas.DocGia, summary="Lấy thông tin một độc giả")
def read_reader_endpoint(reader_id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết của một độc giả bằng ID.
    """
    db_reader = crud_reader.get_reader(db, reader_id=reader_id)
    if db_reader is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả")
    return db_reader

@router.put("/{reader_id}", response_model=schemas.DocGia, summary="Cập nhật thông tin độc giả")
def update_reader_endpoint(reader_id: int, reader_update: schemas.DocGiaUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật thông tin cho một độc giả.
    """
    updated_reader = crud_reader.update_reader(db, reader_id=reader_id, reader_update=reader_update)
    if updated_reader is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả để cập nhật")
    return updated_reader

@router.delete("/{reader_id}", response_model=schemas.DocGia, summary="Xóa một độc giả")
def delete_reader_endpoint(reader_id: int, db: Session = Depends(get_db)):
    """
    Xóa một độc giả khỏi hệ thống.
    """
    deleted_reader = crud_reader.delete_reader(db, reader_id=reader_id)
    if deleted_reader is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy độc giả để xóa")
    return deleted_reader

# File: backend/app/api/endpoints/books.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_book
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.Sach, summary="Tạo sách mới")
def create_book_endpoint(book: schemas.SachCreate, db: Session = Depends(get_db)):
    """
    Tạo một cuốn sách mới trong thư viện.
    """
    return crud_book.create_book(db=db, book=book)

@router.get("/", response_model=List[schemas.Sach], summary="Lấy danh sách sách")
def read_books_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lấy danh sách tất cả các cuốn sách có trong thư viện.
    """
    books = crud_book.get_books(db, skip=skip, limit=limit)
    return books

@router.get("/{book_id}", response_model=schemas.Sach, summary="Lấy thông tin một cuốn sách")
def read_book_endpoint(book_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết của một cuốn sách bằng Mã sách.
    """
    db_book = crud_book.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return db_book

@router.put("/{book_id}", response_model=schemas.Sach, summary="Cập nhật thông tin sách")
def update_book_endpoint(book_id: str, book: schemas.SachUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật thông tin của một cuốn sách.
    - **book_id**: Mã sách của cuốn sách cần cập nhật.
    - **book**: Thông tin cập nhật cho cuốn sách.
    """
    updated_book = crud_book.update_book(db, book_id=book_id, book_update=book)
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để cập nhật")
    return updated_book

@router.delete("/{book_id}", summary="Xóa một cuốn sách")
def delete_book_endpoint(book_id: str, db: Session = Depends(get_db)):
    """
    Xóa một cuốn sách khỏi thư viện.
    - **book_id**: Mã sách của cuốn sách cần xóa.
    """
    deleted_book = crud_book.delete_book(db, book_id=book_id)
    if deleted_book is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để xóa")
    return {"detail": "Sách đã được xóa thành công"}
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_author
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.TacGia, summary="Tạo tác giả mới")
def create_author_endpoint(author: schemas.TacGiaCreate, db: Session = Depends(get_db)):
    return crud_author.create_author(db=db, author=author)

@router.get("/", response_model=List[schemas.TacGia], summary="Lấy danh sách tác giả")
def read_authors_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    authors = crud_author.get_authors(db, skip=skip, limit=limit)
    return authors

@router.get("/{author_id}", response_model=schemas.TacGia, summary="Lấy thông tin một tác giả")
def read_author_endpoint(author_id: int, db: Session = Depends(get_db)):
    db_author = crud_author.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác giả")
    return db_author

@router.put("/{author_id}", response_model=schemas.TacGia, summary="Cập nhật thông tin tác giả")
def update_author_endpoint(author_id: int, author: schemas.TacGiaUpdate, db: Session = Depends(get_db)):
    updated_author = crud_author.update_author(db, author_id=author_id, author_update=author)
    if updated_author is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác giả để cập nhật")
    return updated_author

@router.delete("/{author_id}", summary="Xóa một tác giả")
def delete_author_endpoint(author_id: int, db: Session = Depends(get_db)):
    deleted_author = crud_author.delete_author(db, author_id=author_id)
    if deleted_author is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác giả để xóa")
    return {"detail": "Tác giả đã được xóa thành công"}
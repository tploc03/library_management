from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_borrow
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.PhieuMuon, status_code=201, summary="Tạo phiếu mượn mới")
def create_borrow_slip_endpoint(borrow: schemas.PhieuMuonCreate, db: Session = Depends(get_db)):
    return crud_borrow.create_borrow_slip(db=db, borrow=borrow)

@router.get("/", response_model=List[schemas.PhieuMuon], summary="Lấy danh sách phiếu mượn")
def read_borrow_slips_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    borrow_slips = crud_borrow.get_borrow_slips(db, skip=skip, limit=limit)
    return borrow_slips

@router.get("/unreturned", response_model=List[schemas.PhieuMuonChuaTra], summary="Lấy danh sách phiếu mượn chưa trả")
def read_unreturned_borrow_slips_endpoint(db: Session = Depends(get_db)):
    """
    Lấy danh sách tất cả các phiếu mượn có trạng thái 'Đang mượn'.
    """
    return crud_borrow.get_unreturned_slips(db)

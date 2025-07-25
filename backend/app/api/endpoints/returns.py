from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_return
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=schemas.PhieuTra, status_code=201, summary="Tạo phiếu trả mới")
def create_return_slip_endpoint(return_slip: schemas.PhieuTraCreate, db: Session = Depends(get_db)):
    return crud_return.create_return_slip(db=db, return_slip=return_slip)

@router.get("/", response_model=List[schemas.PhieuTra], summary="Lấy danh sách phiếu trả")
def read_return_slips_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return_slips = crud_return.get_return_slips(db, skip=skip, limit=limit)
    return return_slips

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import schemas
from app.crud import crud_utils
from app.db.session import get_db

router = APIRouter()

@router.get("/check-book-quantity/{book_id}", response_model=schemas.SoLuongSach, summary="Gọi Function kiểm tra số lượng sách")
def check_book_quantity(book_id: str, db: Session = Depends(get_db)):
    quantity = crud_utils.call_check_book_quantity_function(db, book_id=book_id)
    return {"MaSach": book_id, "SoLuongHienCo": quantity}

@router.get("/unreturned-borrows", response_model=List[schemas.PhieuMuonChuaTra], summary="Gọi Stored Procedure lấy phiếu mượn chưa trả")
def get_unreturned_borrows(db: Session = Depends(get_db)):
    unreturned_list_raw = crud_utils.call_unreturned_borrows_procedure(db)

    unreturned_list = [
        {
            "MaPhieuMuon": row.MaPhieuMuon,
            "NgayMuon": row.NgayMuon,
            "NgayTra": row.NgayTra,
            "TenDocGia": row.TenDocGia,
            "SoDienThoai": row.SoDienThoai
        } for row in unreturned_list_raw
    ]
    return unreturned_list

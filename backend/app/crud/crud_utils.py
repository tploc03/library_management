from sqlalchemy.orm import Session
from sqlalchemy import text, func
from app.models import models
from datetime import datetime

def call_check_book_quantity_function(db: Session, book_id: str):
    """
    Function KiemTraSoLuongSach.
    """
    result = db.execute(text("SELECT KiemTraSoLuongSach(:book_id)"), {'book_id': book_id}).scalar()
    return result if result is not None else 0

def call_unreturned_borrows_procedure(db: Session):
    """
    Stored Procedure DanhSachPhieuMuonChuaTra.
    """
    result = db.execute(text("CALL DanhSachPhieuMuonChuaTra()")).fetchall()
    return result
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models import models
from app.schemas import schemas
from app.crud import crud_book, crud_reader

def create_borrow_slip(db: Session, borrow: schemas.PhieuMuonCreate):
    db_reader = crud_reader.get_reader(db, reader_id=borrow.MaDocGia)
    if not db_reader:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy độc giả với mã {borrow.MaDocGia}")

    for detail in borrow.ChiTiet:
        db_book = crud_book.get_book(db, book_id=detail.MaSach)
        if not db_book:
            raise HTTPException(status_code=404, detail=f"Không tìm thấy sách với mã {detail.MaSach}")
        if db_book.SoLuongHienCo < detail.SoLuong:
            raise HTTPException(status_code=400, detail=f"Sách '{db_book.TenSach}' không đủ số lượng. Hiện có: {db_book.SoLuongHienCo}, Cần mượn: {detail.SoLuong}")

    try:
        db_phieu_muon = models.PhieuMuon(
            MaDocGia=borrow.MaDocGia,
            NgayMuon=borrow.NgayMuon,
            NgayTra=borrow.NgayTra,
            TrangThai='Đang mượn'
        )
        db.add(db_phieu_muon)
        db.flush()

        for detail in borrow.ChiTiet:
            db_chi_tiet = models.ChiTietPhieuMuon(
                MaPhieuMuon=db_phieu_muon.MaPhieuMuon,
                MaSach=detail.MaSach,
                SoLuong=detail.SoLuong
            )
            db.add(db_chi_tiet)

        db.commit()
        db.refresh(db_phieu_muon)
        return db_phieu_muon
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {str(e)}")

def get_borrow_slips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PhieuMuon).options(
        joinedload(models.PhieuMuon.DocGia),
        joinedload(models.PhieuMuon.ChiTietPhieuMuons).joinedload(models.ChiTietPhieuMuon.Sach)
    ).order_by(models.PhieuMuon.MaPhieuMuon.desc()).offset(skip).limit(limit).all()

def get_unreturned_slips(db: Session):
    """
    Lấy danh sách các phiếu mượn đang ở trạng thái 'Đang mượn' bằng ORM.
    """
    results = db.query(
        models.PhieuMuon.MaPhieuMuon,
        models.PhieuMuon.NgayMuon,
        models.PhieuMuon.NgayTra,
        models.DocGia.TenDocGia,
        models.DocGia.SoDienThoai
    ).join(models.DocGia, models.PhieuMuon.MaDocGia == models.DocGia.MaDocGia)\
     .filter(models.PhieuMuon.TrangThai == 'Đang mượn')\
     .order_by(models.PhieuMuon.MaPhieuMuon.desc())\
     .all()
    
    return [
        schemas.PhieuMuonChuaTra.model_validate(row, from_attributes=True) for row in results
    ]

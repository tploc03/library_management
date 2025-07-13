from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, and_
from fastapi import HTTPException
from app.models import models
from app.schemas import schemas

def create_return_slip(db: Session, return_slip: schemas.PhieuTraCreate):
    db_borrow_detail = db.query(models.ChiTietPhieuMuon).filter(models.ChiTietPhieuMuon.MaChiTietPM == return_slip.MaChiTietPM).first()
    if not db_borrow_detail:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy chi tiết phiếu mượn với mã {return_slip.MaChiTietPM}")

    existing_return = db.query(models.PhieuTra).filter(models.PhieuTra.MaChiTietPM == return_slip.MaChiTietPM).first()
    if existing_return:
        raise HTTPException(status_code=400, detail="Sách này đã được trả trước đó.")

    try:
        db_return_slip = models.PhieuTra(
            MaChiTietPM=return_slip.MaChiTietPM,
            NgayTraSach=return_slip.NgayTraSach
        )
        db.add(db_return_slip)
        db.commit()

        ma_phieu_muon = db_borrow_detail.MaPhieuMuon
        
        total_details = db.query(func.count(models.ChiTietPhieuMuon.MaChiTietPM)).filter(models.ChiTietPhieuMuon.MaPhieuMuon == ma_phieu_muon).scalar()
        
        returned_details = db.query(func.count(models.PhieuTra.MaPhieuTra)).join(models.ChiTietPhieuMuon).filter(models.ChiTietPhieuMuon.MaPhieuMuon == ma_phieu_muon).scalar()

        if total_details == returned_details:
            db_borrow_slip = db.query(models.PhieuMuon).filter(models.PhieuMuon.MaPhieuMuon == ma_phieu_muon).first()
            if db_borrow_slip:
                db_borrow_slip.TrangThai = 'Đã trả'
                db.commit()

        db.refresh(db_return_slip)
        return db_return_slip
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi server nội bộ: {str(e)}")

def get_return_slips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PhieuTra).order_by(models.PhieuTra.MaPhieuTra.desc()).offset(skip).limit(limit).all()

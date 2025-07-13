from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, DECIMAL, VARCHAR
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class TacGia(Base):
    __tablename__ = "TacGia"
    MaTacGia = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenTacGia = Column(String(255), nullable=False)
    
    Sachs = relationship("Sach", back_populates="TacGia")

class TheLoai(Base):
    __tablename__ = "TheLoai"
    MaTheLoai = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenTheLoai = Column(String(255), nullable=False)

    Sachs = relationship("Sach", back_populates="TheLoai")

class DocGia(Base):
    __tablename__ = "DocGia"
    MaDocGia = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenDocGia = Column(String(255), nullable=False)
    NgaySinh = Column(Date)
    SoDienThoai = Column(String(15), unique=True)
    
    PhieuMuons = relationship("PhieuMuon", back_populates="DocGia")

class Sach(Base):
    __tablename__ = "Sach"
    MaSach = Column(VARCHAR(20), primary_key=True, index=True)
    TenSach = Column(String(255), nullable=False)
    MaTacGia = Column(Integer, ForeignKey("TacGia.MaTacGia"))
    MaTheLoai = Column(Integer, ForeignKey("TheLoai.MaTheLoai"))
    NamXuatBan = Column(Integer)
    NhaXuatBan = Column(String(255))
    SoLuongHienCo = Column(Integer, nullable=False, default=0)

    TacGia = relationship("TacGia", back_populates="Sachs")
    TheLoai = relationship("TheLoai", back_populates="Sachs")
    ChiTietPhieuMuons = relationship("ChiTietPhieuMuon", back_populates="Sach")

class PhieuMuon(Base):
    __tablename__ = "PhieuMuon"
    MaPhieuMuon = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaDocGia = Column(Integer, ForeignKey("DocGia.MaDocGia"))
    NgayMuon = Column(Date, nullable=False)
    NgayTra = Column(Date)
    TrangThai = Column(Enum('Đang mượn', 'Đã trả'), nullable=False, default='Đang mượn')

    DocGia = relationship("DocGia", back_populates="PhieuMuons")
    ChiTietPhieuMuons = relationship("ChiTietPhieuMuon", back_populates="PhieuMuon")

class ChiTietPhieuMuon(Base):
    __tablename__ = "ChiTietPhieuMuon"
    MaChiTietPM = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaPhieuMuon = Column(Integer, ForeignKey("PhieuMuon.MaPhieuMuon"))
    MaSach = Column(VARCHAR(20), ForeignKey("Sach.MaSach"))
    SoLuong = Column(Integer, nullable=False, default=1)

    PhieuMuon = relationship("PhieuMuon", back_populates="ChiTietPhieuMuons")
    Sach = relationship("Sach", back_populates="ChiTietPhieuMuons")
    PhieuTra = relationship("PhieuTra", uselist=False, back_populates="ChiTietPhieuMuon")

class PhieuTra(Base):
    __tablename__ = "PhieuTra"
    MaPhieuTra = Column(Integer, primary_key=True, index=True, autoincrement=True)
    MaChiTietPM = Column(Integer, ForeignKey("ChiTietPhieuMuon.MaChiTietPM"), unique=True)
    NgayTraSach = Column(Date, nullable=False)
    TienPhat = Column(DECIMAL(10, 2), default=0.00)

    ChiTietPhieuMuon = relationship("ChiTietPhieuMuon", back_populates="PhieuTra")

class NguoiDung(Base):
    __tablename__ = "NguoiDung"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255))
    hashed_password = Column(String(255), nullable=False)

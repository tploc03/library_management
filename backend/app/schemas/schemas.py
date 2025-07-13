from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class TacGiaBase(BaseModel):
    TenTacGia: str

class TacGiaCreate(TacGiaBase):
    pass

class TacGiaUpdate(BaseModel):
    TenTacGia: Optional[str] = None

class TacGia(TacGiaBase):
    MaTacGia: int
    class Config: from_attributes = True

class TheLoaiBase(BaseModel):
    TenTheLoai: str

class TheLoaiCreate(TheLoaiBase):
    pass

class TheLoaiUpdate(BaseModel):
    TenTheLoai: Optional[str] = None

class TheLoai(TheLoaiBase):
    MaTheLoai: int
    class Config: from_attributes = True

class SachForDisplay(BaseModel):
    MaSach: str
    TenSach: str
    class Config: from_attributes = True

class SachBase(BaseModel):
    TenSach: str
    NamXuatBan: Optional[int] = None
    NhaXuatBan: Optional[str] = None
    SoLuongHienCo: int
    MaTacGia: int
    MaTheLoai: int

class SachCreate(SachBase):
    MaSach: str

class SachUpdate(BaseModel):
    TenSach: Optional[str] = None
    NamXuatBan: Optional[int] = None
    NhaXuatBan: Optional[str] = None
    SoLuongHienCo: Optional[int] = None
    MaTacGia: Optional[int] = None
    MaTheLoai: Optional[int] = None

class Sach(SachBase):
    MaSach: str
    TacGia: TacGia
    TheLoai: TheLoai
    class Config: from_attributes = True

class DocGiaBase(BaseModel):
    TenDocGia: str
    NgaySinh: Optional[date] = None
    SoDienThoai: Optional[str] = None

class DocGiaCreate(DocGiaBase):
    pass

class DocGiaUpdate(BaseModel):
    TenDocGia: Optional[str] = None
    NgaySinh: Optional[date] = None
    SoDienThoai: Optional[str] = None

class DocGia(DocGiaBase):
    MaDocGia: int
    class Config: from_attributes = True

class ChiTietPhieuMuonCreate(BaseModel):
    MaSach: str
    SoLuong: int

class PhieuMuonCreate(BaseModel):
    MaDocGia: int
    NgayMuon: date
    NgayTra: date
    ChiTiet: List[ChiTietPhieuMuonCreate]

class ChiTietPhieuMuon(BaseModel):
    MaChiTietPM: int
    SoLuong: int
    Sach: SachForDisplay
    class Config: from_attributes = True

class PhieuMuon(BaseModel):
    MaPhieuMuon: int
    NgayMuon: date
    NgayTra: date
    TrangThai: str
    DocGia: DocGia
    ChiTietPhieuMuons: List[ChiTietPhieuMuon]
    class Config: from_attributes = True

class PhieuTraCreate(BaseModel):
    MaChiTietPM: int
    NgayTraSach: date

class PhieuTra(BaseModel):
    MaPhieuTra: int
    MaChiTietPM: int
    NgayTraSach: date
    TienPhat: float
    class Config: from_attributes = True

class SoLuongSach(BaseModel):
    MaSach: str
    SoLuongHienCo: int

class PhieuMuonChuaTra(BaseModel):
    MaPhieuMuon: int
    NgayMuon: date
    NgayTra: date
    TenDocGia: str
    SoDienThoai: Optional[str] = None
    class Config: from_attributes = True

class ThongKe(BaseModel):
    sach_muon_thang_nay: int
    doc_gia_muon_nam_nay: int

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

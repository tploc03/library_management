export interface Author {
  MaTacGia: number;
  TenTacGia: string;
}

export interface Genre {
  MaTheLoai: number;
  TenTheLoai: string;
}

export interface Book {
  MaSach: string;
  TenSach: string;
  NamXuatBan: number | null;
  NhaXuatBan: string | null;
  SoLuongHienCo: number;
  MaTacGia: number;
  MaTheLoai: number;
  TacGia: Author;
  TheLoai: Genre;
}

export interface Reader {
  MaDocGia: number;
  TenDocGia: string;
  NgaySinh: string | null;
  SoDienThoai: string | null;
}

export interface BookForDisplay {
  MaSach: string;
  TenSach: string;
}

export interface BorrowDetail {
  MaChiTietPM: number;
  SoLuong: number;
  Sach: BookForDisplay;
}

export interface BorrowSlip {
  MaPhieuMuon: number;
  NgayMuon: string;
  NgayTra: string;
  TrangThai: 'Đang mượn' | 'Đã trả';
  DocGia: Reader;
  ChiTietPhieuMuons: BorrowDetail[];
}

export interface ReturnSlip {
    MaPhieuTra: number;
    MaChiTietPM: number;
    NgayTraSach: string;
    TienPhat: number;
}

export interface UnreturnedBorrow {
  MaPhieuMuon: number;
  NgayMuon: string;
  NgayTra: string;
  TenDocGia: string;
  SoDienThoai: string | null;
}

export interface BookQuantity {
  MaSach: string;
  SoLuongHienCo: number;
}

export interface User {
  id: number;
  username: string;
  full_name: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}
// File: frontend/types/index.ts
// Mục đích: Định nghĩa cấu trúc dữ liệu cho toàn bộ ứng dụng.

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

// Dùng để hiển thị sách trong chi tiết phiếu mượn
export interface BookForDisplay {
  MaSach: string;
  TenSach: string;
}

// Cấu trúc của một chi tiết phiếu mượn
export interface BorrowDetail {
  MaChiTietPM: number;
  SoLuong: number;
  Sach: BookForDisplay;
}

// Cấu trúc của một phiếu mượn hoàn chỉnh
export interface BorrowSlip {
  MaPhieuMuon: number;
  NgayMuon: string;
  NgayTra: string; // Ngày hẹn trả
  TrangThai: 'Đang mượn' | 'Đã trả';
  DocGia: Reader;
  ChiTietPhieuMuons: BorrowDetail[];
}

// Cấu trúc của một phiếu trả
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
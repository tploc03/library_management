CREATE DATABASE IF NOT EXISTS `thu_vien_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `thu_vien_db`;

CREATE TABLE `TacGia` (
    `MaTacGia` INT AUTO_INCREMENT PRIMARY KEY,
    `TenTacGia` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `TheLoai` (
    `MaTheLoai` INT AUTO_INCREMENT PRIMARY KEY,
    `TenTheLoai` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;


CREATE TABLE `DocGia` (
    `MaDocGia` INT AUTO_INCREMENT PRIMARY KEY,
    `TenDocGia` VARCHAR(255) NOT NULL,
    `NgaySinh` DATE,
    `SoDienThoai` VARCHAR(15) UNIQUE
) ENGINE=InnoDB;

CREATE TABLE `Sach` (
    `MaSach` VARCHAR(20) PRIMARY KEY,
    `TenSach` VARCHAR(255) NOT NULL,
    `MaTacGia` INT,
    `MaTheLoai` INT,
    `NamXuatBan` INT,
    `NhaXuatBan` VARCHAR(255),
    `SoLuongHienCo` INT NOT NULL DEFAULT 0,
    FOREIGN KEY (`MaTacGia`) REFERENCES `TacGia`(`MaTacGia`) ON DELETE SET NULL,
    FOREIGN KEY (`MaTheLoai`) REFERENCES `TheLoai`(`MaTheLoai`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `PhieuMuon` (
    `MaPhieuMuon` INT AUTO_INCREMENT PRIMARY KEY,
    `MaDocGia` INT,
    `NgayMuon` DATE NOT NULL,
    `NgayTra` DATE,
    `TrangThai` ENUM('Đang mượn', 'Đã trả') NOT NULL DEFAULT 'Đang mượn',
    FOREIGN KEY (`MaDocGia`) REFERENCES `DocGia`(`MaDocGia`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `ChiTietPhieuMuon` (
    `MaChiTietPM` INT AUTO_INCREMENT PRIMARY KEY,
    `MaPhieuMuon` INT,
    `MaSach` VARCHAR(20),
    `SoLuong` INT NOT NULL DEFAULT 1,
    FOREIGN KEY (`MaPhieuMuon`) REFERENCES `PhieuMuon`(`MaPhieuMuon`) ON DELETE CASCADE,
    FOREIGN KEY (`MaSach`) REFERENCES `Sach`(`MaSach`) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE `PhieuTra` (
    `MaPhieuTra` INT AUTO_INCREMENT PRIMARY KEY,
    `MaChiTietPM` INT UNIQUE,
    `NgayTraSach` DATE NOT NULL,
    `TienPhat` DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (`MaChiTietPM`) REFERENCES `ChiTietPhieuMuon`(`MaChiTietPM`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `NguoiDung` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `full_name` VARCHAR(255),
    `hashed_password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB;


USE `thu_vien_db`;

DELIMITER $$
DROP TRIGGER IF EXISTS `TinhTienPhat`;
CREATE TRIGGER `TinhTienPhat`
BEFORE INSERT ON `PhieuTra`
FOR EACH ROW
BEGIN
    DECLARE v_NgayHenTra DATE;
    DECLARE v_SoNgayTre INT;
    DECLARE v_TienPhatMotNgay DECIMAL(10, 2) DEFAULT 5000.00;

    SELECT pm.NgayTra INTO v_NgayHenTra
    FROM PhieuMuon pm
    JOIN ChiTietPhieuMuon ctpm ON pm.MaPhieuMuon = ctpm.MaPhieuMuon
    WHERE ctpm.MaChiTietPM = NEW.MaChiTietPM;

    SET v_SoNgayTre = DATEDIFF(NEW.NgayTraSach, v_NgayHenTra);

    IF v_SoNgayTre > 0 THEN
        SET NEW.TienPhat = v_SoNgayTre * v_TienPhatMotNgay;
    ELSE
        SET NEW.TienPhat = 0.00;
    END IF;
END$$

CREATE TRIGGER `CapNhatSoLuongKhiMuon`
AFTER INSERT ON `ChiTietPhieuMuon`
FOR EACH ROW
BEGIN
    UPDATE `Sach`
    SET `SoLuongHienCo` = `SoLuongHienCo` - NEW.SoLuong
    WHERE `MaSach` = NEW.MaSach;
END$$

CREATE TRIGGER `CapNhatSoLuongKhiTra`
AFTER INSERT ON `PhieuTra`
FOR EACH ROW
BEGIN
    DECLARE v_MaSach VARCHAR(20);
    DECLARE v_SoLuong INT;

    SELECT `MaSach`, `SoLuong` INTO v_MaSach, v_SoLuong
    FROM `ChiTietPhieuMuon`
    WHERE `MaChiTietPM` = NEW.MaChiTietPM;

    UPDATE `Sach`
    SET `SoLuongHienCo` = `SoLuongHienCo` + v_SoLuong
    WHERE `MaSach` = v_MaSach;
END$$

DELIMITER ;

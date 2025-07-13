USE `thu_vien_db`;

DELIMITER $$

-- Lists all borrow slips that are currently not returned.
CREATE PROCEDURE `DanhSachPhieuMuonChuaTra`()
BEGIN
    SELECT 
        pm.MaPhieuMuon,
        pm.NgayMuon,
        pm.NgayTra,
        dg.TenDocGia,
        dg.SoDienThoai
    FROM `PhieuMuon` pm
    JOIN `DocGia` dg ON pm.MaDocGia = dg.MaDocGia
    WHERE pm.TrangThai = 'Đang mượn';
END$$

DELIMITER ;


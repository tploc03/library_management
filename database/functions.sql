USE `thu_vien_db`;

DELIMITER $$

-- Checks the remaining quantity of a book by its ID.
CREATE FUNCTION `KiemTraSoLuongSach`(
    p_MaSach VARCHAR(20)
) 
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_SoLuong INT;

    SELECT `SoLuongHienCo` INTO v_SoLuong
    FROM `Sach`
    WHERE `MaSach` = p_MaSach;

    RETURN IFNULL(v_SoLuong, 0);
END$$

DELIMITER ;

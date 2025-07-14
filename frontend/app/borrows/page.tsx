/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ExportCSVButton from '@/components/DynamicExportCSVButton';
import { getBorrowSlips, createBorrowSlip, createReturnSlip, getBooks, getReturnSlips, getUnreturnedBorrows, checkBookQuantity } from '../../lib/api';
import { BorrowSlip, Book, ReturnSlip, UnreturnedBorrow, Reader } from '../../types';
import { toast } from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';

const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('vi-VN');

export default function BorrowsPage() {
  const [borrowSlips, setBorrowSlips] = useState<BorrowSlip[]>([]);
  const [returnSlips, setReturnSlips] = useState<ReturnSlip[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyUnreturned, setShowOnlyUnreturned] = useState(false);
  const [unreturnedSlips, setUnreturnedSlips] = useState<UnreturnedBorrow[]>([]);
  const [isLoadingUnreturned, setIsLoadingUnreturned] = useState(false);

  const { state: appState } = useAppData();
  const { readers, isLoading: isAppDataLoading } = appState;

  const fetchPageData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const [borrowsRes, returnsRes, booksRes] = await Promise.all([
        getBorrowSlips(),
        getReturnSlips(),
        getBooks(),
      ]);
      setBorrowSlips(borrowsRes.data);
      setReturnSlips(returnsRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu mượn/trả.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleToggleUnreturnedFilter = async () => {
    const newFilterState = !showOnlyUnreturned;
    setShowOnlyUnreturned(newFilterState);

    if (newFilterState) {
      setIsLoadingUnreturned(true);
      try {
        const res = await getUnreturnedBorrows();
        setUnreturnedSlips(res.data);
      } catch (error) {
        toast.error("Không thể tải danh sách phiếu chưa trả.");
      } finally {
        setIsLoadingUnreturned(false);
      }
    }
  };

  const handleSaveBorrowSlip = async (data: any) => {
    const loadingToast = toast.loading('Đang tạo phiếu mượn...');
    try {
      await createBorrowSlip(data);
      toast.success('Tạo phiếu mượn thành công!');
      setIsModalOpen(false);
      await fetchPageData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
      toast.error(`Tạo phiếu mượn thất bại: ${errorMessage}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };
  
  const handleReturnBook = async (borrowDetailId: number) => {
      if (!window.confirm("Bạn có chắc muốn trả sách này?")) return;
      const loadingToast = toast.loading('Đang xử lý trả sách...');
      try {
          await createReturnSlip({
              MaChiTietPM: borrowDetailId,
              NgayTraSach: new Date().toISOString().split('T')[0],
          });
          toast.success('Trả sách thành công!');
          await fetchPageData();
          // Also refetch unreturned slips if that view is active
          if (showOnlyUnreturned) {
              const res = await getUnreturnedBorrows();
              setUnreturnedSlips(res.data);
          }
      } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
          toast.error(`Trả sách thất bại: ${errorMessage}`);
      } finally {
          toast.dismiss(loadingToast);
      }
  }

  const isLoading = isLoadingData || isAppDataLoading;

  const returnedDetailIds = new Set(returnSlips.map(rs => rs.MaChiTietPM));
  const csvHeaders = [
    { label: "Mã Phiếu Mượn", key: "MaPhieuMuon" },
    { label: "Tên Độc Giả", key: "TenDocGia" },
    { label: "Ngày Mượn", key: "NgayMuon" },
    { label: "Ngày Hẹn Trả", key: "NgayHenTra" },
    { label: "Trạng Thái Phiếu", key: "TrangThaiPhieu" },
    { label: "Mã Sách", key: "MaSach" },
    { label: "Tên Sách", key: "TenSach" },
    { label: "Số Lượng", key: "SoLuong" },
    { label: "Trạng Thái Sách", key: "TrangThaiSach" },
  ];

  const csvData = borrowSlips.flatMap(slip =>
    slip.ChiTietPhieuMuons.map(detail => {
      const isReturned = returnedDetailIds.has(detail.MaChiTietPM);
      return {
        MaPhieuMuon: slip.MaPhieuMuon,
        TenDocGia: slip.DocGia.TenDocGia,
        NgayMuon: formatDate(slip.NgayMuon),
        NgayHenTra: formatDate(slip.NgayTra),
        TrangThaiPhieu: slip.TrangThai,
        MaSach: detail.Sach.MaSach,
        TenSach: detail.Sach.TenSach,
        SoLuong: detail.SoLuong,
        TrangThaiSach: isReturned ? 'Đã trả' : 'Chưa trả',
      };
    })
  );


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Mượn/Trả</h1>
        <div className="flex items-center space-x-4">
            <ExportCSVButton
                data={csvData}
                headers={csvHeaders}
                filename="danh_sach_sach.csv"
            />
            <button
                onClick={handleToggleUnreturnedFilter}
                className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors"
            >
                {showOnlyUnreturned ? 'Hiển thị Tất cả' : 'DS Chưa Trả'}
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
            >
                Tạo Phiếu Mượn
            </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        showOnlyUnreturned ? (
            <UnreturnedTable unreturnedSlips={unreturnedSlips} isLoading={isLoadingUnreturned} />
        ) : (
            <BorrowTable borrowSlips={borrowSlips} returnSlips={returnSlips} onReturn={handleReturnBook} />
        )
      )}

      {isModalOpen && (
        <BorrowForm
          readers={readers}
          books={books}
          onSave={handleSaveBorrowSlip}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

const BorrowTable = ({ borrowSlips, returnSlips, onReturn }: { borrowSlips: BorrowSlip[], returnSlips: ReturnSlip[], onReturn: (id: number) => void }) => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    
    const returnSlipsMap = new Map(returnSlips.map(rs => [rs.MaChiTietPM, rs]));
    
    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
  
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã PM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độc Giả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Mượn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Hẹn Trả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {borrowSlips.length > 0 ? borrowSlips.map((slip) => (
                    <React.Fragment key={slip.MaPhieuMuon}>
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRow(slip.MaPhieuMuon)}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slip.MaPhieuMuon}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slip.DocGia.TenDocGia}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(slip.NgayMuon)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(slip.NgayTra)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slip.TrangThai === 'Đã trả' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {slip.TrangThai}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                {expandedRow === slip.MaPhieuMuon ? '▼ Đóng' : '► Xem'}
                            </td>
                        </tr>
                        {expandedRow === slip.MaPhieuMuon && (
                            <tr>
                                <td colSpan={6} className="p-4 bg-gray-100">
                                    <h4 className="font-bold mb-2 text-gray-800">Chi Tiết Phiếu Mượn:</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-md">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Tên Sách</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Số Lượng</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Trạng Thái</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Ngày Trả</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Tiền Phạt</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {slip.ChiTietPhieuMuons.map(detail => {
                                                    const returnInfo = returnSlipsMap.get(detail.MaChiTietPM);
                                                    const isReturned = !!returnInfo;

                                                    return (
                                                        <tr key={detail.MaChiTietPM} className="border-b border-gray-200">
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{detail.Sach.TenSach}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{detail.SoLuong}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isReturned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {isReturned ? 'Đã trả' : 'Chưa trả'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{isReturned ? formatDate(returnInfo.NgayTraSach) : 'N/A'}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                                                                {isReturned ? `${returnInfo.TienPhat.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                                {!isReturned && (
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); onReturn(detail.MaChiTietPM); }}
                                                                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                                                                    >
                                                                        Trả Sách
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )) : (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-500">Không có dữ liệu phiếu mượn.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

const UnreturnedTable = ({ unreturnedSlips, isLoading }: { unreturnedSlips: UnreturnedBorrow[], isLoading: boolean }) => {
    if (isLoading) {
        return <p>Đang tải danh sách phiếu chưa trả...</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-xl font-semibold p-4 bg-yellow-100 text-yellow-800">Danh sách Phiếu Mượn Chưa Trả (từ Stored Procedure)</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã PM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Độc Giả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Mượn</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Hẹn Trả</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {unreturnedSlips.length > 0 ? unreturnedSlips.map((slip) => (
                        <tr key={slip.MaPhieuMuon} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{slip.MaPhieuMuon}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slip.TenDocGia}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(slip.NgayMuon)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(slip.NgayTra)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{slip.SoDienThoai || 'N/A'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-500">Không có phiếu mượn nào chưa trả.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const BorrowForm = ({ readers, books, onSave, onClose }: { readers: Reader[], books: Book[], onSave: (data: any) => void, onClose: () => void }) => {
    const [maDocGia, setMaDocGia] = useState('');
    const [ngayTra, setNgayTra] = useState('');
    const [chiTiet, setChiTiet] = useState<{ MaSach: string; TenSach: string; SoLuong: number }[]>([]);
    const [selectedBook, setSelectedBook] = useState('');
  
    const handleAddBook = () => {
      const bookToAdd = books.find(b => b.MaSach === selectedBook);
      if (bookToAdd && !chiTiet.find(b => b.MaSach === selectedBook)) {
        if (bookToAdd.SoLuongHienCo > 0) {
          setChiTiet([...chiTiet, { MaSach: bookToAdd.MaSach, TenSach: bookToAdd.TenSach, SoLuong: 1 }]);
        } else {
          toast.error(`Sách "${bookToAdd.TenSach}" đã hết hàng.`);
        }
      }
    };
    
    const handleRemoveBook = (maSach: string) => {
      setChiTiet(chiTiet.filter(b => b.MaSach !== maSach));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!maDocGia || !ngayTra || chiTiet.length === 0) {
        toast.error('Vui lòng điền đầy đủ thông tin: độc giả, ngày trả và ít nhất một cuốn sách.');
        return;
      }
      onSave({
        MaDocGia: Number(maDocGia),
        NgayMuon: new Date().toISOString().split('T')[0],
        NgayTra: ngayTra,
        ChiTiet: chiTiet.map(({ MaSach, SoLuong }) => ({ MaSach, SoLuong })),
      });
    };

    const handleCheckQuantity = async () => {
        if (!selectedBook) {
            toast.error("Vui lòng chọn một cuốn sách để kiểm tra.");
            return;
        }
        const loadingToast = toast.loading(`Đang kiểm tra số lượng sách...`);
        try {
            const response = await checkBookQuantity(selectedBook);
            const book = books.find(b => b.MaSach === selectedBook);
            const bookName = book ? `"${book.TenSach}"` : `sách có mã ${selectedBook}`;
            toast.success(`Số lượng ${bookName} hiện có là: ${response.data.SoLuongHienCo}`, {
                duration: 4000,
            });
        } catch (error) {
            toast.error("Không thể kiểm tra số lượng sách.");
        } finally {
            toast.dismiss(loadingToast);
        }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl m-4">
          <h2 className="text-2xl font-bold mb-6">Tạo Phiếu Mượn Mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Độc Giả</label>
                      <select value={maDocGia} onChange={e => setMaDocGia(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500">
                          <option value="" disabled>Chọn độc giả</option>
                          {readers.map(r => <option key={r.MaDocGia} value={r.MaDocGia}>{r.TenDocGia}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày Hẹn Trả</label>
                      <input type="date" value={ngayTra} onChange={e => setNgayTra(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500" />
                  </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700">Chọn Sách</label>
                  <div className="flex items-center space-x-2 mt-1">
                      <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500">
                          <option value="" disabled>Chọn sách để thêm</option>
                          {books.map(b => <option key={b.MaSach} value={b.MaSach}>{b.TenSach}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={handleCheckQuantity}
                        disabled={!selectedBook}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 whitespace-nowrap disabled:bg-gray-400"
                        title="Kiểm tra số lượng sách hiện tại bằng Function"
                      >
                        Kiểm tra SL
                      </button>
                      <button type="button" onClick={handleAddBook} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 whitespace-nowrap">Thêm Sách</button>
                  </div>
              </div>
  
              <div>
                  <h3 className="text-lg font-medium text-gray-800">Sách đã chọn:</h3>
                  {chiTiet.length > 0 ? (
                      <ul className="mt-2 space-y-2 border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto">
                          {chiTiet.map(b => (
                              <li key={b.MaSach} className="flex justify-between items-center">
                                  <span>{b.TenSach}</span>
                                  <button type="button" onClick={() => handleRemoveBook(b.MaSach)} className="text-red-500 hover:text-red-700 text-xs">Xóa</button>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-sm text-gray-500 mt-2">Chưa có sách nào được chọn.</p>
                  )}
              </div>
  
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition">Hủy</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Lưu Phiếu Mượn</button>
            </div>
          </form>
        </div>
      </div>
    );
};

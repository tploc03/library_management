// File: frontend/app/books/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
// 1. Import CSVLink
import { CSVLink } from 'react-csv';
import { getBooks, createBook, updateBook, deleteBook } from '../../lib/api';
import { Book, Author, Genre } from '../../types';
import { toast } from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';

// =======================================================================
// COMPONENT CHÍNH: BooksPage
// =======================================================================
export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { state: appState } = useAppData();
  const { authors, genres, isLoading: isAppDataLoading } = appState;

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoadingBooks(true);
      const booksRes = await getBooks();
      setBooks(booksRes.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
      toast.error('Không thể tải danh sách sách.');
    } finally {
      setIsLoadingBooks(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleOpenModal = (book: Book | null = null) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSaveBook = async (bookData: any) => {
    const loadingToast = toast.loading('Đang lưu...');
    try {
      if (editingBook) {
        await updateBook(editingBook.MaSach, bookData);
        toast.success('Cập nhật sách thành công!');
      } else {
        await createBook(bookData);
        toast.success('Thêm sách mới thành công!');
      }
      handleCloseModal();
      await fetchBooks();
    } catch (error: any) {
      console.error("Lỗi khi lưu sách:", error);
      const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
      toast.error(`Lưu sách thất bại: ${errorMessage}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      const loadingToast = toast.loading('Đang xóa...');
      try {
        await deleteBook(id);
        toast.success('Xóa sách thành công!');
        await fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        toast.error('Xóa sách thất bại.');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };
  
  const isLoading = isLoadingBooks || isAppDataLoading;

  // 2. Chuẩn bị dữ liệu và tiêu đề cho file CSV
  const csvHeaders = [
    { label: "Mã Sách", key: "MaSach" },
    { label: "Tên Sách", key: "TenSach" },
    { label: "Tác Giả", key: "TenTacGia" },
    { label: "Thể Loại", key: "TenTheLoai" },
    { label: "Năm Xuất Bản", key: "NamXuatBan" },
    { label: "Nhà Xuất Bản", key: "NhaXuatBan" },
    { label: "Số Lượng Hiện Có", key: "SoLuongHienCo" },
  ];

  // Chuyển đổi dữ liệu sách để phù hợp với CSV (làm phẳng dữ liệu)
  const csvData = books.map(book => ({
    MaSach: book.MaSach,
    TenSach: book.TenSach,
    TenTacGia: book.TacGia?.TenTacGia || 'N/A',
    TenTheLoai: book.TheLoai?.TenTheLoai || 'N/A',
    NamXuatBan: book.NamXuatBan || 'N/A',
    NhaXuatBan: book.NhaXuatBan || 'N/A',
    SoLuongHienCo: book.SoLuongHienCo,
  }));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Sách</h1>
        {/* 3. Thêm nút "Xuất ra CSV" */}
        <div className="flex items-center space-x-4">
            <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={"danh_sach_sach.csv"}
                className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700 transition-colors"
                target="_blank"
            >
                Xuất ra CSV
            </CSVLink>
            <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
                Thêm Sách Mới
            </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <BookTable books={books} onEdit={handleOpenModal} onDelete={handleDeleteBook} />
      )}

      {isModalOpen && (
        <BookForm
          book={editingBook}
          authors={authors}
          genres={genres}
          onSave={handleSaveBook}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// =======================================================================
// COMPONENT PHỤ: BookTable (Không thay đổi)
// =======================================================================
const BookTable = ({ books, onEdit, onDelete }: { books: Book[], onEdit: (book: Book) => void, onDelete: (id: string) => void }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Sách</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sách</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác Giả</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thể Loại</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.length > 0 ? books.map((book) => (
            <tr key={book.MaSach} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.MaSach}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.TenSach}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.TacGia?.TenTacGia || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.TheLoai?.TenTheLoai || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.SoLuongHienCo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <button onClick={() => onEdit(book)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                <button onClick={() => onDelete(book.MaSach)} className="text-red-600 hover:text-red-900">Xóa</button>
              </td>
            </tr>
          )) : (
            <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">Không có dữ liệu sách.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// =======================================================================
// COMPONENT PHỤ: BookForm (Không thay đổi)
// =======================================================================
const BookForm = ({ book, authors, genres, onSave, onClose }: { book: Book | null, authors: Author[], genres: Genre[], onSave: (data: any) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    MaSach: book?.MaSach || '',
    TenSach: book?.TenSach || '',
    MaTacGia: book?.MaTacGia || '',
    MaTheLoai: book?.MaTheLoai || '',
    NamXuatBan: book?.NamXuatBan || new Date().getFullYear(),
    NhaXuatBan: book?.NhaXuatBan || '',
    SoLuongHienCo: book?.SoLuongHienCo || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
        ...formData,
        NamXuatBan: Number(formData.NamXuatBan),
        SoLuongHienCo: Number(formData.SoLuongHienCo),
        MaTacGia: Number(formData.MaTacGia),
        MaTheLoai: Number(formData.MaTheLoai),
    };
    if (book) {
        const { MaSach, ...updateData } = dataToSave;
        onSave(updateData);
    } else {
        onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-6">{book ? 'Chỉnh sửa Sách' : 'Thêm Sách Mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!book && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Mã Sách</label>
                <input type="text" name="MaSach" value={formData.MaSach} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tên Sách</label>
              <input type="text" name="TenSach" value={formData.TenSach} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tác Giả</label>
              <select name="MaTacGia" value={formData.MaTacGia} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Chọn tác giả</option>
                {authors.map(author => <option key={author.MaTacGia} value={author.MaTacGia}>{author.TenTacGia}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Thể Loại</label>
              <select name="MaTheLoai" value={formData.MaTheLoai} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Chọn thể loại</option>
                {genres.map(genre => <option key={genre.MaTheLoai} value={genre.MaTheLoai}>{genre.TenTheLoai}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Năm Xuất Bản</label>
              <input type="number" name="NamXuatBan" value={formData.NamXuatBan} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhà Xuất Bản</label>
              <input type="text" name="NhaXuatBan" value={formData.NhaXuatBan} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
              <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Số Lượng Hiện Có</label>
              <input type="number" name="SoLuongHienCo" value={formData.SoLuongHienCo} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition">Hủy</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

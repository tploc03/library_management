/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { createAuthor, updateAuthor, deleteAuthor } from '../../lib/api';
import { Author } from '../../types';
import { toast } from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';
import ExportCSVButton from '@/components/ExportCSVButton';

export default function AuthorsPage() {
  const { state, refetchData } = useAppData();
  const { authors, isLoading } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleOpenModal = (author: Author | null = null) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  const handleSaveAuthor = async (authorData: { TenTacGia: string }) => {
    const loadingToast = toast.loading('Đang lưu...');
    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.MaTacGia, authorData);
        toast.success('Cập nhật tác giả thành công!');
      } else {
        await createAuthor(authorData);
        toast.success('Thêm tác giả mới thành công!');
      }
      handleCloseModal();
      await refetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
      toast.error(`Lưu tác giả thất bại: ${errorMessage}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) {
      const loadingToast = toast.loading('Đang xóa...');
      try {
        await deleteAuthor(id);
        toast.success('Xóa tác giả thành công!');
        await refetchData();
      } catch (error) {
        toast.error('Xóa tác giả thất bại. Có thể tác giả này đã được gán cho sách.');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const csvHeaders = [
    { label: "Mã Tác Giả", key: "MaTacGia" },
    { label: "Tên Tác Giả", key: "TenTacGia" }
  ];

  const csvData = authors;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Tác Giả</h1>
        <div className="flex items-center space-x-4">
            <ExportCSVButton
              data={csvData}
              headers={csvHeaders}
              filename="danh_sach_phieu_muon.csv"
            />
            <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
                Thêm Tác Giả Mới
            </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AuthorTable authors={authors} onEdit={handleOpenModal} onDelete={handleDeleteAuthor} />
      )}

      {isModalOpen && (
        <AuthorForm
          author={editingAuthor}
          onSave={handleSaveAuthor}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const AuthorTable = ({ authors, onEdit, onDelete }: { authors: Author[], onEdit: (author: Author) => void, onDelete: (id: number) => void }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Tác Giả</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Tác Giả</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {authors.length > 0 ? authors.map((author) => (
          <tr key={author.MaTacGia} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{author.MaTacGia}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{author.TenTacGia}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
              <button onClick={() => onEdit(author)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
              <button onClick={() => onDelete(author.MaTacGia)} className="text-red-600 hover:text-red-900">Xóa</button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={3} className="text-center py-10 text-gray-500">Không có dữ liệu tác giả.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const AuthorForm = ({ author, onSave, onClose }: { author: Author | null, onSave: (data: { TenTacGia: string }) => void, onClose: () => void }) => {
  const [tenTacGia, setTenTacGia] = useState(author?.TenTacGia || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenTacGia.trim()) {
      toast.error('Tên tác giả không được để trống.');
      return;
    }
    onSave({ TenTacGia: tenTacGia });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">{author ? 'Chỉnh sửa Tác Giả' : 'Thêm Tác Giả Mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Tác Giả</label>
            <input
              type="text"
              value={tenTacGia}
              onChange={(e) => setTenTacGia(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập tên tác giả..."
            />
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

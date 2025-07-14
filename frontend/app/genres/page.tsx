/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { createGenre, updateGenre, deleteGenre } from '../../lib/api';
import { Genre } from '../../types';
import { toast } from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';
import ExportCSVButton from '@/components/ExportCSVButton';

export default function GenresPage() {
  const { state, refetchData } = useAppData();
  const { genres, isLoading } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const handleOpenModal = (genre: Genre | null = null) => {
    setEditingGenre(genre);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGenre(null);
  };

  const handleSaveGenre = async (genreData: { TenTheLoai: string }) => {
    const loadingToast = toast.loading('Đang lưu...');
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.MaTheLoai, genreData);
        toast.success('Cập nhật thể loại thành công!');
      } else {
        await createGenre(genreData);
        toast.success('Thêm thể loại mới thành công!');
      }
      handleCloseModal();
      await refetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
      toast.error(`Lưu thể loại thất bại: ${errorMessage}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteGenre = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
      const loadingToast = toast.loading('Đang xóa...');
      try {
        await deleteGenre(id);
        toast.success('Xóa thể loại thành công!');
        await refetchData();
      } catch (error) {
        toast.error('Xóa thể loại thất bại. Có thể thể loại này đã được gán cho sách.');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const csvHeaders = [
    { label: "Mã Thể Loại", key: "MaTheLoai" },
    { label: "Tên Thể Loại", key: "TenTheLoai" }
  ];

  const csvData = genres;

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Thể Loại</h1>
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
                Thêm Thể Loại Mới
            </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <GenreTable genres={genres} onEdit={handleOpenModal} onDelete={handleDeleteGenre} />
      )}

      {isModalOpen && (
        <GenreForm
          genre={editingGenre}
          onSave={handleSaveGenre}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const GenreTable = ({ genres, onEdit, onDelete }: { genres: Genre[], onEdit: (genre: Genre) => void, onDelete: (id: number) => void }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Thể Loại</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Thể Loại</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {genres.length > 0 ? genres.map((genre) => (
          <tr key={genre.MaTheLoai} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{genre.MaTheLoai}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{genre.TenTheLoai}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
              <button onClick={() => onEdit(genre)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
              <button onClick={() => onDelete(genre.MaTheLoai)} className="text-red-600 hover:text-red-900">Xóa</button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={3} className="text-center py-10 text-gray-500">Không có dữ liệu thể loại.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const GenreForm = ({ genre, onSave, onClose }: { genre: Genre | null, onSave: (data: { TenTheLoai: string }) => void, onClose: () => void }) => {
  const [tenTheLoai, setTenTheLoai] = useState(genre?.TenTheLoai || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenTheLoai.trim()) {
      toast.error('Tên thể loại không được để trống.');
      return;
    }
    onSave({ TenTheLoai: tenTheLoai });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-6">{genre ? 'Chỉnh sửa Thể Loại' : 'Thêm Thể Loại Mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Thể Loại</label>
            <input
              type="text"
              value={tenTheLoai}
              onChange={(e) => setTenTheLoai(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập tên thể loại..."
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

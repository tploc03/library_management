/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { createReader, updateReader, deleteReader } from '../../lib/api';
import { Reader } from '../../types';
import { toast } from 'react-hot-toast';
import { useAppData } from '../../context/AppDataContext';
import ExportCSVButton from '@/components/ExportCSVButton';

export default function ReadersPage() {
  const { state, refetchData } = useAppData();
  const { readers, isLoading } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReader, setEditingReader] = useState<Reader | null>(null);

  const handleOpenModal = (reader: Reader | null = null) => {
    setEditingReader(reader);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReader(null);
  };

  const handleSaveReader = async (readerData: Omit<Reader, 'MaDocGia'>) => {
    const loadingToast = toast.loading('Đang lưu...');
    try {
      if (editingReader) {
        await updateReader(editingReader.MaDocGia, readerData);
        toast.success('Cập nhật độc giả thành công!');
      } else {
        await createReader(readerData);
        toast.success('Thêm độc giả mới thành công!');
      }
      handleCloseModal();
      await refetchData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Đã xảy ra lỗi.';
      toast.error(`Lưu độc giả thất bại: ${errorMessage}`);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteReader = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa độc giả này?')) {
      const loadingToast = toast.loading('Đang xóa...');
      try {
        await deleteReader(id);
        toast.success('Xóa độc giả thành công!');
        await refetchData();
      } catch (error) {
        toast.error('Xóa độc giả thất bại. Có thể độc giả này đã có phiếu mượn.');
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const csvHeaders = [
    { label: "Mã Độc Giả", key: "MaDocGia" },
    { label: "Tên Độc Giả", key: "TenDocGia" },
    { label: "Ngày Sinh", key: "NgaySinh" },
    { label: "Số Điện Thoại", key: "SoDienThoai" }
  ];

  const csvData = readers.map(reader => ({
    ...reader,
    NgaySinh: reader.NgaySinh ? new Date(reader.NgaySinh).toLocaleDateString('vi-VN') : 'N/A'
  }));

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Độc Giả</h1>
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
                Thêm Độc Giả Mới
            </button>
        </div>
      </div>

      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <ReaderTable readers={readers} onEdit={handleOpenModal} onDelete={handleDeleteReader} />
      )}

      {isModalOpen && (
        <ReaderForm
          reader={editingReader}
          onSave={handleSaveReader}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const ReaderTable = ({ readers, onEdit, onDelete }: { readers: Reader[], onEdit: (reader: Reader) => void, onDelete: (id: number) => void }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Độc Giả</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Độc Giả</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Sinh</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Điện Thoại</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {readers.length > 0 ? readers.map((reader) => (
          <tr key={reader.MaDocGia} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.MaDocGia}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reader.TenDocGia}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.NgaySinh ? new Date(reader.NgaySinh).toLocaleDateString('vi-VN') : 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{reader.SoDienThoai || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
              <button onClick={() => onEdit(reader)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
              <button onClick={() => onDelete(reader.MaDocGia)} className="text-red-600 hover:text-red-900">Xóa</button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={5} className="text-center py-10 text-gray-500">Không có dữ liệu độc giả.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const ReaderForm = ({ reader, onSave, onClose }: { reader: Reader | null, onSave: (data: Omit<Reader, 'MaDocGia'>) => void, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    TenDocGia: reader?.TenDocGia || '',
    NgaySinh: reader?.NgaySinh ? reader.NgaySinh.split('T')[0] : '',
    SoDienThoai: reader?.SoDienThoai || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.TenDocGia.trim()) {
      toast.error('Tên độc giả không được để trống.');
      return;
    }
    onSave({
        ...formData,
        NgaySinh: formData.NgaySinh || null,
        SoDienThoai: formData.SoDienThoai || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-6">{reader ? 'Chỉnh sửa Độc Giả' : 'Thêm Độc Giả Mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Độc Giả</label>
            <input
              type="text"
              name="TenDocGia"
              value={formData.TenDocGia}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày Sinh</label>
            <input
              type="date"
              name="NgaySinh"
              value={formData.NgaySinh}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
            <input
              type="tel"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

import axios from 'axios';
import { Book, Author, Genre, Reader, BorrowSlip, ReturnSlip, User, Token, UnreturnedBorrow, BookQuantity } from '../types';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthors = () => apiClient.get<Author[]>('/authors/');
export const createAuthor = (data: { TenTacGia: string }) => apiClient.post<Author>('/authors/', data);
export const updateAuthor = (id: number, data: { TenTacGia: string }) => apiClient.put<Author>(`/authors/${id}`, data);
export const deleteAuthor = (id: number) => apiClient.delete(`/authors/${id}`);


export const getGenres = () => apiClient.get<Genre[]>('/genres/');
export const createGenre = (data: { TenTheLoai: string }) => apiClient.post<Genre>('/genres/', data);
export const updateGenre = (id: number, data: { TenTheLoai: string }) => apiClient.put<Genre>(`/genres/${id}`, data);
export const deleteGenre = (id: number) => apiClient.delete(`/genres/${id}`);

export const getBooks = () => apiClient.get<Book[]>('/books/');
export const createBook = (data: Omit<Book, 'TacGia' | 'TheLoai'>) => apiClient.post<Book>('/books/', data);
export const updateBook = (id: string, data: Partial<Omit<Book, 'MaSach' | 'TacGia' | 'TheLoai'>>) => apiClient.put<Book>(`/books/${id}`, data);
export const deleteBook = (id: string) => apiClient.delete(`/books/${id}`);

export const getReaders = () => apiClient.get<Reader[]>('/readers/');
export const createReader = (data: Omit<Reader, 'MaDocGia'>) => apiClient.post<Reader>('/readers/', data);
export const updateReader = (id: number, data: Partial<Omit<Reader, 'MaDocGia'>>) => apiClient.put<Reader>(`/readers/${id}`, data);
export const deleteReader = (id: number) => apiClient.delete(`/readers/${id}`);

export const getBorrowSlips = () => apiClient.get<BorrowSlip[]>('/borrows/');

export const createBorrowSlip = (data: {
    MaDocGia: number;
    NgayMuon: string;
    NgayTra: string;
    ChiTiet: { MaSach: string; SoLuong: number }[];
}) => apiClient.post<BorrowSlip>('/borrows/', data);

export const createReturnSlip = (data: {
    MaChiTietPM: number;
    NgayTraSach: string;
}) => apiClient.post<ReturnSlip>('/returns/', data);

export const getReturnSlips = () => apiClient.get<ReturnSlip[]>('/returns/');
export const getUnreturnedBorrows = () => apiClient.get<UnreturnedBorrow[]>('/utils/unreturned-borrows');
export const checkBookQuantity = (bookId: string) => apiClient.get<BookQuantity>(`/utils/check-book-quantity/${bookId}`);

export const registerUser = (data: Omit<User, 'id'> & { password: string }) => {
  return apiClient.post<User>('/auth/register', data);
};

export const loginUser = (data: URLSearchParams) => {
  return apiClient.post<Token>('/auth/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};


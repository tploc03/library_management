/* eslint-disable @typescript-eslint/no-unused-vars */
// File: frontend/context/AppDataContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Author, Genre, Reader } from '../types';
import { getAuthors, getGenres, getReaders } from '../lib/api';
import { toast } from 'react-hot-toast';

// Định nghĩa cấu trúc của State chung
interface AppState {
  authors: Author[];
  genres: Genre[];
  readers: Reader[];
  isLoading: boolean;
  error: string | null;
}

// Định nghĩa các hành động có thể làm thay đổi State
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { authors: Author[]; genres: Genre[]; readers: Reader[] } }
  | { type: 'FETCH_ERROR'; payload: string };

// Giá trị khởi tạo cho State
const initialState: AppState = {
  authors: [],
  genres: [],
  readers: [],
  isLoading: true,
  error: null,
};

// Reducer: Một hàm thuần túy nhận vào state hiện tại và một action, trả về state mới
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        authors: action.payload.authors,
        genres: action.payload.genres,
        readers: action.payload.readers,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// Định nghĩa cấu trúc của Context
interface AppDataContextType {
  state: AppState;
  refetchData: () => Promise<void>; // Hàm để tải lại dữ liệu từ server
}

// Tạo Context
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Tạo Provider Component: Component này sẽ "bọc" ứng dụng và cung cấp dữ liệu
export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Gọi đồng thời các API để tối ưu tốc độ
      const [authorsRes, genresRes, readersRes] = await Promise.all([
        getAuthors(),
        getGenres(),
        getReaders(),
      ]);
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          authors: authorsRes.data,
          genres: genresRes.data,
          readers: readersRes.data,
        },
      });
    } catch (err) {
      const errorMessage = 'Không thể tải dữ liệu chung của ứng dụng.';
      toast.error(errorMessage);
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };

  // Tải dữ liệu lần đầu khi Provider được gắn vào cây component
  useEffect(() => {
    fetchData();
  }, []);

  const value = { state, refetchData: fetchData };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

// Tạo Custom Hook: Giúp việc sử dụng context trong các component khác dễ dàng hơn
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

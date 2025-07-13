// File: frontend/app/layout.tsx
'use client'; 

import { Inter } from "next/font/google";
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import "./globals.css";
// Import AppDataProvider vừa tạo
import { AppDataProvider } from "../context/AppDataContext";

const inter = Inter({ subsets: ["latin"] });

const LogoutButton = () => {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove('accessToken');
    toast.success('Đã đăng xuất!');
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="w-full text-left flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-red-100 hover:text-red-700">
      Đăng xuất
    </button>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showSidebar = !['/login', '/register'].includes(pathname);

  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* Bọc toàn bộ ứng dụng bằng AppDataProvider */}
        {/* Mọi component con bên trong đều có thể truy cập dữ liệu chung */}
        <AppDataProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="flex min-h-screen bg-gray-100">
            {showSidebar && (
              <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col">
                <div className="p-6 border-b">
                  <Link href="/books" className="text-2xl font-bold text-blue-700 hover:text-blue-800">
                    Thư Viện
                  </Link>
                </div>
                <nav className="mt-4 p-2 flex-grow">
                  <Link href="/books" className="flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-blue-100 hover:text-blue-700">
                    Quản lý Sách
                  </Link>
                  <Link href="/authors" className="flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-blue-100 hover:text-blue-700">
                    Quản lý Tác Giả
                  </Link>
                  <Link href="/genres" className="flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-blue-100 hover:text-blue-700">
                    Quản lý Thể Loại
                  </Link>
                  <Link href="/readers" className="flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-blue-100 hover:text-blue-700">
                    Quản lý Độc Giả
                  </Link>
                  <Link href="/borrows" className="flex items-center p-3 my-1 rounded-lg text-gray-700 transition duration-200 hover:bg-blue-100 hover:text-blue-700">
                    Quản lý Mượn/Trả
                  </Link>
                </nav>
                <div className="p-2 border-t">
                  <LogoutButton />
                </div>
              </aside>
            )}
            {/* Thêm padding cho nội dung chính để giao diện đẹp hơn */}
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </AppDataProvider>
      </body>
    </html>
  );
}

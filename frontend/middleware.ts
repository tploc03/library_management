// File: frontend/middleware.ts
// Mục đích: Bảo vệ các trang, yêu cầu đăng nhập trước khi truy cập.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lấy token từ cookie của trình duyệt
  const accessToken = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Các trang công khai không cần đăng nhập
  const publicPaths = ['/login', '/register'];

  // Nếu người dùng đã đăng nhập (có token)
  if (accessToken) {
    // và họ đang cố truy cập trang login/register, chuyển hướng họ vào trang chính
    if (publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/books', request.url));
    }
  } 
  // Nếu người dùng chưa đăng nhập (không có token)
  else {
    // và họ đang cố truy cập một trang được bảo vệ, chuyển hướng họ về trang login
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Nếu không thuộc các trường hợp trên, cho phép truy cập
  return NextResponse.next();
}

// Cấu hình để middleware chỉ chạy trên các đường dẫn được chỉ định
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

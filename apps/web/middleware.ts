import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  const { pathname } = request.nextUrl;

  if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/rentals'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/rentals/:path*'],
};
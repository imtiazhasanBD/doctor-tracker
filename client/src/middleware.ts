import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuth = request.cookies.has('dt_auth') || request.cookies.has('dt_token');

  // Root path: send authenticated users to dashboard, first-time/guest visitors straight to login
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(hasAuth ? '/dashboard' : '/login', request.url)
    );
  }

  // Protected pages: redirect to login before page loads if no auth session exists
  if (!hasAuth) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/doctors') ||
      pathname.startsWith('/patients')
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Login page: redirect already logged-in users directly to dashboard
  if (hasAuth && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/doctors/:path*',
    '/patients/:path*',
    '/login',
  ],
};

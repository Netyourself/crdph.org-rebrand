import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (req.nextUrl.pathname.startsWith('/admin') && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl.origin));
  }

  // Pass the path to the admin layout so it can tell "logged out on the
  // login page" apart from "logged out on a protected page".
  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
});

export const config = { matcher: ['/admin/:path*'] };

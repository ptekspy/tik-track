import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';

// Routes that don't require authentication
const publicRoutes = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public route (exact match only for root, otherwise check if path starts with route)
  const isPublicRoute = publicRoutes.has(pathname) || 
    Array.from(publicRoutes).some(route => route !== '/' && pathname.startsWith(route + '/'));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow all API routes to pass through (they handle their own auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for session
  const { data: session } = await betterFetch<any>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  // Redirect to login if not authenticated
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

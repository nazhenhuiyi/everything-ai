import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  // Logic for Login Page
  if (pathname === '/login') {
    // If user is already logged in, redirect to home
    if (token && token.value) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise allow access to login page
    return NextResponse.next()
  }

  // Logic for Protected Routes
  // If no token is present, redirect to login page
  if (!token || !token.value) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (common image formats)
     */
    '/((?!api/login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

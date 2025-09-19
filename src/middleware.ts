import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminRouteMiddleware } from '@/lib/admin/middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for API routes to prevent redirect loops
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminResponse = await adminRouteMiddleware(request)
    if (adminResponse) {
      return adminResponse
    }
  }

  // Allow all other requests to proceed normally
  return NextResponse.next()
}

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
}
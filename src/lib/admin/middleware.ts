import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import { AdminRole, AdminUser, canAccessResource, AdminAction } from '@/types/admin'
import { logAdminAction } from './audit'
import { AdminAuthError, PermissionDeniedError, SessionExpiredError } from './errors'

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production'
const ADMIN_TOKEN_COOKIE = 'domani_admin_token'
const ADMIN_REFRESH_COOKIE = 'domani_admin_refresh'

// Token configuration
const ACCESS_TOKEN_DURATION = 4 * 60 * 60 * 1000 // 4 hours (more reasonable for admin dashboard)
const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Secret key for JWT signing
const secret = new TextEncoder().encode(JWT_SECRET)

/**
 * Admin session payload stored in JWT
 */
export interface AdminSessionPayload {
  userId: string
  adminId: string
  email: string
  role: AdminRole
  permissions: Record<string, any>
  sessionId: string
  issuedAt: number
  expiresAt: number
}

/**
 * Options for withAdminAuth HOF
 */
export interface AdminAuthOptions {
  requiredRole?: AdminRole
  requiredPermission?: {
    resource: string
    action: AdminAction
  }
  allowExpiredRefresh?: boolean
  skipAuditLog?: boolean
}

/**
 * Verify and decode admin JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    })

    // Check expiration
    if (payload.expiresAt && Date.now() > (payload.expiresAt as number)) {
      return null
    }

    return payload as unknown as AdminSessionPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Create a new admin JWT token
 */
export async function createAdminToken(payload: Omit<AdminSessionPayload, 'issuedAt' | 'expiresAt'>): Promise<string> {
  const now = Date.now()
  const expiresAt = now + ACCESS_TOKEN_DURATION

  const token = await new SignJWT({
    ...payload,
    issuedAt: now,
    expiresAt
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(secret)

  return token
}

/**
 * Create a refresh token
 */
export async function createRefreshToken(userId: string, sessionId: string): Promise<string> {
  const now = Date.now()
  const expiresAt = now + REFRESH_TOKEN_DURATION

  const token = await new SignJWT({
    userId,
    sessionId,
    type: 'refresh',
    issuedAt: now,
    expiresAt
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

/**
 * Get admin session from request cookies
 */
export async function getAdminSession(_request: NextRequest): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  return verifyAdminToken(token)
}

/**
 * Set admin cookies with secure configuration
 */
export function setAdminCookies(response: NextResponse, accessToken: string, refreshToken?: string) {
  const isProduction = process.env.NODE_ENV === 'production'

  // Set access token cookie
  response.cookies.set(ADMIN_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_DURATION / 1000 // Convert to seconds
  })

  // Set refresh token cookie if provided
  if (refreshToken) {
    response.cookies.set(ADMIN_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_DURATION / 1000 // Convert to seconds
    })
  }
}

/**
 * Clear admin cookies
 */
export function clearAdminCookies(response: NextResponse) {
  response.cookies.delete(ADMIN_TOKEN_COOKIE)
  response.cookies.delete(ADMIN_REFRESH_COOKIE)
}

/**
 * Check if user has required role level
 */
export function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleLevels: Record<AdminRole, number> = {
    [AdminRole.SuperAdmin]: 100,
    [AdminRole.Admin]: 75,
    [AdminRole.Editor]: 50,
    [AdminRole.Viewer]: 25
  }

  return roleLevels[userRole] >= roleLevels[requiredRole]
}

/**
 * Higher-order function to wrap API routes with admin authentication
 *
 * @example
 * export const GET = withAdminAuth(
 *   async (request, { admin }) => {
 *     // Admin is authenticated and available here
 *     return NextResponse.json({ admin })
 *   },
 *   { requiredRole: AdminRole.Admin }
 * )
 */
export function withAdminAuth<T extends any[] = []>(
  handler: (request: NextRequest, context: { admin: AdminSessionPayload, params?: any }) => Promise<NextResponse>,
  options: AdminAuthOptions = {}
) {
  return async function authenticatedHandler(request: NextRequest, ...args: T): Promise<NextResponse> {
    try {
      // Get admin session from cookies
      const session = await getAdminSession(request)

      // Check if user is authenticated
      if (!session) {
        // Check if we should try refresh token
        if (options.allowExpiredRefresh) {
          const cookieStore = await cookies()
          const refreshToken = cookieStore.get(ADMIN_REFRESH_COOKIE)?.value

          if (refreshToken) {
            // Attempt to refresh (implement refresh logic in auth.ts)
            return NextResponse.json(
              { error: 'Token expired. Please refresh.' },
              { status: 401 }
            )
          }
        }

        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Check role requirements
      if (options.requiredRole && !hasRequiredRole(session.role, options.requiredRole)) {
        // Log permission denied attempt
        if (!options.skipAuditLog) {
          await logAdminAction({
            userId: session.userId,
            adminId: session.adminId,
            action: 'login_error',
            resource: request.nextUrl.pathname,
            metadata: {
              requiredRole: options.requiredRole,
              userRole: session.role
            }
          }).catch(console.error) // Don't block on audit logging
        }

        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      // Check specific permission requirements
      if (options.requiredPermission) {
        const hasPermission = canAccessResource(
          { role: session.role, is_active: true } as AdminUser,
          options.requiredPermission.resource,
          options.requiredPermission.action
        )

        if (!hasPermission) {
          // Log permission denied attempt
          if (!options.skipAuditLog) {
            await logAdminAction({
              userId: session.userId,
              adminId: session.adminId,
              action: 'login_error',
              resource: options.requiredPermission.resource,
              metadata: {
                requiredAction: options.requiredPermission.action,
                userRole: session.role
              }
            }).catch(console.error)
          }

          return NextResponse.json(
            { error: 'Permission denied for this action' },
            { status: 403 }
          )
        }
      }

      // Extract params from args if they exist
      const params = args.length > 0 && typeof args[0] === 'object' && 'params' in args[0]
        ? args[0].params
        : undefined

      // Call the wrapped handler with admin context
      const response = await handler(request, { admin: session, params })

      // Log successful action if not skipped
      if (!options.skipAuditLog) {
        await logAdminAction({
          userId: session.userId,
          adminId: session.adminId,
          action: 'read',
          resource: request.nextUrl.pathname,
          metadata: {
            method: request.method,
            status: response.status
          }
        }).catch(console.error)
      }

      return response

    } catch (error) {
      console.error('Admin auth middleware error:', error)

      // Handle specific error types
      if (error instanceof AdminAuthError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }

      if (error instanceof PermissionDeniedError) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }

      if (error instanceof SessionExpiredError) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }

      // Generic error response
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware for protecting admin routes at the edge
 * This is for the main Next.js middleware file
 */
export async function adminRouteMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Only process admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return null
  }

  // Skip the login and unauthorized pages
  if (request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname === '/admin/unauthorized') {
    return null
  }

  // Check for admin token
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value

  if (!token) {
    // Redirect to login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token (optimistic check only)
  const session = await verifyAdminToken(token)

  if (!session) {
    // Token is invalid or expired, redirect to login
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    const response = NextResponse.redirect(loginUrl)

    // Clear invalid cookies
    clearAdminCookies(response)

    return response
  }

  // Check route-specific permissions based on pathname patterns
  const routePermissions: Record<string, { role?: AdminRole, permission?: { resource: string, action: AdminAction } }> = {
    '/admin/users': { role: AdminRole.Admin },
    '/admin/campaigns': { role: AdminRole.Editor },
    '/admin/analytics': { role: AdminRole.Viewer },
    '/admin/settings': { role: AdminRole.SuperAdmin },
    '/admin/audit': { role: AdminRole.SuperAdmin }
  }

  // Find matching route pattern
  const matchedRoute = Object.keys(routePermissions).find(pattern =>
    request.nextUrl.pathname.startsWith(pattern)
  )

  if (matchedRoute) {
    const requirements = routePermissions[matchedRoute]

    // Check role requirement
    if (requirements.role && !hasRequiredRole(session.role, requirements.role)) {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
    }

    // Check specific permission
    if (requirements.permission) {
      const mockUser = { role: session.role, is_active: true } as AdminUser
      const hasPermission = canAccessResource(
        mockUser,
        requirements.permission.resource,
        requirements.permission.action
      )

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url))
      }
    }
  }

  // Allow the request to proceed
  return null
}

/**
 * Extract user info from request for audit logging
 */
export function extractRequestMetadata(request: NextRequest) {
  return {
    ip: request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || undefined,
    method: request.method,
    path: request.nextUrl.pathname,
    timestamp: new Date().toISOString()
  }
}
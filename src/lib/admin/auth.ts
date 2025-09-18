import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import {
  AdminUser,
  AdminRole,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminUserWithDetails
} from '@/types/admin'
import {
  createAdminToken,
  createRefreshToken,
  AdminSessionPayload,
  verifyAdminToken
} from './middleware'
import { logAdminAction } from './audit'
import { AdminAuthError } from './errors'
import { nanoid } from 'nanoid'

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>()

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

/**
 * Check rate limiting for login attempts
 */
export function checkLoginRateLimit(identifier: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)

  // Clean up old entries periodically
  if (loginAttempts.size > 1000) {
    for (const [key, value] of loginAttempts.entries()) {
      if (value.lockedUntil && value.lockedUntil < now) {
        loginAttempts.delete(key)
      }
    }
  }

  if (!attempts) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS }
  }

  // Check if currently locked out
  if (attempts.lockedUntil && attempts.lockedUntil > now) {
    return {
      allowed: false,
      lockedUntil: attempts.lockedUntil,
      remainingAttempts: 0
    }
  }

  // Reset if lockout has expired
  if (attempts.lockedUntil && attempts.lockedUntil <= now) {
    loginAttempts.delete(identifier)
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS }
  }

  return {
    allowed: true,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count
  }
}

/**
 * Record a login attempt
 */
export function recordLoginAttempt(identifier: string, success: boolean) {
  if (success) {
    loginAttempts.delete(identifier)
    return
  }

  const attempts = loginAttempts.get(identifier) || { count: 0 }
  attempts.count++

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = Date.now() + LOCKOUT_DURATION
  }

  loginAttempts.set(identifier, attempts)
}

/**
 * Authenticate admin user with email and password
 */
export async function authenticateAdmin(
  credentials: AdminLoginRequest,
  request?: NextRequest
): Promise<AdminLoginResponse> {
  const { email, password } = credentials

  // Check rate limiting
  const rateLimit = checkLoginRateLimit(email.toLowerCase())
  if (!rateLimit.allowed) {
    const minutesRemaining = Math.ceil((rateLimit.lockedUntil! - Date.now()) / 60000)
    throw new AdminAuthError(
      `Account temporarily locked. Try again in ${minutesRemaining} minutes.`,
      429
    )
  }

  if (!supabaseAdmin) {
    throw new AdminAuthError('Authentication service unavailable', 503)
  }

  try {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      recordLoginAttempt(email.toLowerCase(), false)

      // Log failed login attempt
      await logAdminAction({
        userId: email,
        adminId: undefined,
        action: 'login_failed',
        resource: 'admin_auth',
        metadata: {
          reason: authError?.message || 'Invalid credentials',
          remainingAttempts: rateLimit.remainingAttempts! - 1,
          ip: request?.headers.get('x-forwarded-for') || 'unknown'
        }
      }).catch(console.error)

      throw new AdminAuthError(
        `Invalid credentials. ${rateLimit.remainingAttempts! - 1} attempts remaining.`,
        401
      )
    }

    // Check if user has admin privileges
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select(`
        *,
        user:auth.users!admin_users_user_id_fkey (
          email,
          created_at,
          last_sign_in_at,
          user_metadata
        )
      `)
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      recordLoginAttempt(email.toLowerCase(), false)

      // Log unauthorized access attempt
      await logAdminAction({
        userId: authData.user.id,
        adminId: undefined,
        action: 'unauthorized_access',
        resource: 'admin_panel',
        metadata: {
          email,
          ip: request?.headers.get('x-forwarded-for') || 'unknown'
        }
      }).catch(console.error)

      // Sign out the user since they don't have admin access
      await supabaseAdmin.auth.signOut()

      throw new AdminAuthError('You do not have admin access', 403)
    }

    // Clear rate limiting on successful login
    recordLoginAttempt(email.toLowerCase(), true)

    // Update last login timestamp
    await supabaseAdmin
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        failed_login_attempts: 0,
        locked_until: null
      })
      .eq('id', adminUser.id)

    // Create session ID
    const sessionId = nanoid()

    // Create JWT tokens
    const accessToken = await createAdminToken({
      userId: authData.user.id,
      adminId: adminUser.id,
      email: adminUser.user.email,
      role: adminUser.role as AdminRole,
      permissions: adminUser.permissions || {},
      sessionId
    })

    const refreshToken = await createRefreshToken(authData.user.id, sessionId)

    // Store session in database
    await supabaseAdmin
      .from('admin_sessions')
      .insert({
        id: sessionId,
        admin_user_id: adminUser.id,
        token_hash: await hashToken(accessToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ip_address: request?.headers.get('x-forwarded-for') || null,
        user_agent: request?.headers.get('user-agent') || null
      })

    // Log successful login
    await logAdminAction({
      userId: authData.user.id,
      adminId: adminUser.id,
      action: 'login_success',
      resource: 'admin_auth',
      metadata: {
        role: adminUser.role,
        sessionId,
        ip: request?.headers.get('x-forwarded-for') || 'unknown'
      }
    }).catch(console.error)

    return {
      user: adminUser as AdminUserWithDetails,
      session: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Date.now() + 15 * 60 * 1000 // 15 minutes
      }
    }

  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error
    }

    console.error('Authentication error:', error)
    throw new AdminAuthError('Authentication failed', 500)
  }
}

/**
 * Refresh admin access token using refresh token
 */
export async function refreshAdminSession(
  refreshToken: string,
  request?: NextRequest
): Promise<{ accessToken: string; expiresAt: number }> {
  try {
    // Verify refresh token
    const payload = await verifyAdminToken(refreshToken)

    if (!payload || payload.type !== 'refresh') {
      throw new AdminAuthError('Invalid refresh token', 401)
    }

    if (!supabaseAdmin) {
      throw new AdminAuthError('Authentication service unavailable', 503)
    }

    // Get admin user details
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select(`
        *,
        user:auth.users!admin_users_user_id_fkey (
          email
        )
      `)
      .eq('user_id', payload.userId)
      .eq('is_active', true)
      .single()

    if (error || !adminUser) {
      throw new AdminAuthError('Admin user not found or inactive', 401)
    }

    // Verify session exists and is valid
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('id', payload.sessionId)
      .eq('admin_user_id', adminUser.id)
      .single()

    if (sessionError || !session) {
      throw new AdminAuthError('Session not found', 401)
    }

    if (new Date(session.expires_at) < new Date()) {
      throw new AdminAuthError('Session expired', 401)
    }

    // Create new access token
    const accessToken = await createAdminToken({
      userId: payload.userId,
      adminId: adminUser.id,
      email: adminUser.user.email,
      role: adminUser.role as AdminRole,
      permissions: adminUser.permissions || {},
      sessionId: payload.sessionId
    })

    // Update session activity
    await supabaseAdmin
      .from('admin_sessions')
      .update({
        last_activity_at: new Date().toISOString(),
        token_hash: await hashToken(accessToken)
      })
      .eq('id', payload.sessionId)

    // Log token refresh
    await logAdminAction({
      userId: payload.userId,
      adminId: adminUser.id,
      action: 'token_refresh',
      resource: 'admin_auth',
      metadata: {
        sessionId: payload.sessionId,
        ip: request?.headers.get('x-forwarded-for') || 'unknown'
      }
    }).catch(console.error)

    return {
      accessToken,
      expiresAt: Date.now() + 15 * 60 * 1000
    }

  } catch (error) {
    if (error instanceof AdminAuthError) {
      throw error
    }

    console.error('Token refresh error:', error)
    throw new AdminAuthError('Failed to refresh session', 500)
  }
}

/**
 * Logout admin user and invalidate session
 */
export async function logoutAdmin(
  sessionPayload: AdminSessionPayload,
  request?: NextRequest
): Promise<void> {
  if (!supabaseAdmin) {
    throw new AdminAuthError('Authentication service unavailable', 503)
  }

  try {
    // Invalidate session in database
    await supabaseAdmin
      .from('admin_sessions')
      .update({
        invalidated_at: new Date().toISOString()
      })
      .eq('id', sessionPayload.sessionId)

    // Sign out from Supabase
    await supabaseAdmin.auth.signOut()

    // Log logout
    await logAdminAction({
      userId: sessionPayload.userId,
      adminId: sessionPayload.adminId,
      action: 'logout',
      resource: 'admin_auth',
      metadata: {
        sessionId: sessionPayload.sessionId,
        ip: request?.headers.get('x-forwarded-for') || 'unknown'
      }
    }).catch(console.error)

  } catch (error) {
    console.error('Logout error:', error)
    throw new AdminAuthError('Failed to logout', 500)
  }
}

/**
 * Verify admin user has required permissions
 */
export async function verifyAdminPermissions(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  if (!supabaseAdmin) {
    return false
  }

  try {
    // Get user's admin role and permissions
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('role, permissions')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error || !adminUser) {
      return false
    }

    // Super admins have all permissions
    if (adminUser.role === AdminRole.SuperAdmin) {
      return true
    }

    // Check permissions table
    const { data: permission, error: permError } = await supabaseAdmin
      .from('admin_permissions')
      .select('*')
      .eq('role', adminUser.role)
      .eq('resource', resource)
      .eq('action', action)
      .single()

    return !permError && !!permission

  } catch (error) {
    console.error('Permission verification error:', error)
    return false
  }
}

/**
 * Get all active admin sessions for a user
 */
export async function getAdminSessions(adminUserId: string): Promise<any[]> {
  if (!supabaseAdmin) {
    throw new AdminAuthError('Authentication service unavailable', 503)
  }

  try {
    const { data: sessions, error } = await supabaseAdmin
      .from('admin_sessions')
      .select('*')
      .eq('admin_user_id', adminUserId)
      .is('invalidated_at', null)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return sessions || []

  } catch (error) {
    console.error('Failed to get admin sessions:', error)
    throw new AdminAuthError('Failed to retrieve sessions', 500)
  }
}

/**
 * Invalidate all sessions for an admin user (except current)
 */
export async function invalidateAllSessions(
  adminUserId: string,
  exceptSessionId?: string
): Promise<void> {
  if (!supabaseAdmin) {
    throw new AdminAuthError('Authentication service unavailable', 503)
  }

  try {
    const query = supabaseAdmin
      .from('admin_sessions')
      .update({ invalidated_at: new Date().toISOString() })
      .eq('admin_user_id', adminUserId)
      .is('invalidated_at', null)

    if (exceptSessionId) {
      query.neq('id', exceptSessionId)
    }

    await query

  } catch (error) {
    console.error('Failed to invalidate sessions:', error)
    throw new AdminAuthError('Failed to invalidate sessions', 500)
  }
}

/**
 * Hash token for storage (simple implementation, consider using bcrypt in production)
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Generate a temporary one-time password for admin 2FA (future implementation)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
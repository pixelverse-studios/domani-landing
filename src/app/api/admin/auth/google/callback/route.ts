import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminAuditLog } from '@/lib/admin/audit'
import { isEmailAllowedAdmin } from '@/lib/admin/config'
import { createAdminToken, createRefreshToken, setAdminCookies } from '@/lib/admin/middleware'
import { AdminRole } from '@/types/admin'
import { nanoid } from 'nanoid'

/**
 * Hash token for storage
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/admin'
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Handle OAuth errors from Supabase
  if (error) {
    console.error('OAuth error from Supabase:', { error, errorDescription })

    // Try to log the error - use a generic action if specific one doesn't exist
    try {
      await createAdminAuditLog({
        action: 'login_attempt',
        userId: null,  // No auth user available yet
        adminId: null,
        details: {
          provider: 'google',
          error,
          errorDescription,
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })
    } catch (auditError) {
      console.error('Failed to log OAuth error:', auditError)
    }

    // Map common errors to user-friendly messages
    let loginError = 'auth_failed'
    if (error === 'access_denied') {
      loginError = 'access_denied'
    } else if (errorDescription?.includes('confirmation_token')) {
      loginError = 'email_not_confirmed'
    }

    return NextResponse.redirect(
      new URL(`/admin/login?error=${loginError}`, requestUrl.origin)
    )
  }

  if (!code) {
    // If there's no code, redirect to login with error
    return NextResponse.redirect(
      new URL('/admin/login?error=no_code', requestUrl.origin)
    )
  }

  try {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError || !session) {
      console.error('Failed to exchange code for session:', sessionError)

      await createAdminAuditLog({
        action: 'login_attempt',
        userId: null,  // Session failed to create
        adminId: null,
        details: {
          error: sessionError?.message || 'No session created',
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })

      return NextResponse.redirect(
        new URL('/admin/login?error=auth_failed', requestUrl.origin)
      )
    }

    const userEmail = session.user.email

    if (!userEmail) {
      await createAdminAuditLog({
        action: 'login_attempt',
        userId: session.user.id,  // Auth user exists
        adminId: null,
        details: {
          reason: 'no_email',
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })

      return NextResponse.redirect(
        new URL('/admin/login?error=no_email', requestUrl.origin)
      )
    }

    // First check if email is allowed (server-side check)
    const emailAllowed = isEmailAllowedAdmin(userEmail)

    if (!emailAllowed) {
      // Sign out the user since they're not allowed
      await supabase.auth.signOut()

      await createAdminAuditLog({
        action: 'login_attempt',
        userId: session.user.id,  // Auth user exists
        adminId: null,  // No admin profile
        details: {
          email: userEmail,
          reason: 'email_not_allowed',
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })

      return NextResponse.redirect(
        new URL('/admin/unauthorized?reason=email_not_allowed', requestUrl.origin)
      )
    }

    // Then verify if the user exists in admin_users table
    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('user_id', session.user.id)
      .single()

    const isAdmin = adminCheck && adminCheck.is_active === true

    if (!isAdmin) {
      // Sign out the user since they're not an admin
      await supabase.auth.signOut()

      await createAdminAuditLog({
        action: 'login_attempt',
        userId: session.user.id,  // Auth user exists
        adminId: adminCheck?.id || null,  // Admin profile may exist but not active
        details: {
          email: userEmail,
          reason: 'not_admin_or_inactive',
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })

      return NextResponse.redirect(
        new URL('/admin/unauthorized?reason=not_admin', requestUrl.origin)
      )
    }

    // Create or update admin session in database
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, user_id, role, permissions, metadata')
      .eq('user_id', session.user.id)
      .single()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()

      await createAdminAuditLog({
        action: 'login_attempt',
        userId: session.user.id,  // Auth user exists
        adminId: null,  // Admin profile not found
        details: {
          email: userEmail,
          error: adminError?.message,
          ipAddress,
          userAgent,
        },
        status: 'failure',
        ipAddress,
        userAgent,
      })

      return NextResponse.redirect(
        new URL('/admin/login?error=admin_not_found', requestUrl.origin)
      )
    }

    // Update last login time
    await supabase
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        metadata: {
          ...adminUser.metadata,
          google_auth: true,
          last_provider: 'google'
        }
      })
      .eq('id', adminUser.id)

    // Create session ID for admin session management
    const sessionId = nanoid()

    // Create JWT tokens for admin session
    const accessToken = await createAdminToken({
      userId: session.user.id,
      adminId: adminUser.id,
      email: userEmail,
      role: adminUser.role as AdminRole,
      permissions: adminUser.permissions || {},
      sessionId
    })

    const refreshToken = await createRefreshToken(session.user.id, sessionId)

    // Store session in database
    await supabase
      .from('admin_sessions')
      .insert({
        id: sessionId,
        admin_user_id: adminUser.id,
        token_hash: await hashToken(accessToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })

    // Log successful login
    await createAdminAuditLog({
      action: 'login',
      userId: session.user.id,  // Auth user
      adminId: adminUser.id,     // Admin profile
      details: {
        email: userEmail,
        provider: 'google',
        sessionId,
        ipAddress,
        userAgent,
      },
      status: 'success',
      ipAddress,
      userAgent,
    })

    // Create response with redirect
    const response = NextResponse.redirect(new URL(next, requestUrl.origin))

    // Set admin cookies
    setAdminCookies(response, accessToken, refreshToken)

    return response

  } catch (error) {
    console.error('Google OAuth callback error:', error)

    await createAdminAuditLog({
      action: 'login_attempt',
      userId: null,  // Unknown state
      adminId: null,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress,
        userAgent,
      },
      status: 'failure',
      ipAddress,
      userAgent,
    })

    return NextResponse.redirect(
      new URL('/admin/login?error=callback_error', requestUrl.origin)
    )
  }
}
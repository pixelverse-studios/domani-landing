import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This endpoint captures what session data Google OAuth provides
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!session && !user) {
      return NextResponse.json({
        message: 'No active session. Please try logging in with Google first.',
        instructions: [
          '1. Go to /admin/login',
          '2. Click "Sign in with Google"',
          '3. Complete the Google login',
          '4. When redirected back (even if to login page), immediately visit this URL again',
          '5. The session data will be captured'
        ]
      })
    }

    // If we have a session, check the admin_users table
    let adminCheck = null
    let adminError = null
    if (session?.user?.id || user?.id) {
      const userId = session?.user?.id || user?.id
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single()
      adminCheck = data
      adminError = error
    }

    return NextResponse.json({
      session: {
        exists: !!session,
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata?.provider,
          providers: session.user.app_metadata?.providers,
          emailVerified: session.user.email_confirmed_at,
          metadata: session.user.user_metadata
        } : null,
        expiresAt: session?.expires_at
      },
      user: user ? {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at
      } : null,
      adminCheck: {
        data: adminCheck,
        error: adminError?.message,
        isAdmin: adminCheck?.is_active === true
      },
      diagnosis: !session && !user ? 'No session - need to login first' :
                 session?.user?.id !== 'f48d81d9-ab36-430b-b6bd-2e5f21e276a4' ?
                   `⚠️ User ID mismatch! Expected f48d81d9... but got ${session?.user?.id}` :
                 adminCheck?.is_active ? '✅ Everything looks good!' :
                 '❌ Admin record not active or not found'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get session',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
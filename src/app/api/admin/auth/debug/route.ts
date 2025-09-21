import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Debug endpoint to check the current auth state
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const cookieStore = await cookies()

    // Get Supabase session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    // Check admin cookies
    const adminToken = cookieStore.get('domani_admin_token')
    const adminRefresh = cookieStore.get('domani_admin_refresh')

    // Check admin status if we have a user
    let adminStatus = null
    if (user?.id) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      adminStatus = {
        data,
        error: error?.message,
        isAdmin: data?.is_active === true
      }
    }

    // Get current origin for OAuth URLs
    const origin = new URL(request.url).origin

    return NextResponse.json({
      debug: true,
      timestamp: new Date().toISOString(),
      environment: {
        origin,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        expectedCallbackUrl: `${origin}/api/admin/auth/google/callback`,
      },
      supabaseAuth: {
        hasSession: !!session,
        hasUser: !!user,
        sessionError: sessionError?.message,
        userError: userError?.message,
        userId: user?.id,
        userEmail: user?.email,
        provider: user?.app_metadata?.provider,
      },
      adminCookies: {
        hasToken: !!adminToken,
        hasRefresh: !!adminRefresh,
      },
      adminStatus,
      diagnosis: {
        supabaseAuthOk: !!session && !!user,
        adminCookiesOk: !!adminToken && !!adminRefresh,
        isFullyAuthenticated: !!session && !!user && adminStatus?.isAdmin && !!adminToken,
        issues: [
          !session && 'No Supabase session',
          !user && 'No Supabase user',
          !adminStatus?.isAdmin && 'Not an admin in database',
          !adminToken && 'No admin token cookie',
        ].filter(Boolean),
      },
      nextSteps: !session ?
        'Need to authenticate with Google first at /admin/login' :
        !adminStatus?.isAdmin ?
        'User is authenticated but not an admin. Check admin_users table.' :
        !adminToken ?
        'User is admin but no admin token. Try logging out and back in.' :
        'Everything looks good!'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isEmailAllowedAdmin } from '@/lib/admin/config'
// import { createServiceRoleClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') || 'arfusop@gmail.com'
  const key = request.nextUrl.searchParams.get('key')

  if (key !== 'debug-403-sami') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Use regular client for admin_users (public table)
    const supabase = await createClient()

    // Check if email is allowed
    const emailAllowed = isEmailAllowedAdmin(email)

    // Try to get admin record by joining with auth.users
    // This might work if the join is allowed
    const { data: adminWithUser, error: joinError } = await supabase
      .from('admin_users')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .eq('user.email', email)
      .single()

    // Alternative: Get admin by user_id if we know it
    const userId = 'f48d81d9-ab36-430b-b6bd-2e5f21e276a4' // Known user_id for arfusop
    const { data: adminByUserId, error: directError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Check JWT secret
    const jwtSecretSet = !!process.env.JWT_SECRET

    // Check current user session
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Test: Can we query admin_users directly?
    const { data: allAdmins, error: allAdminsError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5)

    return NextResponse.json({
      email,
      targetUserId: userId,
      checks: {
        step1_emailAllowed: emailAllowed,
        step2_adminRecordByUserId: !!adminByUserId,
        step3_adminIsActive: adminByUserId?.is_active || false,
        step4_jwtSecretSet: jwtSecretSet,
        step5_currentSession: !!currentUser
      },
      details: {
        adminByUserId: adminByUserId || null,
        adminWithUser: adminWithUser || null,
        joinError: joinError?.message || null,
        directError: directError?.message || null,
        currentUserEmail: currentUser?.email || 'No active session',
        allAdminsCount: allAdmins?.length || 0,
        allAdminsError: allAdminsError?.message || null
      },
      diagnosis: !emailAllowed ? '❌ Email not in allowed list' :
                 !adminByUserId ? '❌ Admin record not found by user_id' :
                 !adminByUserId.is_active ? '❌ Admin record is inactive' :
                 !jwtSecretSet ? '❌ JWT_SECRET not set in environment' :
                 '✅ Admin record exists and is active - the issue is in the callback flow'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
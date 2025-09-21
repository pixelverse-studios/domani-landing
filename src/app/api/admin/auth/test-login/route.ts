import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isEmailAllowedAdmin } from '@/lib/admin/config'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') || 'arfusop@gmail.com'
  const key = request.nextUrl.searchParams.get('key')

  if (key !== 'debug-403-sami') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Check if email is allowed
    const emailAllowed = isEmailAllowedAdmin(email)

    // Check if user exists
    const { data: authUser } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single()

    // Check admin record
    let adminUser = null
    let adminError = null
    if (authUser) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', authUser.id)
        .single()
      adminUser = data
      adminError = error
    }

    // Check JWT secret
    const jwtSecretSet = !!process.env.JWT_SECRET

    return NextResponse.json({
      email,
      checks: {
        step1_emailAllowed: emailAllowed,
        step2_userExists: !!authUser,
        step3_adminRecordExists: !!adminUser,
        step4_adminIsActive: adminUser?.is_active || false,
        step5_jwtSecretSet: jwtSecretSet
      },
      details: {
        authUser: authUser || 'User not found in auth.users',
        adminUser: adminUser || 'Admin record not found',
        adminError: adminError?.message || null
      },
      diagnosis: !emailAllowed ? '❌ Email not in allowed list' :
                 !authUser ? '❌ User needs to attempt login first' :
                 !adminUser ? '❌ Admin record missing - create it' :
                 !adminUser.is_active ? '❌ Admin record is inactive' :
                 !jwtSecretSet ? '❌ JWT_SECRET not set in environment' :
                 '✅ Everything looks good - login should work'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
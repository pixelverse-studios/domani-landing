import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Only show this in development or with a secret key for security
  const secretKey = request.nextUrl.searchParams.get('key')

  if (process.env.NODE_ENV === 'production' && secretKey !== 'debug-403-sami') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminEmails = process.env.ADMIN_ALLOWED_EMAILS
  const emailList = adminEmails ? adminEmails.split(',').map(e => e.trim()) : []

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    adminConfig: {
      ADMIN_ALLOWED_EMAILS: adminEmails ? 'SET' : 'NOT SET ❌',
      emailCount: emailList.length,
      emails: process.env.NODE_ENV === 'development' ? emailList : 'hidden in production',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET ❌',
    },
    supabaseConfig: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    },
    siteConfig: {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
    },
    diagnosis: !adminEmails
      ? '❌ ADMIN_ALLOWED_EMAILS is not set - this is why you get email_not_allowed error'
      : '✅ Environment variables appear to be configured'
  })
}
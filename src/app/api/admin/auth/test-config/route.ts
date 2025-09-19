import { NextResponse } from 'next/server'

export async function GET() {
  // Only show in development or for debugging
  const isDevelopment = process.env.NODE_ENV === 'development'

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    expectedCallbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/auth/google/callback`,
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'server-side',
    message: isDevelopment ? 'Full config visible in development' : 'Limited config in production',
  })
}
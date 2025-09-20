import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors
  if (error) {
    console.error('Auth callback error:', { error, errorDescription })
    return NextResponse.redirect(
      new URL(`/admin/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  if (code) {
    try {
      const supabase = await createClient()

      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        return NextResponse.redirect(
          new URL('/admin/login?error=invalid_code', requestUrl.origin)
        )
      }

      // Successful authentication - redirect to the intended page
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL('/admin/login?error=callback_error', requestUrl.origin)
      )
    }
  }

  // No code provided
  return NextResponse.redirect(
    new URL('/admin/login?error=no_code', requestUrl.origin)
  )
}
import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

interface CountResponse {
  count: number
  mock?: boolean
  error?: boolean
}

// Removed edge runtime to allow access to server-side environment variables
// export const runtime = 'edge'
export const revalidate = 60 // Cache for 1 minute

export async function GET() {
  try {
    // Use supabaseAdmin for counting to bypass RLS policies
    // This is safe as we're only returning a count, not exposing user data
    const clientToUse = supabaseAdmin || supabase

    // If Supabase is not configured, return a mock count
    if (!clientToUse) {
      console.log('No Supabase client available, returning mock')
      return NextResponse.json<CountResponse>(
        { count: 1247, mock: true },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
          }
        }
      )
    }

    // Fetch the count from the waitlist table using admin client
    const { count, error } = await clientToUse
      .from('waitlist')
      .select('*', { count: 'exact', head: true })


    if (error) {
      console.error('Error fetching user count:', error)
      // Return a fallback count if there's an error
      return NextResponse.json<CountResponse>(
        { count: 1000, error: true },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
          }
        }
      )
    }

    return NextResponse.json<CountResponse>(
      { count: count || 0 },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error fetching user count:', error)
    return NextResponse.json(
      { count: 1000, error: true },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    )
  }
}
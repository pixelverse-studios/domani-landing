import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface CountResponse {
  count: number
  mock?: boolean
  error?: boolean
}

export const revalidate = 60 // Cache for 1 minute

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // If Supabase is not configured, return a mock count
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase not configured, returning mock count')
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

    // Create admin client at request time to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the count from the waitlist table
    const { count, error } = await supabaseAdmin
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
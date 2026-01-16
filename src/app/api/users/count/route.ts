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

    // Fetch emails from waitlist
    const { data: waitlistData, error: waitlistError } = await supabaseAdmin
      .from('waitlist')
      .select('email')

    if (waitlistError) {
      console.error('Error fetching waitlist:', waitlistError)
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

    // Fetch emails from profiles (active users)
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('email')

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Fall back to just waitlist count if profiles fails
      return NextResponse.json<CountResponse>(
        { count: waitlistData?.length || 0 },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
          }
        }
      )
    }

    // Combine and deduplicate by email
    const allEmails = new Set<string>()
    waitlistData?.forEach((row) => row.email && allEmails.add(row.email.toLowerCase()))
    profilesData?.forEach((row) => row.email && allEmails.add(row.email.toLowerCase()))

    return NextResponse.json<CountResponse>(
      { count: allEmails.size },
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
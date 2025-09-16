import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'
export const revalidate = 60 // Cache for 1 minute

export async function GET() {
  try {
    // If Supabase is not configured, return a mock count
    if (!supabase) {
      return NextResponse.json(
        { count: 1247, mock: true },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
          }
        }
      )
    }

    // Fetch the count from the waitlist table
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching user count:', error)
      // Return a fallback count if there's an error
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

    return NextResponse.json(
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
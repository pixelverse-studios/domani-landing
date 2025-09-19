import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function handleGET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%`)
    }

    // Add status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: entries, count, error } = await query

    if (error) {
      console.error('Failed to fetch waitlist:', error)
      return NextResponse.json(
        { error: 'Failed to fetch waitlist' },
        { status: 500 }
      )
    }

    // Get stats for all statuses (unfiltered counts)
    const statsQuery = supabase
      .from('waitlist')
      .select('status', { count: 'exact', head: true })

    // Apply search filter to stats if present
    if (search) {
      statsQuery.or(`email.ilike.%${search}%,first_name.ilike.%${search}%`)
    }

    const [pendingResult, invitedResult, registeredResult] = await Promise.all([
      supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .then(r => r.count || 0),
      supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'invited')
        .then(r => r.count || 0),
      supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'registered')
        .then(r => r.count || 0),
    ])

    // Transform data to match our interface
    const transformedEntries = (entries || []).map(entry => ({
      id: entry.id,
      email: entry.email,
      firstName: entry.first_name,
      source: entry.source,
      referrer: entry.referrer,
      status: entry.status || 'pending',
      createdAt: entry.created_at,
      invitedAt: entry.invited_at,
      metadata: entry.metadata,
    }))

    return NextResponse.json({
      entries: transformedEntries,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      stats: {
        pending: pendingResult,
        invited: invitedResult,
        registered: registeredResult,
      },
    })
  } catch (error) {
    console.error('Waitlist fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleDELETE(req: NextRequest) {
  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('waitlist')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Failed to delete waitlist entries:', error)
      return NextResponse.json(
        { error: 'Failed to delete entries' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${ids.length} entries`,
    })
  } catch (error) {
    console.error('Waitlist delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGET, ['viewer', 'editor', 'admin', 'super_admin'])
export const DELETE = withAdminAuth(handleDELETE, ['editor', 'admin', 'super_admin'])
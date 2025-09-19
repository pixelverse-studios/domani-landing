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
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Build query
    let query = supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    // Add search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%`)
    }

    // Add status filter
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: entries, error } = await query

    if (error) {
      console.error('Failed to export waitlist:', error)
      return NextResponse.json(
        { error: 'Failed to export waitlist' },
        { status: 500 }
      )
    }

    // Create CSV content
    const headers = ['Email', 'First Name', 'Status', 'Source', 'Referrer', 'Created At', 'Invited At']
    const rows = (entries || []).map(entry => [
      entry.email,
      entry.first_name || '',
      entry.status || 'pending',
      entry.source || '',
      entry.referrer || '',
      new Date(entry.created_at).toLocaleString(),
      entry.invited_at ? new Date(entry.invited_at).toLocaleString() : '',
    ])

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => {
          // Escape values that contain commas or quotes
          const cellStr = String(cell)
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        }).join(',')
      ),
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Waitlist export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAdminAuth(handleGET, ['viewer', 'editor', 'admin', 'super_admin'])
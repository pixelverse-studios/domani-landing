import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { AdminRole } from '@/types/admin'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function handlePATCH(req: NextRequest) {
  try {
    const { ids, status } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data: ids required' },
        { status: 400 }
      )
    }

    if (!status || !['pending', 'invited', 'registered'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, invited, or registered' },
        { status: 400 }
      )
    }

    // Update status
    const updateData: any = { status }

    // Add invited_at timestamp if status is invited
    if (status === 'invited') {
      updateData.invited_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('waitlist')
      .update(updateData)
      .in('id', ids)

    if (error) {
      console.error('Failed to update waitlist status:', error)
      return NextResponse.json(
        { error: 'Failed to update status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${ids.length} entries to ${status}`,
    })
  } catch (error) {
    console.error('Waitlist status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PATCH = withAdminAuth(handlePATCH, { requiredRole: AdminRole.Editor })
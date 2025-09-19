import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminToken } from '@/lib/admin/middleware'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('domani_admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionPayload = await verifyAdminToken(token)
    if (!sessionPayload) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get recent activity from audit logs and waitlist signups
    const activities = []

    // Get recent audit logs
    const { data: auditLogs } = await supabase
      .from('admin_audit_log')
      .select(`
        *,
        admin_user:admin_user_id(email:user_id)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get recent waitlist signups
    const { data: recentSignups } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // Combine and format activities
    if (auditLogs) {
      for (const log of auditLogs) {
        const metadata = log.metadata as any || {}
        let action = ''
        const user = metadata.email || 'System'

        // Format action based on audit log type
        switch (log.action) {
          case 'login':
            action = 'Admin login'
            break
          case 'logout':
            action = 'Admin logout'
            break
          case 'login_attempt':
            action = 'Failed login attempt'
            break
          case 'login_error':
            action = 'Login error'
            break
          case 'create':
            action = `Created ${log.resource_type}`
            break
          case 'update':
            action = `Updated ${log.resource_type}`
            break
          case 'delete':
            action = `Deleted ${log.resource_type}`
            break
          case 'export':
            action = `Exported ${log.resource_type} data`
            break
          default:
            action = log.description || log.action
        }

        activities.push({
          time: getRelativeTime(new Date(log.created_at)),
          action,
          user,
          type: 'audit',
          timestamp: log.created_at
        })
      }
    }

    if (recentSignups) {
      for (const signup of recentSignups) {
        activities.push({
          time: getRelativeTime(new Date(signup.created_at)),
          action: 'New waitlist signup',
          user: signup.email,
          type: 'signup',
          timestamp: signup.created_at
        })
      }
    }

    // Sort by timestamp and limit to 10 most recent
    activities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const recentActivity = activities.slice(0, 10).map(({ timestamp: _timestamp, ...rest }) => rest)

    return NextResponse.json({ activities: recentActivity })

  } catch (error) {
    console.error('Dashboard activity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    )
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }
}
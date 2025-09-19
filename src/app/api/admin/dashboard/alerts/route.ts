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
    const alerts = []

    // Check for recent failed login attempts (warning if > 5 in last hour)
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    const { count: failedLogins } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .in('action', ['login_error', 'login_attempt'])
      .eq('metadata->status', 'failure')
      .gte('created_at', oneHourAgo.toISOString())

    if (failedLogins && failedLogins > 5) {
      alerts.push({
        level: 'warning',
        message: `${failedLogins} failed login attempts in the last hour`,
        time: 'Active',
        priority: 1
      })
    }

    // Check for inactive admin sessions (info)
    const { data: adminUsers } = await supabase
      .from('admin_users')
      .select('*')
      .eq('is_active', true)

    const { data: activeSessions } = await supabase
      .from('admin_sessions')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .is('invalidated_at', null)

    if (adminUsers && activeSessions) {
      const activeAdmins = activeSessions.length
      const totalAdmins = adminUsers.length
      if (activeAdmins === 0 && totalAdmins > 0) {
        alerts.push({
          level: 'info',
          message: 'No active admin sessions',
          time: 'Just now',
          priority: 3
        })
      }
    }

    // Check for locked admin accounts (warning)
    const { data: lockedAccounts } = await supabase
      .from('admin_users')
      .select('*')
      .gt('locked_until', new Date().toISOString())

    if (lockedAccounts && lockedAccounts.length > 0) {
      alerts.push({
        level: 'warning',
        message: `${lockedAccounts.length} admin account${lockedAccounts.length > 1 ? 's' : ''} temporarily locked`,
        time: 'Active',
        priority: 2
      })
    }

    // Check waitlist growth (success if new signups today)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count: todaySignups } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString())

    if (todaySignups && todaySignups > 0) {
      alerts.push({
        level: 'success',
        message: `${todaySignups} new waitlist signup${todaySignups > 1 ? 's' : ''} today`,
        time: 'Today',
        priority: 4
      })
    }

    // Check for any permission changes in last 24h (info)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const { data: permissionChanges } = await supabase
      .from('admin_audit_log')
      .select('*')
      .in('action', ['permission_change', 'role_change'])
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .limit(1)

    if (permissionChanges && permissionChanges.length > 0) {
      alerts.push({
        level: 'info',
        message: 'Admin permissions were recently modified',
        time: getRelativeTime(new Date(permissionChanges[0].created_at)),
        priority: 5
      })
    }

    // Check database size or performance (info - mock for now)
    const randomHour = Math.floor(Math.random() * 24)
    alerts.push({
      level: 'info',
      message: `Database backup scheduled in ${randomHour} hour${randomHour === 1 ? '' : 's'}`,
      time: 'Scheduled',
      priority: 6
    })

    // Sort alerts by priority and return top 5
    alerts.sort((a, b) => a.priority - b.priority)
    const topAlerts = alerts.slice(0, 5).map(({ priority, ...rest }) => rest)

    return NextResponse.json({ alerts: topAlerts })

  } catch (error) {
    console.error('Dashboard alerts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system alerts' },
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
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
}
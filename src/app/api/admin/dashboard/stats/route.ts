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

    // Get total waitlist users
    const { count: totalUsers } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    // Get waitlist growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const { count: recentUsers } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    const { count: previousUsers } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString())

    const userGrowth = previousUsers && previousUsers > 0
      ? ((recentUsers! - previousUsers) / previousUsers * 100).toFixed(1)
      : recentUsers! > 0 ? '+100' : '0'

    // Get active admin sessions
    const now = new Date()
    const { data: activeSessions } = await supabase
      .from('admin_sessions')
      .select('*')
      .gt('expires_at', now.toISOString())
      .is('invalidated_at', null)

    // Get session trend (compare to yesterday)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const { count: yesterdaySessions } = await supabase
      .from('admin_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', now.toISOString())

    const sessionTrend = yesterdaySessions && yesterdaySessions > 0
      ? ((activeSessions?.length || 0) - yesterdaySessions) / yesterdaySessions * 100
      : 0

    // Get security events (failed logins in last 24h)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const { count: securityEvents } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .in('action', ['login_error', 'login_attempt'])
      .eq('metadata->status', 'failure')
      .gte('created_at', twentyFourHoursAgo.toISOString())

    // Get security events trend (compare to previous 24h)
    const fortyEightHoursAgo = new Date()
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

    const { count: previousSecurityEvents } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .in('action', ['login_error', 'login_attempt'])
      .eq('metadata->status', 'failure')
      .gte('created_at', fortyEightHoursAgo.toISOString())
      .lt('created_at', twentyFourHoursAgo.toISOString())

    const securityTrend = previousSecurityEvents && previousSecurityEvents > 0
      ? ((securityEvents! - previousSecurityEvents) / previousSecurityEvents * 100).toFixed(1)
      : '0'

    // Get API calls (all audit log entries in last hour)
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    const { count: apiCalls } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo.toISOString())

    // Get API calls trend (compare to previous hour)
    const twoHoursAgo = new Date()
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2)

    const { count: previousApiCalls } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twoHoursAgo.toISOString())
      .lt('created_at', oneHourAgo.toISOString())

    const apiTrend = previousApiCalls && previousApiCalls > 0
      ? ((apiCalls! - previousApiCalls) / previousApiCalls * 100).toFixed(1)
      : '0'

    // Format the response
    const stats = [
      {
        title: 'Total Users',
        value: totalUsers?.toLocaleString() || '0',
        icon: 'Users',
        change: userGrowth !== '0' ? `${userGrowth > 0 ? '+' : ''}${userGrowth}% from last month` : 'No change',
        trend: parseFloat(userGrowth) > 0 ? 'up' : parseFloat(userGrowth) < 0 ? 'down' : 'neutral'
      },
      {
        title: 'Active Sessions',
        value: (activeSessions?.length || 0).toLocaleString(),
        icon: 'Activity',
        change: sessionTrend !== 0 ? `${sessionTrend > 0 ? '+' : ''}${sessionTrend.toFixed(1)}% from yesterday` : 'No change',
        trend: sessionTrend > 0 ? 'up' : sessionTrend < 0 ? 'down' : 'neutral'
      },
      {
        title: 'Security Events',
        value: securityEvents?.toString() || '0',
        icon: 'Shield',
        change: securityTrend !== '0' ? `${parseFloat(securityTrend) > 0 ? '+' : ''}${securityTrend}% from yesterday` : 'No change',
        trend: parseFloat(securityTrend) > 0 ? 'up' : parseFloat(securityTrend) < 0 ? 'down' : 'neutral'
      },
      {
        title: 'API Calls',
        value: apiCalls && apiCalls >= 1000
          ? `${(apiCalls / 1000).toFixed(1)}K`
          : apiCalls?.toString() || '0',
        icon: 'BarChart',
        change: apiTrend !== '0' ? `${parseFloat(apiTrend) > 0 ? '+' : ''}${apiTrend}% from last hour` : 'No change',
        trend: parseFloat(apiTrend) > 0 ? 'up' : parseFloat(apiTrend) < 0 ? 'down' : 'neutral'
      }
    ]

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
'use client'

import { useQuery } from '@tanstack/react-query'
import { queryOptions } from '@/lib/react-query/query-client'

export interface DashboardStat {
  title: string
  value: string
  icon: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export interface Activity {
  time: string
  action: string
  user: string
  type: 'audit' | 'signup'
}

export interface Alert {
  level: 'warning' | 'info' | 'success' | 'error'
  message: string
  time: string
}

// Fetch dashboard statistics
async function fetchDashboardStats(): Promise<{ stats: DashboardStat[] }> {
  const response = await fetch('/api/admin/dashboard/stats', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`)
  }

  return response.json()
}

// Fetch recent activity
async function fetchRecentActivity(): Promise<{ activities: Activity[] }> {
  const response = await fetch('/api/admin/dashboard/activity', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch recent activity: ${response.statusText}`)
  }

  return response.json()
}

// Fetch system alerts
async function fetchSystemAlerts(): Promise<{ alerts: Alert[] }> {
  const response = await fetch('/api/admin/dashboard/alerts', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch system alerts: ${response.statusText}`)
  }

  return response.json()
}

// Hook for dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    ...queryOptions.realtime, // Refresh every minute
    select: (data) => data.stats,
  })
}

// Hook for recent activity
export function useRecentActivity() {
  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
    ...queryOptions.list, // 2 minute stale time
    select: (data) => data.activities,
  })
}

// Hook for system alerts
export function useSystemAlerts() {
  return useQuery({
    queryKey: ['systemAlerts'],
    queryFn: fetchSystemAlerts,
    ...queryOptions.realtime, // Refresh frequently
    select: (data) => data.alerts,
  })
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const stats = useDashboardStats()
  const activity = useRecentActivity()
  const alerts = useSystemAlerts()

  return {
    stats,
    activity,
    alerts,
    isLoading: stats.isLoading || activity.isLoading || alerts.isLoading,
    isError: stats.isError || activity.isError || alerts.isError,
    refetchAll: () => {
      stats.refetch()
      activity.refetch()
      alerts.refetch()
    },
  }
}
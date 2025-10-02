'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAdminLogout } from './useAdminLogout'

interface SessionInfo {
  expiresAt: number
  refreshAt: number
  isExpired: boolean
  isNearExpiry: boolean
  timeRemaining: number
}

/**
 * Refresh the admin session token
 */
async function refreshSession(): Promise<{ expiresAt: number }> {
  const response = await fetch('/api/admin/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.')
    }
    throw new Error('Failed to refresh session')
  }

  const data = await response.json()
  return {
    expiresAt: data.expiresAt || Date.now() + 4 * 60 * 60 * 1000, // Default 4 hours
  }
}

/**
 * Hook for managing admin session lifecycle
 *
 * Features:
 * - Automatic token refresh before expiry
 * - Session expiry warnings
 * - Multi-tab synchronization
 * - Activity tracking
 *
 * @example
 * ```tsx
 * function AdminLayout() {
 *   const { sessionInfo, extendSession } = useAdminSession({
 *     onSessionExpiry: () => {
 *       router.push('/admin/login')
 *     }
 *   })
 *
 *   if (sessionInfo?.isNearExpiry) {
 *     return <SessionExpiryWarning onExtend={extendSession} />
 *   }
 *
 *   return <AdminDashboard />
 * }
 * ```
 */
export function useAdminSession(options?: {
  onSessionExpiry?: () => void
  onSessionRefresh?: () => void
  warningThreshold?: number // Minutes before expiry to show warning (default: 2)
  autoRefresh?: boolean // Auto-refresh before expiry (default: true)
}) {
  const {
    onSessionExpiry,
    onSessionRefresh,
    warningThreshold = 2, // 2 minutes before expiry
    autoRefresh = true,
  } = options || {}

  const queryClient = useQueryClient()
  const { forceLogout } = useAdminLogout()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownWarning = useRef(false)

  // Mutation for refreshing session
  const refreshMutation = useMutation({
    mutationFn: refreshSession,
    onSuccess: (data) => {
      // Update session info
      const newSessionInfo: SessionInfo = {
        expiresAt: data.expiresAt,
        refreshAt: data.expiresAt - warningThreshold * 60 * 1000,
        isExpired: false,
        isNearExpiry: false,
        timeRemaining: data.expiresAt - Date.now(),
      }

      setSessionInfo(newSessionInfo)
      hasShownWarning.current = false

      // Notify success
      if (onSessionRefresh) {
        onSessionRefresh()
      }

      // Schedule next refresh
      scheduleRefresh(newSessionInfo)

      // Show success toast (optional, might be too frequent)
      // toast.success('Session refreshed', { duration: 1000 })
    },
    onError: (error: Error) => {
      console.error('Session refresh failed:', error)

      // Force logout on refresh failure
      if (error.message.includes('expired')) {
        handleSessionExpiry('Your session has expired.')
      } else {
        toast.error('Failed to refresh session', {
          description: 'You may be logged out soon.',
          action: {
            label: 'Try again',
            onClick: () => refreshMutation.mutate(),
          },
        })
      }
    },
  })

  // Handle session expiry
  const handleSessionExpiry = useCallback((reason?: string) => {
    // Clear all timeouts
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)

    // Force logout
    forceLogout(reason || 'Your session has expired.')

    // Call custom handler
    if (onSessionExpiry) {
      onSessionExpiry()
    }
  }, [forceLogout, onSessionExpiry])

  // Store refresh mutation in a ref to avoid recreating callbacks
  const refreshMutationRef = useRef(refreshMutation)
  useEffect(() => {
    refreshMutationRef.current = refreshMutation
  }, [refreshMutation])

  // Schedule automatic refresh
  const scheduleRefresh = useCallback((session: SessionInfo) => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    if (!autoRefresh) return

    // Calculate when to refresh (1 minute before expiry)
    const refreshIn = session.refreshAt - Date.now() - 60 * 1000

    if (refreshIn > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshMutationRef.current.mutate()
      }, refreshIn)
    }
  }, [autoRefresh])

  // Schedule warning notification
  const scheduleWarning = useCallback((session: SessionInfo) => {
    // Clear existing timeout
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }

    // Calculate when to show warning
    const warnIn = session.refreshAt - Date.now()

    if (warnIn > 0 && !hasShownWarning.current) {
      warningTimeoutRef.current = setTimeout(() => {
        hasShownWarning.current = true

        toast.warning('Session expiring soon', {
          description: 'Your session will expire in 2 minutes. Save your work.',
          duration: 10000,
          action: {
            label: 'Extend session',
            onClick: () => refreshMutationRef.current.mutate(),
          },
        })

        // Update session info to show warning state
        setSessionInfo(prev => prev ? {
          ...prev,
          isNearExpiry: true,
        } : null)
      }, warnIn)
    }
  }, [])

  // Initialize session from user data (read from cache only)
  const adminUser = queryClient.getQueryData(['adminUser'])

  // Store callbacks in refs to use in the effect
  const scheduleRefreshRef = useRef(scheduleRefresh)
  const scheduleWarningRef = useRef(scheduleWarning)
  const handleSessionExpiryRef = useRef(handleSessionExpiry)

  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh
    scheduleWarningRef.current = scheduleWarning
    handleSessionExpiryRef.current = handleSessionExpiry
  }, [scheduleRefresh, scheduleWarning, handleSessionExpiry])

  // Update session info periodically
  useEffect(() => {
    if (!adminUser) {
      setSessionInfo(null)
      return
    }

    // Start with a 4-hour session (will be updated by actual data)
    const expiresAt = Date.now() + 4 * 60 * 60 * 1000
    const initialSession: SessionInfo = {
      expiresAt,
      refreshAt: expiresAt - warningThreshold * 60 * 1000,
      isExpired: false,
      isNearExpiry: false,
      timeRemaining: expiresAt - Date.now(),
    }

    setSessionInfo(initialSession)
    scheduleRefreshRef.current(initialSession)
    scheduleWarningRef.current(initialSession)

    // Update time remaining every 10 seconds instead of every second to reduce re-renders
    // Only update more frequently when near expiry (last 2 minutes)
    updateIntervalRef.current = setInterval(() => {
      setSessionInfo(prev => {
        if (!prev) return null

        const now = Date.now()
        const timeRemaining = prev.expiresAt - now

        if (timeRemaining <= 0) {
          handleSessionExpiryRef.current()
          return null
        }

        // Only update if there's a meaningful change
        const newIsNearExpiry = timeRemaining <= warningThreshold * 60 * 1000

        // If state hasn't meaningfully changed and we're not near expiry, don't update
        if (!newIsNearExpiry && prev.isNearExpiry === newIsNearExpiry) {
          // Skip update if nothing important changed
          return prev
        }

        return {
          ...prev,
          timeRemaining,
          isExpired: false,
          isNearExpiry: newIsNearExpiry,
        }
      })
    }, 10000) // Update every 10 seconds instead of every second

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [adminUser, warningThreshold])

  // Multi-tab synchronization via storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_logout' && e.newValue === 'true') {
        // Another tab logged out
        handleSessionExpiryRef.current('You have been logged out in another tab.')
      }

      if (e.key === 'admin_session_refresh' && e.newValue) {
        // Another tab refreshed the session
        try {
          const data = JSON.parse(e.newValue)
          const newSessionInfo: SessionInfo = {
            expiresAt: data.expiresAt,
            refreshAt: data.expiresAt - warningThreshold * 60 * 1000,
            isExpired: false,
            isNearExpiry: false,
            timeRemaining: data.expiresAt - Date.now(),
          }

          setSessionInfo(newSessionInfo)
          scheduleRefreshRef.current(newSessionInfo)
          scheduleWarningRef.current(newSessionInfo)
        } catch (error) {
          console.error('Failed to parse session refresh data:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [warningThreshold])

  // Notify other tabs on refresh
  useEffect(() => {
    if (refreshMutation.isSuccess && refreshMutation.data) {
      localStorage.setItem('admin_session_refresh', JSON.stringify(refreshMutation.data))
    }
  }, [refreshMutation.isSuccess, refreshMutation.data])

  // Manual session extension
  const extendSession = useCallback(() => {
    refreshMutation.mutate()
  }, [refreshMutation])

  // Format time remaining for display
  const formatTimeRemaining = useCallback(() => {
    if (!sessionInfo) return ''

    const seconds = Math.floor(sessionInfo.timeRemaining / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${seconds} seconds`
  }, [sessionInfo])

  return {
    // Session information
    sessionInfo,
    timeRemaining: formatTimeRemaining(),

    // Session states
    isRefreshing: refreshMutation.isPending,
    isSessionValid: !!sessionInfo && !sessionInfo.isExpired,
    isNearExpiry: sessionInfo?.isNearExpiry || false,

    // Actions
    extendSession,
    refreshSession: () => refreshMutation.mutate(),

    // Direct access to refresh mutation
    refreshMutation,
  }
}

/**
 * Hook for tracking user activity and extending session on activity
 */
export function useActivityTracking(options?: {
  idleTimeout?: number // Minutes of inactivity before warning (default: 10)
  events?: string[] // Events to track (default: mouse, keyboard, touch)
}) {
  const {
    idleTimeout = 10,
    events = ['mousedown', 'keydown', 'touchstart', 'scroll'],
  } = options || {}

  const [isIdle, setIsIdle] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now())
    setIsIdle(false)

    // Clear existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    // Set new idle timer
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true)
      toast.info('You\'ve been inactive', {
        description: 'Your session may expire due to inactivity.',
        duration: 5000,
      })
    }, idleTimeout * 60 * 1000)
  }, [idleTimeout])

  useEffect(() => {
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    // Start idle timer
    handleActivity()

    return () => {
      // Clean up
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [events, handleActivity])

  return {
    isIdle,
    lastActivity,
    timeSinceLastActivity: Date.now() - lastActivity,
  }
}
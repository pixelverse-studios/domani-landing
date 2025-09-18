'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminUser } from './useAdminUser'
import { useAdminLogin, type LoginCredentials } from './useAdminLogin'
import { useAdminLogout } from './useAdminLogout'
import { useAdminSession } from './useAdminSession'

/**
 * Main authentication hook that combines all auth-related functionality
 *
 * This hook provides a unified interface for:
 * - User authentication state
 * - Login/logout functionality
 * - Session management
 * - Permission checking
 * - Protected route handling
 *
 * @example
 * ```tsx
 * function AdminApp() {
 *   const {
 *     user,
 *     isAuthenticated,
 *     isLoading,
 *     login,
 *     logout,
 *     hasPermission
 *   } = useAdminAuth()
 *
 *   if (isLoading) return <LoadingScreen />
 *   if (!isAuthenticated) return <LoginScreen onLogin={login} />
 *
 *   return (
 *     <AdminDashboard
 *       user={user}
 *       onLogout={logout}
 *       canEdit={hasPermission('content', 'edit')}
 *     />
 *   )
 * }
 * ```
 */
export function useAdminAuth(options?: {
  redirectOnUnauthenticated?: string
  redirectOnAuthenticated?: string
  requireAuth?: boolean
  requiredRole?: string
  requiredPermission?: { resource: string; action: string }
  onSessionExpiry?: () => void
}) {
  const {
    redirectOnUnauthenticated = '/admin/login',
    redirectOnAuthenticated = '/admin',
    requireAuth = false,
    requiredRole,
    requiredPermission,
    onSessionExpiry,
  } = options || {}

  const router = useRouter()

  // Get all auth hooks
  const userHook = useAdminUser()
  const loginHook = useAdminLogin()
  const logoutHook = useAdminLogout()
  const sessionHook = useAdminSession({
    onSessionExpiry: () => {
      userHook.clearUser()
      if (onSessionExpiry) {
        onSessionExpiry()
      }
      router.push(`${redirectOnUnauthenticated}?session=expired`)
    },
  })

  // Check authentication requirements
  useEffect(() => {
    if (!userHook.isLoading) {
      // Redirect if unauthenticated and auth is required
      if (requireAuth && !userHook.isAuthenticated) {
        const currentPath = window.location.pathname
        router.push(`${redirectOnUnauthenticated}?from=${encodeURIComponent(currentPath)}`)
      }

      // Check role requirements
      if (requiredRole && userHook.isAuthenticated && !userHook.hasRole(requiredRole)) {
        router.push('/admin/unauthorized')
      }

      // Check permission requirements
      if (
        requiredPermission &&
        userHook.isAuthenticated &&
        !userHook.hasPermission(requiredPermission.resource, requiredPermission.action)
      ) {
        router.push('/admin/unauthorized')
      }
    }
  }, [
    userHook.isLoading,
    userHook.isAuthenticated,
    userHook.hasRole,
    userHook.hasPermission,
    requireAuth,
    requiredRole,
    requiredPermission,
    router,
    redirectOnUnauthenticated,
  ])

  // Enhanced login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const result = await loginHook.login(credentials, {
          redirectTo: redirectOnAuthenticated,
        })
        return result
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    [loginHook, redirectOnAuthenticated]
  )

  // Enhanced logout function
  const logout = useCallback(
    async (options?: { skipConfirmation?: boolean }) => {
      try {
        await logoutHook.logout({
          ...options,
          redirectTo: redirectOnUnauthenticated,
          onSuccess: () => {
            // Clear user data
            userHook.clearUser()
          },
        })
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },
    [logoutHook, userHook, redirectOnUnauthenticated]
  )

  // Check if user can perform an action
  const can = useCallback(
    (resource: string, action: string): boolean => {
      return userHook.hasPermission(resource, action)
    },
    [userHook.hasPermission]
  )

  // Check if user cannot perform an action
  const cannot = useCallback(
    (resource: string, action: string): boolean => {
      return !userHook.hasPermission(resource, action)
    },
    [userHook.hasPermission]
  )

  return {
    // User data and state
    user: userHook.user,
    isAuthenticated: userHook.isAuthenticated,
    isUnauthenticated: userHook.isUnauthenticated,
    isLoading: userHook.isLoading,
    isRefreshing: userHook.isRefreshing,
    error: userHook.error,

    // Role checks
    isSuperAdmin: userHook.isSuperAdmin,
    isAdmin: userHook.isAdmin,
    canEdit: userHook.canEdit,
    canView: userHook.canView,
    hasRole: userHook.hasRole,
    hasPermission: userHook.hasPermission,
    can,
    cannot,

    // Authentication actions
    login,
    logout,
    logoutAllSessions: logoutHook.logoutAllSessions,
    refreshUser: userHook.refreshUser,

    // Login state
    isLoggingIn: loginHook.isLoading,
    loginError: loginHook.error,
    resetLoginError: loginHook.reset,

    // Logout state
    isLoggingOut: logoutHook.isLoading,
    logoutError: logoutHook.error,

    // Session management
    sessionInfo: sessionHook.sessionInfo,
    timeRemaining: sessionHook.timeRemaining,
    isSessionValid: sessionHook.isSessionValid,
    isNearExpiry: sessionHook.isNearExpiry,
    extendSession: sessionHook.extendSession,
    isRefreshingSession: sessionHook.isRefreshing,
  }
}

/**
 * Hook for protecting components/pages that require authentication
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { isAllowed, isChecking } = useAuthGuard({
 *     requiredRole: 'admin',
 *     fallback: '/admin/unauthorized'
 *   })
 *
 *   if (isChecking) return <LoadingScreen />
 *   if (!isAllowed) return null // Will redirect
 *
 *   return <AdminOnlyContent />
 * }
 * ```
 */
export function useAuthGuard(options: {
  requiredRole?: string
  requiredPermission?: { resource: string; action: string }
  fallback?: string
  redirectTo?: string
}) {
  const {
    requiredRole,
    requiredPermission,
    fallback = '/admin/unauthorized',
    redirectTo = '/admin/login',
  } = options

  const router = useRouter()
  const { user, isLoading, isAuthenticated, hasRole, hasPermission } = useAdminUser()

  // Check if user meets requirements
  const checkAccess = useCallback(() => {
    if (!isAuthenticated) {
      return false
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return false
    }

    if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
      return false
    }

    return true
  }, [isAuthenticated, hasRole, hasPermission, requiredRole, requiredPermission])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`)
      } else if (!checkAccess()) {
        // Logged in but doesn't have access
        router.push(fallback)
      }
    }
  }, [isLoading, isAuthenticated, checkAccess, router, redirectTo, fallback])

  return {
    isAllowed: checkAccess(),
    isChecking: isLoading,
    user,
  }
}

/**
 * Hook for conditionally rendering content based on permissions
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { when, unless } = usePermissionRender()
 *
 *   return (
 *     <div>
 *       {when('admin', (
 *         <AdminOnlySection />
 *       ))}
 *
 *       {unless('viewer', (
 *         <EditableContent />
 *       ))}
 *
 *       {when.can('posts', 'delete', (
 *         <DeleteButton />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function usePermissionRender() {
  const { hasRole, hasPermission } = useAdminUser()

  const when = Object.assign(
    (role: string, content: React.ReactNode): React.ReactNode => {
      return hasRole(role) ? content : null
    },
    {
      can: (resource: string, action: string, content: React.ReactNode): React.ReactNode => {
        return hasPermission(resource, action) ? content : null
      },
    }
  )

  const unless = Object.assign(
    (role: string, content: React.ReactNode): React.ReactNode => {
      return !hasRole(role) ? content : null
    },
    {
      can: (resource: string, action: string, content: React.ReactNode): React.ReactNode => {
        return !hasPermission(resource, action) ? content : null
      },
    }
  )

  return { when, unless }
}
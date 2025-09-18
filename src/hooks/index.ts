/**
 * Admin Authentication Hooks
 *
 * This module provides a comprehensive set of React hooks for managing
 * admin authentication in the application. The hooks integrate with
 * React Query for state management and provide features like:
 *
 * - User authentication state
 * - Login/logout functionality
 * - Session management with auto-refresh
 * - Role-based access control (RBAC)
 * - Permission checking
 * - Multi-tab synchronization
 * - Activity tracking
 *
 * @example
 * ```tsx
 * import { useAdminAuth } from '@/hooks'
 *
 * function AdminApp() {
 *   const { user, isAuthenticated, login, logout } = useAdminAuth()
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} />
 *   }
 *
 *   return <AdminDashboard user={user} onLogout={logout} />
 * }
 * ```
 */

// Main authentication hook
export { useAdminAuth, useAuthGuard, usePermissionRender } from './useAdminAuth'

// Individual authentication hooks
export { useAdminUser, usePrefetchAdminUser } from './useAdminUser'
export { useAdminLogin, useRequireAuth, loginSchema, type LoginCredentials } from './useAdminLogin'
export { useAdminLogout } from './useAdminLogout'
export { useAdminSession, useActivityTracking } from './useAdminSession'

// Re-export types for convenience
export type { AdminUser, AdminRole, AdminUserWithDetails } from '@/types/admin'
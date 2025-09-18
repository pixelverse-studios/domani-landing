/**
 * Admin Dashboard Type Definitions
 * Generated from database schema
 */

// ============================================
// Enums
// ============================================

export enum AdminRole {
  SuperAdmin = 'super_admin',
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer'
}

export enum AdminAction {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Export = 'export',
  Import = 'import',
  Execute = 'execute'
}

export enum AuditAction {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Login = 'login',
  Logout = 'logout',
  Export = 'export',
  Import = 'import',
  PermissionChange = 'permission_change',
  RoleChange = 'role_change',
  SettingsChange = 'settings_change'
}

// ============================================
// Database Tables
// ============================================

export interface AdminUser {
  id: string
  user_id: string
  role: AdminRole
  permissions: Record<string, any>
  is_active: boolean
  last_login_at?: Date
  failed_login_attempts: number
  locked_until?: Date
  created_at: Date
  updated_at: Date
  created_by?: string
  metadata: Record<string, any>
}

export interface AdminRoleDefinition {
  id: string
  name: string
  display_name: string
  description?: string
  level: number
  parent_role_id?: string
  is_system_role: boolean
  created_at: Date
  updated_at: Date
}

export interface AdminPermission {
  id: string
  role: AdminRole
  resource: string
  action: AdminAction
  conditions: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface AdminAuditLog {
  id: string
  user_id: string
  admin_user_id?: string
  action: AuditAction
  resource_type: string
  resource_id?: string
  description?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  session_id?: string
  created_at: Date
  metadata: Record<string, any>
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface AdminUserWithDetails extends AdminUser {
  user: {
    email: string
    created_at: Date
    last_sign_in_at?: Date
    user_metadata?: Record<string, any>
  }
  created_by_user?: {
    id: string
    email: string
  }
}

export interface AdminPermissionSet {
  role: AdminRole
  permissions: AdminPermission[]
  inherited_permissions?: AdminPermission[]
}

export interface AuditLogWithUser extends AdminAuditLog {
  user: {
    email: string
  }
  admin_user?: {
    role: AdminRole
  }
}

// ============================================
// Helper Types
// ============================================

export interface PermissionCheck {
  resource: string
  action: AdminAction
  conditions?: Record<string, any>
}

export interface RoleHierarchy {
  [AdminRole.SuperAdmin]: number // 100
  [AdminRole.Admin]: number      // 75
  [AdminRole.Editor]: number     // 50
  [AdminRole.Viewer]: number     // 25
}

export const ROLE_LEVELS: RoleHierarchy = {
  [AdminRole.SuperAdmin]: 100,
  [AdminRole.Admin]: 75,
  [AdminRole.Editor]: 50,
  [AdminRole.Viewer]: 25
}

// ============================================
// Request/Response Types
// ============================================

export interface CreateAdminUserRequest {
  user_id: string
  role: AdminRole
  permissions?: Record<string, any>
  metadata?: Record<string, any>
}

export interface UpdateAdminUserRequest {
  role?: AdminRole
  permissions?: Record<string, any>
  is_active?: boolean
  metadata?: Record<string, any>
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  user: AdminUserWithDetails
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

export interface AuditLogFilter {
  user_id?: string
  action?: AuditAction
  resource_type?: string
  date_from?: Date
  date_to?: Date
  limit?: number
  offset?: number
}

// ============================================
// Utility Functions
// ============================================

/**
 * Check if a role has permission for an action
 */
export function hasPermission(
  userRole: AdminRole,
  resource: string,
  action: AdminAction,
  permissions: AdminPermission[]
): boolean {
  return permissions.some(
    p => (p.role === userRole || userRole === AdminRole.SuperAdmin) &&
         (p.resource === resource || p.resource === '*') &&
         p.action === action
  )
}

/**
 * Check if one role is higher than another
 */
export function isRoleHigherThan(role1: AdminRole, role2: AdminRole): boolean {
  return ROLE_LEVELS[role1] > ROLE_LEVELS[role2]
}

/**
 * Check if a role can manage another role
 */
export function canManageRole(managerRole: AdminRole, targetRole: AdminRole): boolean {
  // Super admins can manage anyone
  if (managerRole === AdminRole.SuperAdmin) return true

  // Others can only manage roles below them
  return isRoleHigherThan(managerRole, targetRole)
}

/**
 * Get display name for a role
 */
export function getRoleDisplayName(role: AdminRole): string {
  const displayNames: Record<AdminRole, string> = {
    [AdminRole.SuperAdmin]: 'Super Admin',
    [AdminRole.Admin]: 'Admin',
    [AdminRole.Editor]: 'Editor',
    [AdminRole.Viewer]: 'Viewer'
  }
  return displayNames[role] || role
}

/**
 * Get badge color for a role (for UI)
 */
export function getRoleBadgeColor(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    [AdminRole.SuperAdmin]: 'red',
    [AdminRole.Admin]: 'orange',
    [AdminRole.Editor]: 'blue',
    [AdminRole.Viewer]: 'gray'
  }
  return colors[role] || 'gray'
}

// ============================================
// Type Guards
// ============================================

export function isAdminUser(user: any): user is AdminUser {
  return user &&
         typeof user.id === 'string' &&
         typeof user.user_id === 'string' &&
         Object.values(AdminRole).includes(user.role)
}

export function isSuperAdmin(user: AdminUser): boolean {
  return user.role === AdminRole.SuperAdmin && user.is_active
}

export function isActiveAdmin(user: AdminUser): boolean {
  return user.is_active &&
         (user.role === AdminRole.SuperAdmin || user.role === AdminRole.Admin)
}

export function canAccessResource(
  user: AdminUser,
  resource: string,
  action: AdminAction
): boolean {
  // Super admins have full access
  if (isSuperAdmin(user)) return true

  // Check specific permissions (would need to fetch from DB)
  // This is a simplified check
  const readOnlyActions = [AdminAction.Read, AdminAction.Export]

  if (user.role === AdminRole.Viewer) {
    return readOnlyActions.includes(action)
  }

  if (user.role === AdminRole.Editor) {
    return action !== AdminAction.Delete
  }

  return user.role === AdminRole.Admin
}
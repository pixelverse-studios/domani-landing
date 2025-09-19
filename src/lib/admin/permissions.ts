import { AdminRole, AdminAction, AdminPermission, ROLE_LEVELS } from '@/types/admin'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Default permission matrix for each role
 */
export const DEFAULT_PERMISSIONS: Record<AdminRole, { resources: string[], actions: AdminAction[] }> = {
  [AdminRole.SuperAdmin]: {
    resources: ['*'], // All resources
    actions: Object.values(AdminAction) // All actions
  },
  [AdminRole.Admin]: {
    resources: ['waitlist', 'campaigns', 'templates', 'users', 'analytics'],
    actions: [
      AdminAction.Create,
      AdminAction.Read,
      AdminAction.Update,
      AdminAction.Delete,
      AdminAction.Export,
      AdminAction.Import
    ]
  },
  [AdminRole.Editor]: {
    resources: ['waitlist', 'campaigns', 'templates', 'analytics'],
    actions: [
      AdminAction.Create,
      AdminAction.Read,
      AdminAction.Update,
      AdminAction.Export
    ]
  },
  [AdminRole.Viewer]: {
    resources: ['waitlist', 'campaigns', 'templates', 'analytics'],
    actions: [
      AdminAction.Read,
      AdminAction.Export
    ]
  }
}

/**
 * Resource-specific permission rules
 */
export const RESOURCE_PERMISSIONS: Record<string, { minRole: AdminRole, restrictedActions?: Record<AdminRole, AdminAction[]> }> = {
  'admin_users': {
    minRole: AdminRole.Admin,
    restrictedActions: {
      [AdminRole.Admin]: [AdminAction.Delete], // Admins can't delete other admins
      [AdminRole.Editor]: [],
      [AdminRole.Viewer]: []
    }
  },
  'admin_settings': {
    minRole: AdminRole.SuperAdmin
  },
  'admin_audit_log': {
    minRole: AdminRole.SuperAdmin,
    restrictedActions: {
      [AdminRole.Admin]: [AdminAction.Read, AdminAction.Export],
      [AdminRole.Editor]: [],
      [AdminRole.Viewer]: []
    }
  },
  'waitlist': {
    minRole: AdminRole.Viewer
  },
  'campaigns': {
    minRole: AdminRole.Viewer,
    restrictedActions: {
      [AdminRole.Viewer]: [AdminAction.Read, AdminAction.Export]
    }
  },
  'email_templates': {
    minRole: AdminRole.Editor
  },
  'analytics': {
    minRole: AdminRole.Viewer
  },
  'system_config': {
    minRole: AdminRole.SuperAdmin
  }
}

/**
 * Route-level permission mapping
 */
export const ROUTE_PERMISSIONS: Record<string, { role: AdminRole, actions?: AdminAction[] }> = {
  '/admin': { role: AdminRole.Viewer },
  '/admin/waitlist': { role: AdminRole.Viewer },
  '/admin/campaigns': { role: AdminRole.Viewer },
  '/admin/campaigns/new': { role: AdminRole.Editor, actions: [AdminAction.Create] },
  '/admin/campaigns/[id]/edit': { role: AdminRole.Editor, actions: [AdminAction.Update] },
  '/admin/campaigns/[id]/send': { role: AdminRole.Admin, actions: [AdminAction.Execute] },
  '/admin/templates': { role: AdminRole.Viewer },
  '/admin/templates/new': { role: AdminRole.Editor, actions: [AdminAction.Create] },
  '/admin/templates/[id]/edit': { role: AdminRole.Editor, actions: [AdminAction.Update] },
  '/admin/users': { role: AdminRole.Admin },
  '/admin/users/new': { role: AdminRole.SuperAdmin, actions: [AdminAction.Create] },
  '/admin/settings': { role: AdminRole.SuperAdmin },
  '/admin/audit': { role: AdminRole.SuperAdmin },
  '/admin/analytics': { role: AdminRole.Viewer }
}

/**
 * Check if a role has permission for a specific resource and action
 */
export async function checkPermission(
  role: AdminRole,
  resource: string,
  action: AdminAction
): Promise<boolean> {
  // Super admins have all permissions
  if (role === AdminRole.SuperAdmin) {
    return true
  }

  // Check default permissions
  const defaultPerms = DEFAULT_PERMISSIONS[role]
  if (
    (defaultPerms.resources.includes('*') || defaultPerms.resources.includes(resource)) &&
    defaultPerms.actions.includes(action)
  ) {
    // Check for resource-specific restrictions
    const resourcePerms = RESOURCE_PERMISSIONS[resource]
    if (resourcePerms) {
      // Check minimum role requirement
      if (ROLE_LEVELS[role] < ROLE_LEVELS[resourcePerms.minRole]) {
        return false
      }

      // Check restricted actions
      if (resourcePerms.restrictedActions?.[role]?.includes(action)) {
        return false
      }
    }

    return true
  }

  // Check database for custom permissions
  if (supabaseAdmin) {
    try {
      const { data: permission, error } = await supabaseAdmin
        .from('admin_permissions')
        .select('*')
        .eq('role', role)
        .eq('resource', resource)
        .eq('action', action)
        .single()

      return !error && !!permission
    } catch (error) {
      console.error('Error checking permissions:', error)
    }
  }

  return false
}

/**
 * Get all permissions for a role
 */
export async function getPermissionsForRole(role: AdminRole): Promise<AdminPermission[]> {
  const permissions: AdminPermission[] = []

  // Add default permissions
  const defaultPerms = DEFAULT_PERMISSIONS[role]
  const resources = defaultPerms.resources.includes('*')
    ? Object.keys(RESOURCE_PERMISSIONS)
    : defaultPerms.resources

  for (const resource of resources) {
    for (const action of defaultPerms.actions) {
      // Check if this combination is allowed
      const allowed = await checkPermission(role, resource, action)
      if (allowed) {
        permissions.push({
          id: `${role}-${resource}-${action}`,
          role,
          resource,
          action,
          conditions: {},
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
  }

  // Add custom permissions from database
  if (supabaseAdmin) {
    try {
      const { data: customPerms, error } = await supabaseAdmin
        .from('admin_permissions')
        .select('*')
        .eq('role', role)

      if (!error && customPerms) {
        permissions.push(...customPerms)
      }
    } catch (error) {
      console.error('Error fetching custom permissions:', error)
    }
  }

  return permissions
}

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(role: AdminRole, path: string): boolean {
  // Super admins can access everything
  if (role === AdminRole.SuperAdmin) {
    return true
  }

  // Find matching route pattern
  const routeKeys = Object.keys(ROUTE_PERMISSIONS)
    .sort((a, b) => b.length - a.length) // Check more specific routes first

  for (const routePattern of routeKeys) {
    // Convert route pattern to regex
    const pattern = routePattern
      .replace(/\[.*?\]/g, '[^/]+') // Replace [id] with regex
      .replace(/\*/g, '.*') // Replace * with regex

    const regex = new RegExp(`^${pattern}$`)

    if (regex.test(path)) {
      const routePerm = ROUTE_PERMISSIONS[routePattern]

      // Check minimum role requirement
      return ROLE_LEVELS[role] >= ROLE_LEVELS[routePerm.role]
    }
  }

  // Default deny for unmatched routes
  return false
}

/**
 * Get accessible resources for a role
 */
export function getAccessibleResources(role: AdminRole): string[] {
  if (role === AdminRole.SuperAdmin) {
    return Object.keys(RESOURCE_PERMISSIONS)
  }

  const resources = DEFAULT_PERMISSIONS[role].resources
  if (resources.includes('*')) {
    return Object.keys(RESOURCE_PERMISSIONS)
      .filter(resource => {
        const resourcePerm = RESOURCE_PERMISSIONS[resource]
        return ROLE_LEVELS[role] >= ROLE_LEVELS[resourcePerm.minRole]
      })
  }

  return resources.filter(resource => {
    const resourcePerm = RESOURCE_PERMISSIONS[resource]
    if (!resourcePerm) return true
    return ROLE_LEVELS[role] >= ROLE_LEVELS[resourcePerm.minRole]
  })
}

/**
 * Get allowed actions for a role on a specific resource
 */
export async function getAllowedActions(
  role: AdminRole,
  resource: string
): Promise<AdminAction[]> {
  const allowedActions: AdminAction[] = []

  for (const action of Object.values(AdminAction)) {
    const hasPermission = await checkPermission(role, resource, action)
    if (hasPermission) {
      allowedActions.push(action)
    }
  }

  return allowedActions
}

/**
 * Check if a role can perform an action on another role
 */
export function canManageRole(
  actorRole: AdminRole,
  targetRole: AdminRole,
  action: AdminAction
): boolean {
  // Super admins can manage anyone
  if (actorRole === AdminRole.SuperAdmin) {
    return true
  }

  // No one except super admins can manage super admins
  if (targetRole === AdminRole.SuperAdmin) {
    return false
  }

  // Admins can only manage roles below them
  if (actorRole === AdminRole.Admin) {
    const canManageLowerRoles = ROLE_LEVELS[actorRole] > ROLE_LEVELS[targetRole]

    // Admins can't delete other admins
    if (targetRole === AdminRole.Admin && action === AdminAction.Delete) {
      return false
    }

    return canManageLowerRoles
  }

  // Editors and viewers can't manage other users
  return false
}

/**
 * Validate permission conditions
 */
export function validateConditions(
  conditions: Record<string, any>,
  context: Record<string, any>
): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    if (context[key] !== value) {
      return false
    }
  }
  return true
}

/**
 * Create a permission string for display
 */
export function formatPermission(permission: AdminPermission): string {
  const actionLabels: Record<AdminAction, string> = {
    [AdminAction.Create]: 'Create',
    [AdminAction.Read]: 'View',
    [AdminAction.Update]: 'Edit',
    [AdminAction.Delete]: 'Delete',
    [AdminAction.Export]: 'Export',
    [AdminAction.Import]: 'Import',
    [AdminAction.Execute]: 'Execute'
  }

  return `${actionLabels[permission.action]} ${permission.resource}`
}

/**
 * Check bulk permissions for multiple resources/actions
 */
export async function checkBulkPermissions(
  role: AdminRole,
  permissions: Array<{ resource: string; action: AdminAction }>
): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  await Promise.all(
    permissions.map(async ({ resource, action }) => {
      const key = `${resource}:${action}`
      results[key] = await checkPermission(role, resource, action)
    })
  )

  return results
}
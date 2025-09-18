import { supabaseAdmin } from '@/lib/supabase'
import { AuditAction } from '@/types/admin'

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  userId: string
  adminId?: string
  action: string
  resource: string
  resourceId?: string
  description?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  metadata?: Record<string, any>
}

/**
 * Create an audit log entry
 */
export async function logAdminAction(entry: AuditLogEntry): Promise<void> {
  // Skip logging in development if specified
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUDIT_LOG === 'true') {
    console.debug('Audit log skipped (dev mode):', entry)
    return
  }

  // If Supabase is not available, log to console
  if (!supabaseAdmin) {
    console.log('AUDIT LOG:', JSON.stringify(entry, null, 2))
    return
  }

  try {
    const auditEntry = {
      user_id: entry.userId,
      admin_user_id: entry.adminId || null,
      action: entry.action,
      resource_type: entry.resource,
      resource_id: entry.resourceId || null,
      description: entry.description || null,
      old_values: entry.oldValues || null,
      new_values: entry.newValues || null,
      metadata: {
        ...entry.metadata,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      },
      created_at: new Date().toISOString()
    }

    const { error } = await supabaseAdmin
      .from('admin_audit_log')
      .insert(auditEntry)

    if (error) {
      console.error('Failed to create audit log:', error)
      // Don't throw - audit logging should not break the application
    }
  } catch (error) {
    console.error('Audit logging error:', error)
    // Don't throw - audit logging should not break the application
  }
}

/**
 * Log a data change with before/after values
 */
export async function logDataChange(params: {
  userId: string
  adminId: string
  action: AuditAction
  resource: string
  resourceId: string
  oldData?: Record<string, any>
  newData?: Record<string, any>
  description?: string
}): Promise<void> {
  const changes = params.oldData && params.newData
    ? getDataChanges(params.oldData, params.newData)
    : null

  await logAdminAction({
    userId: params.userId,
    adminId: params.adminId,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    description: params.description || `${params.action} ${params.resource}`,
    oldValues: changes?.old,
    newValues: changes?.new,
    metadata: {
      changedFields: changes?.fields
    }
  })
}

/**
 * Log a bulk operation
 */
export async function logBulkOperation(params: {
  userId: string
  adminId: string
  action: string
  resource: string
  count: number
  ids?: string[]
  description?: string
  metadata?: Record<string, any>
}): Promise<void> {
  await logAdminAction({
    userId: params.userId,
    adminId: params.adminId,
    action: params.action,
    resource: params.resource,
    description: params.description || `Bulk ${params.action} on ${params.count} ${params.resource}`,
    metadata: {
      ...params.metadata,
      operation: 'bulk',
      count: params.count,
      affectedIds: params.ids
    }
  })
}

/**
 * Log an export operation
 */
export async function logExport(params: {
  userId: string
  adminId: string
  resource: string
  format: string
  count: number
  filters?: Record<string, any>
  metadata?: Record<string, any>
}): Promise<void> {
  await logAdminAction({
    userId: params.userId,
    adminId: params.adminId,
    action: AdminAction.Export,
    resource: params.resource,
    description: `Exported ${params.count} ${params.resource} as ${params.format}`,
    metadata: {
      ...params.metadata,
      format: params.format,
      count: params.count,
      filters: params.filters
    }
  })
}

/**
 * Log a permission change
 */
export async function logPermissionChange(params: {
  userId: string
  adminId: string
  targetUserId: string
  oldRole?: string
  newRole?: string
  oldPermissions?: Record<string, any>
  newPermissions?: Record<string, any>
  description?: string
}): Promise<void> {
  await logAdminAction({
    userId: params.userId,
    adminId: params.adminId,
    action: AuditAction.PermissionChange,
    resource: 'admin_user',
    resourceId: params.targetUserId,
    description: params.description || `Changed permissions for user ${params.targetUserId}`,
    oldValues: {
      role: params.oldRole,
      permissions: params.oldPermissions
    },
    newValues: {
      role: params.newRole,
      permissions: params.newPermissions
    },
    metadata: {
      targetUserId: params.targetUserId
    }
  })
}

/**
 * Log a security event
 */
export async function logSecurityEvent(params: {
  userId: string
  event: string
  severity: 'info' | 'warning' | 'critical'
  description: string
  metadata?: Record<string, any>
}): Promise<void> {
  await logAdminAction({
    userId: params.userId,
    action: `security_${params.event}`,
    resource: 'security',
    description: params.description,
    metadata: {
      ...params.metadata,
      severity: params.severity,
      event: params.event
    }
  })
}

/**
 * Get changed fields between two objects
 */
function getDataChanges(
  oldData: Record<string, any>,
  newData: Record<string, any>
): { old: Record<string, any>; new: Record<string, any>; fields: string[] } {
  const old: Record<string, any> = {}
  const newValues: Record<string, any> = {}
  const changedFields: string[] = []

  // Check for changed and new fields
  for (const key in newData) {
    if (!(key in oldData) || oldData[key] !== newData[key]) {
      changedFields.push(key)
      old[key] = oldData[key] || null
      newValues[key] = newData[key]
    }
  }

  // Check for deleted fields
  for (const key in oldData) {
    if (!(key in newData)) {
      changedFields.push(key)
      old[key] = oldData[key]
      newValues[key] = null
    }
  }

  return {
    old,
    new: newValues,
    fields: changedFields
  }
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  userId?: string
  adminId?: string
  action?: string
  resource?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<{ data: any[]; count: number }> {
  if (!supabaseAdmin) {
    return { data: [], count: 0 }
  }

  try {
    let query = supabaseAdmin
      .from('admin_audit_log')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.adminId) {
      query = query.eq('admin_user_id', filters.adminId)
    }
    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    if (filters.resource) {
      query = query.eq('resource_type', filters.resource)
    }
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString())
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString())
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(
        filters.offset || 0,
        (filters.offset || 0) + (filters.limit || 50) - 1
      )

    const { data, count, error } = await query

    if (error) {
      console.error('Failed to query audit logs:', error)
      return { data: [], count: 0 }
    }

    return {
      data: data || [],
      count: count || 0
    }
  } catch (error) {
    console.error('Audit query error:', error)
    return { data: [], count: 0 }
  }
}

/**
 * Get audit log summary statistics
 */
export async function getAuditStats(params: {
  startDate?: Date
  endDate?: Date
  groupBy?: 'action' | 'resource' | 'user' | 'day'
}): Promise<Record<string, number>> {
  if (!supabaseAdmin) {
    return {}
  }

  try {
    let query = supabaseAdmin
      .from('admin_audit_log')
      .select('*')

    // Apply date filters
    if (params.startDate) {
      query = query.gte('created_at', params.startDate.toISOString())
    }
    if (params.endDate) {
      query = query.lte('created_at', params.endDate.toISOString())
    }

    const { data, error } = await query

    if (error || !data) {
      return {}
    }

    // Group and count
    const stats: Record<string, number> = {}

    data.forEach(entry => {
      let key: string

      switch (params.groupBy) {
        case 'action':
          key = entry.action
          break
        case 'resource':
          key = entry.resource_type
          break
        case 'user':
          key = entry.admin_user_id || entry.user_id
          break
        case 'day':
          key = new Date(entry.created_at).toISOString().split('T')[0]
          break
        default:
          key = 'total'
      }

      stats[key] = (stats[key] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Audit stats error:', error)
    return {}
  }
}

/**
 * Clean up old audit logs (retention policy)
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90): Promise<number> {
  if (!supabaseAdmin) {
    return 0
  }

  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    const { data, error } = await supabaseAdmin
      .from('admin_audit_log')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select()

    if (error) {
      console.error('Failed to cleanup audit logs:', error)
      return 0
    }

    return data?.length || 0
  } catch (error) {
    console.error('Audit cleanup error:', error)
    return 0
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { AdminRole, AdminAction } from '@/types/admin'

/**
 * Example protected admin API route
 * Demonstrates different ways to use the admin auth middleware
 */

// GET /api/admin/example - Requires viewer role
export const GET = withAdminAuth(
  async (request: NextRequest, { admin }) => {
    // Admin user is authenticated and available in context
    return NextResponse.json({
      message: 'Successfully accessed admin endpoint',
      user: {
        id: admin.adminId,
        email: admin.email,
        role: admin.role
      }
    })
  },
  {
    requiredRole: AdminRole.Viewer,
    skipAuditLog: false // Audit log this access
  }
)

// POST /api/admin/example - Requires editor role with create permission
export const POST = withAdminAuth(
  async (request: NextRequest, { admin }) => {
    const body = await request.json()

    // Perform admin action here
    return NextResponse.json({
      message: 'Resource created successfully',
      createdBy: admin.email,
      data: body
    })
  },
  {
    requiredRole: AdminRole.Editor,
    requiredPermission: {
      resource: 'example_resource',
      action: AdminAction.Create
    }
  }
)

// PUT /api/admin/example - Requires admin role
export const PUT = withAdminAuth(
  async (request: NextRequest, { admin }) => {
    const body = await request.json()

    // Update logic here
    return NextResponse.json({
      message: 'Resource updated successfully',
      updatedBy: admin.email,
      data: body
    })
  },
  {
    requiredRole: AdminRole.Admin,
    requiredPermission: {
      resource: 'example_resource',
      action: AdminAction.Update
    }
  }
)

// DELETE /api/admin/example - Requires super admin role
export const DELETE = withAdminAuth(
  async (request: NextRequest, { admin }) => {
    // Only super admins can delete
    return NextResponse.json({
      message: 'Resource deleted successfully',
      deletedBy: admin.email
    })
  },
  {
    requiredRole: AdminRole.SuperAdmin,
    requiredPermission: {
      resource: 'example_resource',
      action: AdminAction.Delete
    }
  }
)
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin/middleware';
import { createClient } from '@/lib/supabase/server';
import { createAdminAuditLog } from '@/lib/admin/audit';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('domani_admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify the admin token
    const sessionPayload = await verifyAdminToken(token);

    if (!sessionPayload) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { adminId, email, role, permissions, sessionId, expiresAt } = sessionPayload;

    // Get fresh user data from database
    const supabase = await createClient();
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, user_id, role, permissions, is_active, created_at, last_login_at')
      .eq('id', adminId)
      .single();

    if (error || !adminUser) {
      await createAdminAuditLog({
        action: 'login_error',
        adminId: adminId,
        details: { error: error?.message || 'User not found' },
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Not Found', message: 'Admin user not found' },
        { status: 404 }
      );
    }

    if (!adminUser.is_active) {
      await createAdminAuditLog({
        action: 'login_error',
        adminId: adminId,
        details: { reason: 'Account deactivated' },
        status: 'failure',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Forbidden', message: 'Account has been deactivated' },
        { status: 403 }
      );
    }

    // Return user data with session info
    return NextResponse.json({
      user: adminUser,
      session: {
        id: sessionId,
        expiresAt: expiresAt
      }
    });

  } catch (error) {
    console.error('Error verifying admin session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
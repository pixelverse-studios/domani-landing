import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin/middleware';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/admin';
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

    const { adminId, sessionId, expiresAt } = sessionPayload;

    // Get fresh user data from database with user email
    const supabase = await createClient();

    // First get the admin user data
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, user_id, role, permissions, is_active, created_at, last_login_at')
      .eq('id', adminId)
      .single();

    if (error || !adminUser) {
      await createAdminAuditLog({
        action: 'login_error',
        userId: sessionPayload.userId || null,  // Use the auth user ID from session
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
        userId: adminUser.user_id || null,  // Use the auth user ID from admin_users
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

    // Fetch the auth user email using service role client
    let userData = null;
    if (adminUser.user_id) {
      try {
        // Use service role client to bypass RLS and fetch from auth.users
        const serviceClient = createServiceRoleClient();
        const { data: authUserData, error: authError } = await serviceClient.auth.admin.getUserById(adminUser.user_id);

        if (!authError && authUserData?.user) {
          userData = {
            email: authUserData.user.email,
            created_at: authUserData.user.created_at,
            last_sign_in_at: authUserData.user.last_sign_in_at,
            user_metadata: authUserData.user.user_metadata
          };
        } else {
          console.error('Error fetching user from auth.users:', authError);
        }
      } catch (e) {
        console.error('Error fetching user email:', e);
      }
    }

    // Return user data with email and session info
    return NextResponse.json({
      user: {
        ...adminUser,
        user: userData
      },
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
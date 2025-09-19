import { NextRequest, NextResponse } from 'next/server';
import { logoutAdmin } from '@/lib/admin/auth';
import { verifyAdminToken } from '@/lib/admin/middleware';
import { createAdminAuditLog } from '@/lib/admin/audit';

export async function POST(request: NextRequest) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get token from cookies
    const token = request.cookies.get('domani_admin_token')?.value;

    let adminId: string | null = null;
    let sessionId: string | null = null;

    if (token) {
      // Verify the current session before logout
      const sessionPayload = await verifyAdminToken(token);

      if (sessionPayload) {
        adminId = sessionPayload.adminId;
        sessionId = sessionPayload.sessionId;

        // Logout the admin (invalidate session in database)
        await logoutAdmin(sessionPayload, request);
      }
    }

    // Create response and clear all auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear all admin authentication cookies
    response.cookies.set('domani_admin_token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    response.cookies.set('domani_admin_refresh', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Log the logout action if we had a valid session
    if (adminId) {
      await createAdminAuditLog({
        action: 'logout',
        adminId,
        details: {
          sessionId,
          ipAddress,
          userAgent
        },
        status: 'success',
        ipAddress,
        userAgent
      });
    }

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    // Even on error, clear cookies to ensure user is logged out
    const response = NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Logout completed with errors',
        success: false
      },
      { status: 500 }
    );

    // Clear cookies even on error
    response.cookies.set('domani_admin_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('domani_admin_refresh', '', { maxAge: 0, path: '/' });

    return response;
  }
}
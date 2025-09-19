import { NextRequest, NextResponse } from 'next/server';
import { refreshAdminSession } from '@/lib/admin/auth';
import { setAdminCookies } from '@/lib/admin/middleware';
import { createAdminAuditLog } from '@/lib/admin/audit';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('domani_admin_refresh')?.value;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'No refresh token provided'
        },
        { status: 401 }
      );
    }

    try {
      // Refresh the session
      const refreshResult = await refreshAdminSession(refreshToken, request);

      // Create response with updated session
      const response = NextResponse.json({
        success: true,
        message: 'Session refreshed successfully'
      });

      // Set new authentication cookies
      setAdminCookies(response, refreshResult.accessToken);

      return response;

    } catch (error) {
      // Log failed refresh attempt
      await createAdminAuditLog({
        action: 'login_error',
        adminId: null,
        details: {
          reason: error instanceof Error ? error.message : 'Unknown error',
          ipAddress,
          userAgent
        },
        status: 'failure',
        ipAddress,
        userAgent
      });

      // Clear invalid cookies
      const response = NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Session expired. Please login again.'
        },
        { status: 401 }
      );

      // Clear cookies on refresh failure
      response.cookies.set('domani_admin_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('domani_admin_refresh', '', { maxAge: 0, path: '/' });

      return response;
    }

  } catch (error) {
    console.error('Session refresh error:', error);

    // Log system error
    await createAdminAuditLog({
      action: 'login_error',
      adminId: null,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      },
      status: 'failure',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to refresh session'
      },
      { status: 500 }
    );
  }
}
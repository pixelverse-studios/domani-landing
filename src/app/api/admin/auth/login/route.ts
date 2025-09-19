import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/admin/auth';
import { setAdminCookies } from '@/lib/admin/middleware';
import { createAdminAuditLog } from '@/lib/admin/audit';
import { z } from 'zod';

// Validation schema for login request
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid request data',
          errors: validationResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = validationResult.data;
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Authenticate the admin
    const authResult = await authenticateAdmin(email, password);

    if (!authResult.success) {
      // Log failed attempt
      await createAdminAuditLog({
        action: 'login_attempt',
        adminId: null,
        details: {
          email,
          reason: authResult.error,
          ipAddress,
          userAgent
        },
        status: 'failure',
        ipAddress,
        userAgent
      });

      // Return appropriate error based on the failure reason
      const statusCode = authResult.error === 'Account deactivated' ? 403 : 401;
      return NextResponse.json(
        {
          error: authResult.error,
          message: authResult.error === 'Invalid credentials'
            ? 'Invalid email or password'
            : authResult.error
        },
        { status: statusCode }
      );
    }

    const { user: admin, session } = authResult;

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      },
      session: {
        expiresAt: session.expires_at
      }
    });

    // Set authentication cookies
    setAdminCookies(response, session.access_token, session.refresh_token);

    // Log successful login
    await createAdminAuditLog({
      action: 'login',
      adminId: admin.id,
      details: {
        rememberMe,
        ipAddress,
        userAgent
      },
      status: 'success',
      ipAddress,
      userAgent
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);

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
        message: 'An error occurred during login'
      },
      { status: 500 }
    );
  }
}
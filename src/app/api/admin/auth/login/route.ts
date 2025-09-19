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

    try {
      // Authenticate the admin
      const authResult = await authenticateAdmin({ email, password }, request);
      const { user: admin, session } = authResult;

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: admin.id,
        email: admin.user.email,
        name: admin.user.user_metadata?.name || admin.user.email,
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
      userId: admin.auth_user_id || null,  // Use the auth user ID
      adminId: admin.id,                    // Use the admin user ID
      details: {
        email: admin.user.email,
        rememberMe,
        ipAddress,
        userAgent
      },
      status: 'success',
      ipAddress,
      userAgent
    });

    return response;

    } catch (authError: any) {
      // Handle authentication errors
      if (authError.status === 403 || authError.status === 401 || authError.status === 429) {
        // Log failed attempt
        await createAdminAuditLog({
          action: 'login_attempt',
          userId: null,  // No auth user available
          adminId: null,
          details: {
            email,
            reason: authError.message,
            ipAddress,
            userAgent
          },
          status: 'failure',
          ipAddress,
          userAgent
        });

        return NextResponse.json(
          {
            error: authError.message,
            message: authError.message
          },
          { status: authError.status }
        );
      }

      throw authError;  // Re-throw for general error handler
    }

  } catch (error) {
    console.error('Login error:', error);

    // Log system error
    await createAdminAuditLog({
      action: 'login_error',
      userId: null,  // No auth user available
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
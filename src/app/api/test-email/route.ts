import { NextRequest, NextResponse } from 'next/server'
import { sendTestEmail, sendWaitlistWelcomeEmail } from '@/lib/email/resend'

// Test endpoint for email functionality
// This should be removed or protected in production
export async function POST(request: NextRequest) {
  try {
    const { email, name, type = 'test' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    let result

    if (type === 'welcome') {
      // Test welcome email
      result = await sendWaitlistWelcomeEmail({
        to: email,
        name: name || 'Test User'
      })
    } else {
      // Send simple test email
      result = await sendTestEmail(email)
    }

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'Test email sent successfully',
          data: result.data
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check if the test endpoint is available
export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint is available',
    usage: 'POST to this endpoint with { email: "test@example.com", name: "Test User", type: "welcome" | "test" }'
  })
}
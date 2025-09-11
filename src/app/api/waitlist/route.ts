import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'
import { validateEmail, validateName, sanitizeInput } from '@/utils/validation'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Rate limiting
    const { success, remaining } = await rateLimit.limit(ip)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '3600'
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email, name } = body

    // Validate inputs
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    if (!name || !validateName(name)) {
      return NextResponse.json(
        { error: 'Please provide a valid name (2-100 characters, letters only).' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const cleanEmail = sanitizeInput(email.toLowerCase())
    const cleanName = sanitizeInput(name)

    // Check if we're in mock mode (no Supabase/Resend configured)
    const isMockMode = !supabaseAdmin || !resend

    if (isMockMode) {
      console.log('Mock mode: Waitlist submission', { email: cleanEmail, name: cleanName })
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully joined the waitlist (mock mode)',
          mock: true
        },
        { 
          status: 201,
          headers: {
            'X-RateLimit-Remaining': remaining.toString()
          }
        }
      )
    }

    // Check if email already exists in database
    if (supabaseAdmin) {
      const { data: existing } = await supabaseAdmin
        .from('waitlist')
        .select('email')
        .eq('email', cleanEmail)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'This email is already on the waitlist.' },
          { status: 409 }
        )
      }

      // Store in database
      const { error: dbError } = await supabaseAdmin
        .from('waitlist')
        .insert([
          {
            email: cleanEmail,
            name: cleanName,
            source: 'website',
            created_at: new Date().toISOString()
          }
        ])

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to save to database')
      }
    }

    // Send confirmation email
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Domani <onboarding@resend.dev>', // Use resend.dev for testing
          to: [cleanEmail],
          subject: 'Welcome to the Domani Waitlist! 🌙',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Welcome to Domani, ${cleanName}!</h1>
              
              <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Thank you for joining our waitlist! You're now part of an exclusive group who will be the first to experience the power of evening planning.
              </p>
              
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: 20px;">What's Next?</h2>
                <p style="margin: 0; opacity: 0.95;">
                  We're working hard to perfect Domani. As an early supporter, you'll receive:
                </p>
                <ul style="margin: 12px 0 0 0; padding-left: 20px;">
                  <li>Early access when we launch</li>
                  <li>Exclusive beta features</li>
                  <li>Special pricing for early adopters</li>
                </ul>
              </div>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                Stay tuned for updates! In the meantime, follow us on social media for productivity tips and sneak peeks.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
              
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                © 2024 Domani. Plan tomorrow tonight, wake up ready.
              </p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
        // Don't fail the request if email fails - they're still on the list
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Successfully joined the waitlist!'
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
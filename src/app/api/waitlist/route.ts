import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateEmail, validateName } from '@/utils/validation'
import { sendWaitlistWelcomeEmail } from '@/lib/email/resend'

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(identifier)

  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }

  if (!userLimit || userLimit.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    })
    return true
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email, name } = body

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate name format
    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes' },
        { status: 400 }
      )
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedName = name.trim()

    // Check if Supabase client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized')
      return NextResponse.json(
        { error: 'Database service unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    // Check for existing email
    const { data: existingEntry, error: checkError } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking for existing email:', checkError)
      return NextResponse.json(
        { error: 'Unable to process request. Please try again.' },
        { status: 500 }
      )
    }

    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Insert new waitlist entry with 'confirmed' status by default
    const { error } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email: normalizedEmail,
        name: normalizedName,
        referral_type: 'website',
        status: 'confirmed', // Set status to 'confirmed' by default
        confirmed: true, // Keep for backwards compatibility until column is removed
        created_at: new Date().toISOString(),
        metadata: {
          ip: ip === 'unknown' ? null : ip,
          userAgent: request.headers.get('user-agent') || null,
          referrer: request.headers.get('referer') || null,
        }
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') { // Postgres unique violation
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }

      console.error('Error inserting waitlist entry:', error)
      return NextResponse.json(
        { error: 'Unable to add you to the waitlist. Please try again.' },
        { status: 500 }
      )
    }

    // Send welcome email to the user
    // Note: We send emails asynchronously and don't block the response
    // If email fails, we still return success since the primary action (DB insert) succeeded
    sendWaitlistWelcomeEmail({
      to: normalizedEmail,
      name: normalizedName
    }).catch(error => {
      // Log email errors but don't fail the request
      console.error('Failed to send welcome email:', error)
    })

    // Send admin notification (optional)
    // Uncomment if you want to receive notifications for new signups
    /*
    sendAdminNotification({
      email: normalizedEmail,
      name: normalizedName,
      source: 'website',
      metadata: {
        ip: ip === 'unknown' ? null : ip,
        userAgent: request.headers.get('user-agent') || null,
        referrer: request.headers.get('referer') || null,
      }
    }).catch(error => {
      console.error('Failed to send admin notification:', error)
    })
    */

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist! Check your email for confirmation.'
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    )

  } catch (error) {
    console.error('Unexpected error in waitlist API:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Optionally, add a GET method to check endpoint health
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Waitlist API is running'
    },
    { status: 200 }
  )
}
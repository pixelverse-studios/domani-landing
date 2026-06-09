import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateEmail } from '@/utils/validation'
import { sendWaitlistWelcomeEmail } from '@/lib/email/resend'

type AttributionTouchInput = Record<string, unknown>

interface SanitizedAttributionTouch {
  source: string | null
  medium: string | null
  campaign: string | null
  content: string | null
  term: string | null
  adId: string | null
  clickId: string | null
  referrer: string | null
  landingPage: string | null
  capturedAt: string | null
  hasExplicitCampaignSignal: boolean
}

interface SanitizedAttribution {
  first: SanitizedAttributionTouch
  current: SanitizedAttributionTouch
}

const ATTRIBUTION_QUERY_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'ttclid',
  'msclkid',
  'li_fat_id',
]

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

function sanitizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  return trimmed.slice(0, maxLength)
}

function sanitizeBoolean(value: unknown): boolean {
  return value === true
}

function sanitizeLandingPage(value: unknown): string | null {
  const landingPage = sanitizeString(value, 1000)
  if (!landingPage) return null

  try {
    const url = new URL(landingPage, 'https://domani.local')
    const sanitizedParams = new URLSearchParams()

    ATTRIBUTION_QUERY_PARAMS.forEach((param) => {
      const paramValue = url.searchParams.get(param)
      if (paramValue) {
        sanitizedParams.set(param, paramValue.slice(0, 200))
      }
    })

    const query = sanitizedParams.toString()
    return `${url.pathname}${query ? `?${query}` : ''}`.slice(0, 500)
  } catch {
    return landingPage.split('?')[0].slice(0, 500) || null
  }
}

function sanitizeAttributionTouch(value: unknown): SanitizedAttributionTouch | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const touch = value as AttributionTouchInput
  const source = sanitizeString(touch.source, 80)
  const medium = sanitizeString(touch.medium, 80)
  const hasExplicitCampaignSignal = sanitizeBoolean(touch.hasExplicitCampaignSignal)

  if (!source && !medium && !hasExplicitCampaignSignal) return null

  return {
    source,
    medium,
    campaign: sanitizeString(touch.campaign, 160),
    content: sanitizeString(touch.content, 160),
    term: sanitizeString(touch.term, 160),
    adId: sanitizeString(touch.adId, 160),
    clickId: sanitizeString(touch.clickId, 200),
    referrer: sanitizeString(touch.referrer, 255),
    landingPage: sanitizeLandingPage(touch.landingPage),
    capturedAt: sanitizeString(touch.capturedAt, 40),
    hasExplicitCampaignSignal,
  }
}

function sanitizeAttribution(value: unknown): SanitizedAttribution | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const attribution = value as Record<string, unknown>
  const first = sanitizeAttributionTouch(attribution.first)
  const current = sanitizeAttributionTouch(attribution.current)

  if (!first || !current) return null

  return { first, current }
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

    const { email, attribution } = body
    const sanitizedAttribution = sanitizeAttribution(attribution)

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim()

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
        referral_type: 'website',
        status: 'confirmed', // Set status to 'confirmed' by default
        confirmed: true, // Keep for backwards compatibility until column is removed
        created_at: new Date().toISOString(),
        metadata: {
          ip: ip === 'unknown' ? null : ip,
          userAgent: request.headers.get('user-agent') || null,
          referrer: request.headers.get('referer') || null,
          attribution: sanitizedAttribution,
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

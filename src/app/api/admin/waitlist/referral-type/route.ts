import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { AdminRole } from '@/types/admin'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Valid referral types for the dropdown
export const ALLOWED_REFERRAL_TYPES = [
  'early_adopter',
  'friends_family',
  'beta_tester',
] as const

// Full list for database validation
const ALL_REFERRAL_TYPES = [
  'website',
  'early_adopter',
  'friends_family',
  'beta_tester',
  'vip',
  'partner',
  'influencer',
  'employee',
  'investor',
  'press',
  'other',
] as const

// Validation schema
const updateReferralTypeSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one ID is required'),
  referralType: z.enum(ALL_REFERRAL_TYPES),
})

async function handlePATCH(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    const validation = updateReferralTypeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.flatten()
        },
        { status: 400 }
      )
    }

    const { ids, referralType } = validation.data

    // Update referral type for all specified entries
    const { data, error } = await supabase
      .from('waitlist')
      .update({
        referral_type: referralType
      })
      .in('id', ids)
      .select()

    if (error) {
      console.error('Failed to update referral types:', error)
      return NextResponse.json(
        { error: 'Failed to update referral types' },
        { status: 500 }
      )
    }

    // Log the action for audit trail
    console.log(`Updated referral type to ${referralType} for ${ids.length} entries`)

    return NextResponse.json({
      success: true,
      message: `Updated ${ids.length} entries to ${referralType}`,
      updatedCount: data?.length || 0,
      data
    })
  } catch (error) {
    console.error('Referral type update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PATCH = withAdminAuth(handlePATCH, { requiredRole: AdminRole.Editor })

// GET endpoint for health check (optional)
export const GET = withAdminAuth(
  async () => {
    return NextResponse.json({
      message: 'Referral type update endpoint is ready',
      allowedTypes: ALLOWED_REFERRAL_TYPES,
    })
  },
  { requiredRole: AdminRole.Viewer }
)
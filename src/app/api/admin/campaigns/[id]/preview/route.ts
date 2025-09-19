import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { generateEmailPreview } from '@/lib/email/campaigns'

// GET /api/admin/campaigns/[id]/preview - Generate email preview
export const GET = withAdminAuth(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id: campaignId } = params
    const searchParams = request.nextUrl.searchParams
    const recipientEmail = searchParams.get('email') || undefined
    
    const result = await generateEmailPreview(campaignId, recipientEmail)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate preview' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      preview: result.preview
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/campaigns/[id]/preview:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, ['email_campaigns:read'])
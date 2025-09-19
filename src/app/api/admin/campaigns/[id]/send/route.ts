import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/admin/middleware'
import { logAdminAction } from '@/lib/admin/audit'
import { sendCampaign, sendTestCampaign } from '@/lib/email/campaigns'
import { AdminAction } from '@/types/admin'

// POST /api/admin/campaigns/[id]/send - Send campaign or test email
export const POST = withAdminAuth(async (
  request: NextRequest,
  context
) => {
  try {
    const { id: campaignId } = context.params || {}
    const body = await request.json()
    const { type = 'send', testEmail } = body
    
    // Validate input
    if (type === 'test' && !testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required for test sends' },
        { status: 400 }
      )
    }
    
    if (type === 'test') {
      // Send test email
      const result = await sendTestCampaign(campaignId, testEmail)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send test email' },
          { status: 500 }
        )
      }
      
      // Log the action
      await logAdminAction({
        userId: context.admin?.userId || null,
        adminId: context.admin?.adminId,
        action: 'update',
        resource: 'email_campaigns',
        resourceId: campaignId,
        metadata: { action: 'test_send', testEmail }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      // Send actual campaign
      const result = await sendCampaign({ 
        campaignId,
        preview: false 
      })
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to send campaign' },
          { status: 500 }
        )
      }
      
      // Log the action
      await logAdminAction({
        userId: context.admin?.userId || null,
        adminId: context.admin?.adminId,
        action: 'update',
        resource: 'email_campaigns',
        resourceId: campaignId,
        metadata: {
          action: 'campaign_send',
          results: result.results
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Campaign sent successfully',
        results: result.results
      })
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/campaigns/[id]/send:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Update } })
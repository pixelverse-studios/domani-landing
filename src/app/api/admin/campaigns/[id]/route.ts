import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { withAdminAuth } from '@/lib/admin/middleware'
import { logAdminAction } from '@/lib/admin/audit'
import { UpdateCampaignRequest } from '@/types/email'
import { AdminAction } from '@/types/admin'

// GET /api/admin/campaigns/[id] - Get single campaign
export const GET = withAdminAuth(async (
  request: NextRequest,
  context
) => {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: async () => cookieStore })
    const { id } = context.params || {}
    
    // Fetch campaign with recipients
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        campaign_recipients (
          id,
          recipient_email,
          status,
          sent_at,
          opened_at,
          clicked_at,
          bounced_at,
          unsubscribed_at
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching campaign:', error)
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    // Calculate metrics
    const recipients = campaign.campaign_recipients || []
    const totalRecipients = recipients.length
    const sent = recipients.filter((r: any) => r.sent_at).length
    const opened = recipients.filter((r: any) => r.opened_at).length
    const clicked = recipients.filter((r: any) => r.clicked_at).length
    const bounced = recipients.filter((r: any) => r.bounced_at).length
    const unsubscribed = recipients.filter((r: any) => r.unsubscribed_at).length
    
    // Format response
    const response = {
      ...campaign,
      recipientCount: totalRecipients,
      metrics: {
        totalRecipients,
        sent,
        opened,
        clicked,
        bounced,
        unsubscribed,
        openRate: sent > 0 ? (opened / sent) * 100 : 0,
        clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
        bounceRate: sent > 0 ? (bounced / sent) * 100 : 0,
        unsubscribeRate: sent > 0 ? (unsubscribed / sent) * 100 : 0,
      },
    }
    
    // Log the action
    await logAdminAction({
      userId: context.admin?.userId || null,
      adminId: context.admin?.adminId,
      action: 'read',
      resource: 'email_campaigns',
      resourceId: id,
      metadata: { campaignName: campaign.name }
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/campaigns/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Read } })

// PATCH /api/admin/campaigns/[id] - Update campaign
export const PATCH = withAdminAuth(async (
  request: NextRequest,
  context
) => {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: async () => cookieStore })
    const { id } = context.params || {}
    const body: UpdateCampaignRequest = await request.json()
    
    // Check if campaign exists and is editable
    const { data: existing, error: fetchError } = await supabase
      .from('email_campaigns')
      .select('status')
      .eq('id', id)
      .single()
    
    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    // Only allow editing draft campaigns
    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be edited' },
        { status: 400 }
      )
    }
    
    // Update campaign
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .update({
        name: body.name,
        subject: body.subject,
        html_content: body.htmlContent,
        text_content: body.textContent,
        type: body.type,
        status: body.status,
        scheduled_for: body.scheduledFor,
        settings: body.settings,
        metadata: body.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating campaign:', error)
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      )
    }
    
    // Log the action
    await logAdminAction({
      userId: context.admin?.userId || null,
      adminId: context.admin?.adminId,
      action: 'update',
      resource: 'email_campaigns',
      resourceId: id,
      newValues: body
    })
    
    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/campaigns/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Update } })

// DELETE /api/admin/campaigns/[id] - Delete campaign
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  context
) => {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: async () => cookieStore })
    const { id } = context.params || {}
    
    // Check if campaign exists and can be deleted
    const { data: existing, error: fetchError } = await supabase
      .from('email_campaigns')
      .select('status, name')
      .eq('id', id)
      .single()
    
    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    // Only allow deleting draft campaigns
    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft campaigns can be deleted' },
        { status: 400 }
      )
    }
    
    // Delete campaign recipients first (cascade should handle this, but being explicit)
    await supabase
      .from('campaign_recipients')
      .delete()
      .eq('campaign_id', id)
    
    // Delete campaign
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting campaign:', error)
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      )
    }
    
    // Log the action
    await logAdminAction({
      userId: context.admin?.userId || null,
      adminId: context.admin?.adminId,
      action: 'delete',
      resource: 'email_campaigns',
      resourceId: id,
      metadata: { campaignName: existing.name }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/campaigns/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Delete } })
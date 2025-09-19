import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { withAdminAuth } from '@/lib/admin/middleware'
import { logAdminAction } from '@/lib/admin/audit'
import { CampaignStatus, CreateCampaignRequest } from '@/types/email'
import { AdminAction } from '@/types/admin'

// GET /api/admin/campaigns - List campaigns
export const GET = withAdminAuth(async (request: NextRequest, { admin }) => {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: async () => cookieStore })
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    
    // Calculate offset
    const offset = (page - 1) * limit
    
    // Build query
    let query = supabase
      .from('email_campaigns')
      .select(`
        *,
        campaign_recipients!inner (
          id,
          status,
          opened_at,
          clicked_at
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,subject.ilike.%${search}%`)
    }
    
    const { data: campaigns, error, count } = await query
    
    if (error) {
      console.error('Error fetching campaigns:', error)
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      )
    }
    
    // Calculate metrics for each campaign
    const campaignsWithMetrics = campaigns?.map(campaign => {
      const recipients = campaign.campaign_recipients || []
      const totalSent = recipients.length
      const opened = recipients.filter((r: any) => r.opened_at).length
      const clicked = recipients.filter((r: any) => r.clicked_at).length
      
      return {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        type: campaign.type,
        status: campaign.status,
        recipientCount: totalSent,
        createdAt: campaign.created_at,
        sentAt: campaign.sent_at,
        scheduledFor: campaign.scheduled_for,
        metrics: campaign.status === CampaignStatus.Sent ? {
          totalSent,
          opened,
          clicked,
          openRate: totalSent > 0 ? (opened / totalSent) * 100 : 0,
          clickRate: totalSent > 0 ? (clicked / totalSent) * 100 : 0,
          deliveryRate: 95, // Mock for now
        } : undefined,
      }
    }) || []
    
    // Log the action
    await logAdminAction({
      userId: admin.userId || null,
      adminId: admin.adminId,
      action: 'read',
      resource: 'email_campaigns',
      metadata: { page, limit, status, search }
    })
    
    return NextResponse.json({
      campaigns: campaignsWithMetrics,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Read } })

// POST /api/admin/campaigns - Create new campaign
export const POST = withAdminAuth(async (request: NextRequest, { admin }) => {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: async () => cookieStore })
    
    // Parse request body
    const body: CreateCampaignRequest = await request.json()
    
    // Validate required fields
    if (!body.name || !body.subject || !body.htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Start a transaction
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        name: body.name,
        subject: body.subject,
        html_content: body.htmlContent,
        text_content: body.textContent || '',
        type: body.type,
        status: body.status || CampaignStatus.Draft,
        scheduled_for: body.scheduledFor,
        settings: body.settings || {
          track_opens: true,
          track_clicks: true,
        },
        metadata: body.metadata || {},
      })
      .select()
      .single()
    
    if (campaignError) {
      console.error('Error creating campaign:', campaignError)
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      )
    }
    
    // If recipients are provided, add them to campaign_recipients
    if (body.recipientIds && body.recipientIds.length > 0) {
      // Get recipient emails from waitlist
      const { data: recipients, error: recipientError } = await supabase
        .from('waitlist')
        .select('id, email')
        .in('id', body.recipientIds)
      
      if (recipientError) {
        console.error('Error fetching recipients:', recipientError)
        // Roll back campaign creation
        await supabase.from('email_campaigns').delete().eq('id', campaign.id)
        return NextResponse.json(
          { error: 'Failed to add recipients' },
          { status: 500 }
        )
      }
      
      // Create campaign_recipients entries
      const recipientEntries = recipients?.map(recipient => ({
        campaign_id: campaign.id,
        recipient_email: recipient.email,
        waitlist_user_id: recipient.id,
        status: 'pending',
      })) || []
      
      const { error: insertError } = await supabase
        .from('campaign_recipients')
        .insert(recipientEntries)
      
      if (insertError) {
        console.error('Error adding campaign recipients:', insertError)
        // Roll back campaign creation
        await supabase.from('email_campaigns').delete().eq('id', campaign.id)
        return NextResponse.json(
          { error: 'Failed to add recipients' },
          { status: 500 }
        )
      }
    }
    
    // Log the action
    await logAdminAction({
      userId: admin.userId || null,
      adminId: admin.adminId,
      action: 'create',
      resource: 'email_campaigns',
      resourceId: campaign.id,
      metadata: {
        name: body.name,
        status: body.status,
        recipientCount: body.recipientIds?.length || 0,
      }
    })
    
    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}, { requiredPermission: { resource: 'email_campaigns', action: AdminAction.Create } })
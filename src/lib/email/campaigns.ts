import { Resend } from 'resend'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { CampaignStatus } from '@/types/email'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration using existing domain
const EMAIL_CONFIG = {
  from: 'Domani <hello@domani-app.com>',
  replyTo: 'hello@domani-app.com',
}

// Rate limiting constants for low volume usage
const RATE_LIMITS = {
  BATCH_SIZE: 50, // Process in smaller batches for low volume
  DELAY_BETWEEN_BATCHES: 1000, // 1 second delay
  MAX_RETRIES: 3,
}

interface SendCampaignOptions {
  campaignId: string
  preview?: boolean // For testing without actual sending
}

interface EmailRecipient {
  id: string
  email: string
  firstName?: string
  lastName?: string
  waitlistUserId?: string
}

interface CampaignData {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  recipients: EmailRecipient[]
}

/**
 * Process variable substitution in email content
 */
function processVariables(content: string, recipient: EmailRecipient): string {
  return content
    .replace(/\{\{firstName\}\}/g, recipient.firstName || 'there')
    .replace(/\{\{lastName\}\}/g, recipient.lastName || '')
    .replace(/\{\{email\}\}/g, recipient.email)
    .replace(/\{\{fullName\}\}/g, 
      `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.email
    )
}

/**
 * Add compliance footer to email content
 */
function addComplianceFooter(htmlContent: string, recipientId: string): string {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${recipientId}`
  
  const footer = `
    <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
      <p>© ${new Date().getFullYear()} Domani. All rights reserved.</p>
      <p>
        <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> |
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #6b7280; text-decoration: underline;">View in browser</a>
      </p>
      <p style="margin-top: 10px;">Domani - Plan Tomorrow Tonight</p>
    </div>
  `
  
  // Insert footer before closing body tag, or append if no body tag
  if (htmlContent.includes('</body>')) {
    return htmlContent.replace('</body>', `${footer}</body>`)
  } else {
    return htmlContent + footer
  }
}

/**
 * Send a single email with retry logic
 */
async function sendSingleEmail(
  recipient: EmailRecipient,
  campaignData: CampaignData,
  preview: boolean = false
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    // Process variables in content
    const processedHtml = addComplianceFooter(
      processVariables(campaignData.htmlContent, recipient),
      recipient.id
    )
    const processedText = processVariables(campaignData.textContent, recipient)
    const processedSubject = processVariables(campaignData.subject, recipient)
    
    if (preview) {
      // For preview mode, just return success without sending
      return { 
        success: true, 
        messageId: `preview-${Date.now()}-${recipient.id}` 
      }
    }
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [recipient.email],
      replyTo: EMAIL_CONFIG.replyTo,
      subject: processedSubject,
      html: processedHtml,
      text: processedText,
      tags: [
        {
          name: 'campaign_id',
          value: campaignData.id
        },
        {
          name: 'category',
          value: 'campaign'
        },
        {
          name: 'send_date',
          value: new Date().toISOString().split('T')[0]
        }
      ]
    })
    
    if (error) {
      console.error(`Failed to send email to ${recipient.email}:`, error)
      return { success: false, error: error.message || 'Unknown error' }
    }
    
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error(`Exception sending email to ${recipient.email}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update recipient status in database
 */
async function updateRecipientStatus(
  recipientId: string,
  status: 'sent' | 'failed' | 'bounced',
  messageId?: string,
  error?: string
) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'sent' && messageId) {
      updateData.sent_at = new Date().toISOString()
      updateData.message_id = messageId
    } else if (status === 'failed' && error) {
      updateData.error_message = error
    }
    
    const { error: updateError } = await supabase
      .from('campaign_recipients')
      .update(updateData)
      .eq('id', recipientId)
    
    if (updateError) {
      console.error('Failed to update recipient status:', updateError)
    }
  } catch (error) {
    console.error('Exception updating recipient status:', error)
  }
}

/**
 * Send campaign to all recipients with progress tracking
 */
export async function sendCampaign(options: SendCampaignOptions) {
  const { campaignId, preview = false } = options
  
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    // Fetch campaign with recipients
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        campaign_recipients (
          id,
          recipient_email,
          waitlist_user_id,
          status,
          waitlist (
            first_name,
            last_name
          )
        )
      `)
      .eq('id', campaignId)
      .single()
    
    if (campaignError || !campaign) {
      throw new Error(`Campaign not found: ${campaignError?.message}`)
    }
    
    // Validate campaign status
    if (!preview && campaign.status !== CampaignStatus.Draft && campaign.status !== CampaignStatus.Scheduled) {
      throw new Error('Campaign must be in draft or scheduled status to send')
    }
    
    // Prepare recipients data
    const recipients: EmailRecipient[] = campaign.campaign_recipients
      .filter((r: any) => r.status === 'pending')
      .map((r: any) => ({
        id: r.id,
        email: r.recipient_email,
        firstName: r.waitlist?.first_name,
        lastName: r.waitlist?.last_name,
        waitlistUserId: r.waitlist_user_id
      }))
    
    if (recipients.length === 0) {
      throw new Error('No pending recipients found for this campaign')
    }
    
    const campaignData: CampaignData = {
      id: campaign.id,
      name: campaign.name,
      subject: campaign.subject,
      htmlContent: campaign.html_content,
      textContent: campaign.text_content || '',
      recipients
    }
    
    // Update campaign status to sending (unless preview)
    if (!preview) {
      await supabase
        .from('email_campaigns')
        .update({ 
          status: CampaignStatus.Sending,
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId)
    }
    
    // Process recipients in batches
    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }
    
    for (let i = 0; i < recipients.length; i += RATE_LIMITS.BATCH_SIZE) {
      const batch = recipients.slice(i, i + RATE_LIMITS.BATCH_SIZE)
      
      // Process batch in parallel
      const batchPromises = batch.map(async (recipient) => {
        const result = await sendSingleEmail(recipient, campaignData, preview)
        
        // Update database status
        if (!preview) {
          await updateRecipientStatus(
            recipient.id,
            result.success ? 'sent' : 'failed',
            result.messageId,
            result.error
          )
        }
        
        return { recipient, result }
      })
      
      const batchResults = await Promise.allSettled(batchPromises)
      
      // Process batch results
      batchResults.forEach((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          const { result } = promiseResult.value
          if (result.success) {
            results.sent++
          } else {
            results.failed++
            if (result.error) {
              results.errors.push(result.error)
            }
          }
        } else {
          results.failed++
          results.errors.push(promiseResult.reason?.message || 'Unknown error')
        }
      })
      
      // Add delay between batches (except for last batch)
      if (i + RATE_LIMITS.BATCH_SIZE < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMITS.DELAY_BETWEEN_BATCHES))
      }
    }
    
    // Update final campaign status
    if (!preview) {
      const finalStatus = results.failed === 0 ? CampaignStatus.Sent : CampaignStatus.Failed
      await supabase
        .from('email_campaigns')
        .update({ status: finalStatus })
        .eq('id', campaignId)
    }
    
    return {
      success: true,
      results,
      campaignId
    }
    
  } catch (error) {
    console.error('Campaign sending failed:', error)
    
    // Update campaign status to failed
    if (!preview) {
      try {
        const cookieStore = await cookies()
        const supabase = createServerComponentClient({ cookies: () => cookieStore })
        await supabase
          .from('email_campaigns')
          .update({ status: CampaignStatus.Failed })
          .eq('id', campaignId)
      } catch (statusError) {
        console.error('Failed to update campaign status:', statusError)
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      campaignId
    }
  }
}

/**
 * Generate email preview for a specific recipient
 */
export async function generateEmailPreview(
  campaignId: string, 
  recipientEmail?: string
) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()
    
    if (campaignError || !campaign) {
      throw new Error(`Campaign not found: ${campaignError?.message}`)
    }
    
    // Use provided email or get first recipient
    let previewRecipient: EmailRecipient
    
    if (recipientEmail) {
      // Find specific recipient
      const { data: recipient } = await supabase
        .from('campaign_recipients')
        .select(`
          id,
          recipient_email,
          waitlist (
            first_name,
            last_name
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('recipient_email', recipientEmail)
        .single()
      
      previewRecipient = {
        id: recipient?.id || 'preview',
        email: recipientEmail,
        firstName: recipient?.waitlist?.first_name || 'John',
        lastName: recipient?.waitlist?.last_name || 'Doe'
      }
    } else {
      // Use sample data for preview
      previewRecipient = {
        id: 'preview',
        email: 'preview@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }
    }
    
    // Process content with variables
    const processedHtml = addComplianceFooter(
      processVariables(campaign.html_content, previewRecipient),
      previewRecipient.id
    )
    const processedText = processVariables(campaign.text_content || '', previewRecipient)
    const processedSubject = processVariables(campaign.subject, previewRecipient)
    
    return {
      success: true,
      preview: {
        subject: processedSubject,
        html: processedHtml,
        text: processedText,
        recipient: previewRecipient
      }
    }
  } catch (error) {
    console.error('Preview generation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Send test email to admin
 */
export async function sendTestCampaign(campaignId: string, testEmail: string) {
  try {
    const preview = await generateEmailPreview(campaignId, testEmail)
    
    if (!preview.success || !preview.preview) {
      throw new Error(preview.error || 'Failed to generate preview')
    }
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [testEmail],
      replyTo: EMAIL_CONFIG.replyTo,
      subject: `[TEST] ${preview.preview.subject}`,
      html: preview.preview.html,
      text: preview.preview.text,
      tags: [
        {
          name: 'campaign_id',
          value: campaignId
        },
        {
          name: 'category',
          value: 'test'
        }
      ]
    })
    
    if (error) {
      throw new Error(error.message || 'Failed to send test email')
    }
    
    return {
      success: true,
      messageId: data?.id
    }
  } catch (error) {
    console.error('Test email failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
import { Resend } from 'resend'
import { WaitlistWelcomeEmail, WaitlistWelcomeEmailText } from '@/emails/waitlist-welcome'

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
// Using verified domain for production emails
const EMAIL_CONFIG = {
  from: 'Domani <hello@domani-app.com>', // Using verified domain
  replyTo: 'hello@domani-app.com',
}

export interface SendWaitlistWelcomeEmailParams {
  to: string
  name: string
  position?: number
}

/**
 * Send welcome email to new waitlist signups
 * @param params - Email parameters including recipient email and name
 * @returns Promise with send result or error
 */
export async function sendWaitlistWelcomeEmail(params: SendWaitlistWelcomeEmailParams) {
  const { to, name, position } = params

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [to],
      replyTo: EMAIL_CONFIG.replyTo,
      subject: 'Welcome to Domani - You\'re on the list! 🌙',
      html: WaitlistWelcomeEmail({ name, position }),
      text: WaitlistWelcomeEmailText({ name, position }),
      tags: [
        {
          name: 'category',
          value: 'waitlist_welcome'
        },
        {
          name: 'signup_date',
          value: new Date().toISOString().split('T')[0]
        }
      ]
    })

    if (error) {
      console.error('Resend API error:', error)
      return { success: false, error }
    }

    console.log(`Welcome email sent successfully to ${to}`, { emailId: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Send admin notification when someone joins the waitlist
 * @param params - Details about the new signup
 */
export async function sendAdminNotification(params: {
  email: string
  name: string
  source: string
  metadata?: any
}) {
  const { email, name, source, metadata } = params

  // Admin notification email content
  const adminHtml = `
    <h2>New Waitlist Signup! 🎉</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Source:</strong> ${source}</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    ${metadata ? `<p><strong>Metadata:</strong> <pre>${JSON.stringify(metadata, null, 2)}</pre></p>` : ''}

    <hr>
    <p style="color: #666;">This is an automated notification from Domani waitlist system.</p>
  `

  const adminText = `
New Waitlist Signup!

Name: ${name}
Email: ${email}
Source: ${source}
Time: ${new Date().toLocaleString()}
${metadata ? `Metadata: ${JSON.stringify(metadata)}` : ''}

---
This is an automated notification from Domani waitlist system.
  `

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: ['admin@domani.app'], // TODO: Replace with actual admin email address
      subject: `[Domani] New Waitlist Signup: ${name}`,
      html: adminHtml,
      text: adminText,
      tags: [
        {
          name: 'category',
          value: 'admin_notification'
        }
      ]
    })

    if (error) {
      console.error('Failed to send admin notification:', error)
      return { success: false, error }
    }

    console.log('Admin notification sent', { emailId: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send admin notification:', error)
    return { success: false, error }
  }
}

/**
 * Test email configuration and send test email
 * @param to - Email address to send test to
 */
export async function sendTestEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [to],
      subject: 'Domani Email Test',
      html: '<h1>Test Email</h1><p>If you receive this, email configuration is working correctly!</p>',
      text: 'Test Email - If you receive this, email configuration is working correctly!',
      tags: [
        {
          name: 'category',
          value: 'test'
        }
      ]
    })

    if (error) {
      console.error('Test email failed:', error)
      return { success: false, error }
    }

    console.log('Test email sent successfully', { emailId: data?.id })
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send test email:', error)
    return { success: false, error }
  }
}
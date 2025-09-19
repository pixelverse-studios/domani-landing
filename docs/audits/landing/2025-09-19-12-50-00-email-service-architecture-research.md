# Audit Log - Landing Page - 2025-09-19 12:50:00

## Prompt Summary
Research modern email sending service architecture patterns for Next.js applications, specifically focusing on Resend API integration, queue management, rate limiting, delivery tracking, error handling, database patterns, and background job processing for Vercel/Supabase deployment.

## Actions Taken
1. Researched modern email service architecture patterns
2. Analyzed Resend API best practices for Next.js
3. Investigated queue management solutions for bulk sending
4. Examined rate limiting strategies and error handling
5. Researched webhook handling and delivery tracking
6. Analyzed database patterns for email metrics
7. Investigated background job processing options for Vercel

## Research Findings

### 1. Resend API Integration Best Practices

#### API Configuration
```typescript
// lib/email/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Type-safe email templates
export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html?: string;
  react?: React.ComponentType<any>;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

// Default configuration
export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL || 'noreply@domani.app',
  replyTo: process.env.RESEND_REPLY_TO || 'support@domani.app',
  defaultTags: [
    { name: 'environment', value: process.env.NODE_ENV },
    { name: 'app', value: 'domani-landing' }
  ]
};
```

#### Email Service Class
```typescript
// lib/email/service.ts
export class EmailService {
  private resend: Resend;
  private db: SupabaseClient;

  constructor(resend: Resend, db: SupabaseClient) {
    this.resend = resend;
    this.db = db;
  }

  async sendEmail(template: EmailTemplate): Promise<EmailResult> {
    try {
      // Generate unique tracking ID
      const trackingId = generateTrackingId();

      // Add tracking to email
      const emailData = {
        ...template,
        tags: [
          ...emailConfig.defaultTags,
          { name: 'tracking_id', value: trackingId },
          ...(template.tags || [])
        ]
      };

      // Send via Resend
      const result = await this.resend.emails.send(emailData);

      // Track in database
      await this.trackEmailSent({
        tracking_id: trackingId,
        resend_id: result.data?.id,
        to: Array.isArray(template.to) ? template.to : [template.to],
        subject: template.subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

      return { success: true, trackingId, resendId: result.data?.id };
    } catch (error) {
      // Log error and track failure
      await this.trackEmailError(error, template);
      throw error;
    }
  }

  private async trackEmailSent(data: EmailRecord) {
    await this.db.from('email_logs').insert(data);
  }

  private async trackEmailError(error: any, template: EmailTemplate) {
    await this.db.from('email_logs').insert({
      tracking_id: generateTrackingId(),
      to: Array.isArray(template.to) ? template.to : [template.to],
      subject: template.subject,
      status: 'failed',
      error_message: error.message,
      failed_at: new Date().toISOString()
    });
  }
}
```

### 2. Queue Management for Bulk Email Sending

#### Vercel-Compatible Queue Solutions

##### Option 1: Vercel KV + Edge Functions
```typescript
// lib/email/queue.ts
import { kv } from '@vercel/kv';

export class EmailQueue {
  private queueKey = 'email:queue';
  private processingKey = 'email:processing';

  async addToQueue(emails: EmailTemplate[]): Promise<void> {
    const batch = {
      id: generateId(),
      emails,
      created_at: Date.now(),
      retries: 0
    };

    await kv.lpush(this.queueKey, JSON.stringify(batch));
  }

  async processQueue(): Promise<void> {
    // Move item from queue to processing
    const item = await kv.brpoplpush(this.queueKey, this.processingKey, 1);

    if (!item) return;

    try {
      const batch = JSON.parse(item);
      await this.processBatch(batch);

      // Remove from processing queue on success
      await kv.lrem(this.processingKey, 1, item);
    } catch (error) {
      // Handle retry logic
      await this.handleRetry(item);
    }
  }

  private async processBatch(batch: EmailBatch): Promise<void> {
    const emailService = new EmailService(resend, supabase);

    // Process in chunks to respect rate limits
    const chunks = chunk(batch.emails, 10); // Resend allows 10 emails/second

    for (const emailChunk of chunks) {
      await Promise.all(
        emailChunk.map(email => emailService.sendEmail(email))
      );

      // Wait to respect rate limits
      await sleep(1000);
    }
  }
}
```

##### Option 2: Supabase + pg_cron (Recommended)
```sql
-- Database schema for email queue
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  priority INTEGER DEFAULT 5,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX idx_email_queue_status_scheduled ON email_queue(status, scheduled_at);
CREATE INDEX idx_email_queue_priority ON email_queue(priority DESC);

-- Function to process email queue
CREATE OR REPLACE FUNCTION process_email_queue()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update status to processing for next batch
  UPDATE email_queue
  SET status = 'processing', updated_at = NOW()
  WHERE id IN (
    SELECT id FROM email_queue
    WHERE status = 'pending'
    AND scheduled_at <= NOW()
    AND attempts < max_attempts
    ORDER BY priority DESC, created_at ASC
    LIMIT 50 -- Process 50 emails at a time
  );
END;
$$;

-- Schedule processing every minute
SELECT cron.schedule('process-emails', '* * * * *', 'SELECT process_email_queue();');
```

```typescript
// lib/email/queue-processor.ts
export class SupabaseEmailQueue {
  constructor(private db: SupabaseClient) {}

  async addEmail(email: QueuedEmail): Promise<void> {
    await this.db.from('email_queue').insert({
      recipient_email: email.to,
      template_name: email.template,
      template_data: email.data,
      priority: email.priority || 5,
      scheduled_at: email.scheduledAt || new Date().toISOString()
    });
  }

  async addBulkEmails(emails: QueuedEmail[]): Promise<void> {
    const queueItems = emails.map(email => ({
      recipient_email: email.to,
      template_name: email.template,
      template_data: email.data,
      priority: email.priority || 5,
      scheduled_at: email.scheduledAt || new Date().toISOString()
    }));

    // Insert in batches to avoid payload limits
    const chunks = chunk(queueItems, 1000);
    for (const chunk of chunks) {
      await this.db.from('email_queue').insert(chunk);
    }
  }

  async processQueue(): Promise<void> {
    // Get processing emails
    const { data: emails } = await this.db
      .from('email_queue')
      .select('*')
      .eq('status', 'processing')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50);

    if (!emails?.length) return;

    for (const email of emails) {
      try {
        await this.sendEmail(email);

        // Mark as sent
        await this.db
          .from('email_queue')
          .update({
            status: 'sent',
            updated_at: new Date().toISOString()
          })
          .eq('id', email.id);

      } catch (error) {
        await this.handleFailure(email, error);
      }
    }
  }

  private async handleFailure(email: QueuedEmailRecord, error: Error): Promise<void> {
    const newAttempts = email.attempts + 1;

    if (newAttempts >= email.max_attempts) {
      // Mark as permanently failed
      await this.db
        .from('email_queue')
        .update({
          status: 'failed',
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', email.id);
    } else {
      // Retry with exponential backoff
      const retryDelay = Math.pow(2, newAttempts) * 60000; // Minutes
      const scheduledAt = new Date(Date.now() + retryDelay);

      await this.db
        .from('email_queue')
        .update({
          status: 'pending',
          attempts: newAttempts,
          scheduled_at: scheduledAt.toISOString(),
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', email.id);
    }
  }
}
```

### 3. Rate Limiting Strategies

#### Resend Rate Limits
- Free tier: 100 emails/day, 3,000 emails/month
- Pro tier: 50,000 emails/month
- Rate limit: 10 emails/second

#### Implementation
```typescript
// lib/email/rate-limiter.ts
import { kv } from '@vercel/kv';

export class EmailRateLimiter {
  private readonly maxEmailsPerSecond = 10;
  private readonly maxEmailsPerMonth = 50000;

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now();
    const currentSecond = Math.floor(now / 1000);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Check per-second limit
    const secondKey = `rate:second:${currentSecond}`;
    const secondCount = await kv.incr(secondKey);
    await kv.expire(secondKey, 2); // Expire after 2 seconds

    if (secondCount > this.maxEmailsPerSecond) {
      return false;
    }

    // Check monthly limit
    const monthKey = `rate:month:${currentMonth}`;
    const monthCount = await kv.get<number>(monthKey) || 0;

    if (monthCount >= this.maxEmailsPerMonth) {
      return false;
    }

    // Increment monthly counter
    await kv.incr(monthKey);
    await kv.expire(monthKey, 32 * 24 * 60 * 60); // Expire after 32 days

    return true;
  }

  async getRemainingQuota(): Promise<{ second: number; month: number }> {
    const now = Date.now();
    const currentSecond = Math.floor(now / 1000);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const secondCount = await kv.get<number>(`rate:second:${currentSecond}`) || 0;
    const monthCount = await kv.get<number>(`rate:month:${currentMonth}`) || 0;

    return {
      second: Math.max(0, this.maxEmailsPerSecond - secondCount),
      month: Math.max(0, this.maxEmailsPerMonth - monthCount)
    };
  }
}
```

### 4. Email Delivery Tracking and Webhook Handling

#### Database Schema for Tracking
```sql
-- Email tracking tables
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL,
  resend_id TEXT,
  recipient_email TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  complained_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_log_id UUID REFERENCES email_logs(id),
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_email_logs_tracking_id ON email_logs(tracking_id);
CREATE INDEX idx_email_logs_resend_id ON email_logs(resend_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_events_type ON email_events(event_type);
```

#### Webhook Handler
```typescript
// app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const signature = req.headers.get('resend-signature');
    const timestamp = req.headers.get('resend-timestamp');
    const body = await req.text();

    if (!verifyWebhookSignature(signature, timestamp, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    await handleWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleWebhookEvent(event: ResendWebhookEvent) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { type, data } = event;
  const { email_id, to, from, subject } = data;

  // Find email log by resend ID
  const { data: emailLog } = await supabase
    .from('email_logs')
    .select('*')
    .eq('resend_id', email_id)
    .single();

  if (!emailLog) {
    console.warn(`Email log not found for resend_id: ${email_id}`);
    return;
  }

  // Update email log based on event type
  const updates: Partial<EmailLog> = {
    updated_at: new Date().toISOString()
  };

  switch (type) {
    case 'email.delivered':
      updates.status = 'delivered';
      updates.delivered_at = data.created_at;
      break;
    case 'email.opened':
      updates.status = 'opened';
      updates.opened_at = data.created_at;
      break;
    case 'email.clicked':
      updates.status = 'clicked';
      updates.clicked_at = data.created_at;
      break;
    case 'email.bounced':
      updates.status = 'bounced';
      updates.bounced_at = data.created_at;
      updates.error_message = data.reason;
      break;
    case 'email.complained':
      updates.status = 'complained';
      updates.complained_at = data.created_at;
      break;
  }

  // Update email log
  await supabase
    .from('email_logs')
    .update(updates)
    .eq('id', emailLog.id);

  // Insert event record
  await supabase.from('email_events').insert({
    email_log_id: emailLog.id,
    event_type: type,
    event_data: data,
    timestamp: data.created_at
  });

  // Handle specific business logic
  await handleBusinessLogic(type, emailLog, data);
}

async function handleBusinessLogic(
  eventType: string,
  emailLog: EmailLog,
  eventData: any
) {
  switch (eventType) {
    case 'email.bounced':
      // Mark email as invalid in user table
      await markEmailInvalid(emailLog.recipient_email);
      break;
    case 'email.complained':
      // Unsubscribe user from marketing emails
      await unsubscribeUser(emailLog.recipient_email);
      break;
    case 'email.opened':
      // Track engagement for analytics
      await trackEngagement(emailLog.recipient_email, 'email_opened');
      break;
  }
}

function verifyWebhookSignature(
  signature: string | null,
  timestamp: string | null,
  payload: string
): boolean {
  if (!signature || !timestamp) return false;

  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 5. Error Handling and Retry Logic

#### Comprehensive Error Handler
```typescript
// lib/email/error-handler.ts
export class EmailErrorHandler {
  async handleError(error: any, context: EmailContext): Promise<void> {
    const errorType = this.classifyError(error);

    switch (errorType) {
      case 'RATE_LIMIT':
        await this.handleRateLimit(context);
        break;
      case 'INVALID_EMAIL':
        await this.handleInvalidEmail(context);
        break;
      case 'TEMPORARY':
        await this.scheduleRetry(context);
        break;
      case 'PERMANENT':
        await this.handlePermanentFailure(context);
        break;
      default:
        await this.handleUnknownError(error, context);
    }
  }

  private classifyError(error: any): ErrorType {
    if (error.message?.includes('rate limit')) return 'RATE_LIMIT';
    if (error.message?.includes('invalid email')) return 'INVALID_EMAIL';
    if (error.statusCode >= 500) return 'TEMPORARY';
    if (error.statusCode >= 400) return 'PERMANENT';
    return 'UNKNOWN';
  }

  private async handleRateLimit(context: EmailContext): Promise<void> {
    // Calculate backoff delay
    const delay = Math.min(300000, Math.pow(2, context.attempts) * 1000); // Max 5 minutes

    // Reschedule with delay
    await this.rescheduleEmail(context, delay);
  }

  private async scheduleRetry(context: EmailContext): Promise<void> {
    if (context.attempts >= 3) {
      await this.handlePermanentFailure(context);
      return;
    }

    // Exponential backoff: 1min, 4min, 16min
    const delay = Math.pow(4, context.attempts) * 60000;
    await this.rescheduleEmail(context, delay);
  }

  private async rescheduleEmail(context: EmailContext, delayMs: number): Promise<void> {
    const scheduledAt = new Date(Date.now() + delayMs);

    await supabase
      .from('email_queue')
      .update({
        status: 'pending',
        attempts: context.attempts + 1,
        scheduled_at: scheduledAt.toISOString(),
        error_message: context.error?.message
      })
      .eq('id', context.emailId);
  }
}
```

### 6. Database Patterns for Email Metrics

#### Analytics Tables
```sql
-- Email analytics aggregation tables
CREATE TABLE email_analytics_daily (
  date DATE PRIMARY KEY,
  emails_sent INTEGER DEFAULT 0,
  emails_delivered INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_bounced INTEGER DEFAULT 0,
  emails_complained INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  delivery_rate DECIMAL(5,2),
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  bounce_rate DECIMAL(5,2),
  complaint_rate DECIMAL(5,2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_template_performance (
  template_name TEXT PRIMARY KEY,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  avg_delivery_rate DECIMAL(5,2),
  avg_open_rate DECIMAL(5,2),
  avg_click_rate DECIMAL(5,2),
  last_sent_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_daily_email_analytics()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  target_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
  INSERT INTO email_analytics_daily (
    date,
    emails_sent,
    emails_delivered,
    emails_opened,
    emails_clicked,
    emails_bounced,
    emails_complained,
    unique_opens,
    unique_clicks
  )
  SELECT
    target_date,
    COUNT(*) FILTER (WHERE status IN ('sent', 'delivered', 'opened', 'clicked')),
    COUNT(*) FILTER (WHERE status IN ('delivered', 'opened', 'clicked')),
    COUNT(*) FILTER (WHERE status IN ('opened', 'clicked')),
    COUNT(*) FILTER (WHERE status = 'clicked'),
    COUNT(*) FILTER (WHERE status = 'bounced'),
    COUNT(*) FILTER (WHERE status = 'complained'),
    COUNT(DISTINCT recipient_email) FILTER (WHERE status IN ('opened', 'clicked')),
    COUNT(DISTINCT recipient_email) FILTER (WHERE status = 'clicked')
  FROM email_logs
  WHERE DATE(sent_at) = target_date
  ON CONFLICT (date) DO UPDATE SET
    emails_sent = EXCLUDED.emails_sent,
    emails_delivered = EXCLUDED.emails_delivered,
    emails_opened = EXCLUDED.emails_opened,
    emails_clicked = EXCLUDED.emails_clicked,
    emails_bounced = EXCLUDED.emails_bounced,
    emails_complained = EXCLUDED.emails_complained,
    unique_opens = EXCLUDED.unique_opens,
    unique_clicks = EXCLUDED.unique_clicks,
    delivery_rate = CASE
      WHEN EXCLUDED.emails_sent > 0
      THEN ROUND((EXCLUDED.emails_delivered::DECIMAL / EXCLUDED.emails_sent) * 100, 2)
      ELSE 0
    END,
    open_rate = CASE
      WHEN EXCLUDED.emails_delivered > 0
      THEN ROUND((EXCLUDED.emails_opened::DECIMAL / EXCLUDED.emails_delivered) * 100, 2)
      ELSE 0
    END,
    click_rate = CASE
      WHEN EXCLUDED.emails_delivered > 0
      THEN ROUND((EXCLUDED.emails_clicked::DECIMAL / EXCLUDED.emails_delivered) * 100, 2)
      ELSE 0
    END,
    bounce_rate = CASE
      WHEN EXCLUDED.emails_sent > 0
      THEN ROUND((EXCLUDED.emails_bounced::DECIMAL / EXCLUDED.emails_sent) * 100, 2)
      ELSE 0
    END,
    complaint_rate = CASE
      WHEN EXCLUDED.emails_sent > 0
      THEN ROUND((EXCLUDED.emails_complained::DECIMAL / EXCLUDED.emails_sent) * 100, 2)
      ELSE 0
    END,
    updated_at = NOW();
END;
$$;

-- Schedule daily analytics update
SELECT cron.schedule('update-email-analytics', '0 1 * * *', 'SELECT update_daily_email_analytics();');
```

#### Performance Tracking Service
```typescript
// lib/email/analytics.ts
export class EmailAnalyticsService {
  constructor(private db: SupabaseClient) {}

  async getEmailMetrics(period: 'day' | 'week' | 'month' = 'week'): Promise<EmailMetrics> {
    const startDate = this.getStartDate(period);

    const { data } = await this.db
      .from('email_analytics_daily')
      .select('*')
      .gte('date', startDate)
      .order('date', { ascending: true });

    return this.aggregateMetrics(data || []);
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    const { data } = await this.db
      .from('email_template_performance')
      .select('*')
      .order('total_sent', { ascending: false });

    return data || [];
  }

  async trackEmailEngagement(emailId: string, event: EngagementEvent): Promise<void> {
    // Real-time engagement tracking for immediate responses
    await this.db.from('email_engagement_realtime').insert({
      email_log_id: emailId,
      event_type: event.type,
      timestamp: event.timestamp,
      metadata: event.metadata
    });
  }

  private aggregateMetrics(dailyData: DailyAnalytics[]): EmailMetrics {
    const totals = dailyData.reduce(
      (acc, day) => ({
        sent: acc.sent + day.emails_sent,
        delivered: acc.delivered + day.emails_delivered,
        opened: acc.opened + day.emails_opened,
        clicked: acc.clicked + day.emails_clicked,
        bounced: acc.bounced + day.emails_bounced,
        complained: acc.complained + day.emails_complained
      }),
      { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0 }
    );

    return {
      ...totals,
      deliveryRate: totals.sent > 0 ? (totals.delivered / totals.sent) * 100 : 0,
      openRate: totals.delivered > 0 ? (totals.opened / totals.delivered) * 100 : 0,
      clickRate: totals.delivered > 0 ? (totals.clicked / totals.delivered) * 100 : 0,
      bounceRate: totals.sent > 0 ? (totals.bounced / totals.sent) * 100 : 0,
      complaintRate: totals.sent > 0 ? (totals.complained / totals.sent) * 100 : 0
    };
  }
}
```

### 7. Background Job Processing Options for Vercel

#### Option 1: Vercel Cron Jobs (Recommended for Simple Cases)
```typescript
// app/api/cron/process-emails/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  // Verify cron secret
  const authHeader = headers().get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emailQueue = new SupabaseEmailQueue(supabase);
    await emailQueue.processQueue();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/process-emails",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/cron/update-analytics",
      "schedule": "0 1 * * *"
    }
  ]
}
```

#### Option 2: External Job Queue (Recommended for Heavy Workloads)
```typescript
// lib/email/external-queue.ts
import { QueueClient } from '@aws-sdk/client-sqs'; // or Bull Queue with Redis

export class ExternalEmailQueue {
  private queueClient: QueueClient;
  private queueUrl: string;

  constructor() {
    this.queueClient = new QueueClient({ region: 'us-east-1' });
    this.queueUrl = process.env.EMAIL_QUEUE_URL!;
  }

  async addToQueue(emails: EmailTemplate[]): Promise<void> {
    const messages = emails.map(email => ({
      Id: generateId(),
      MessageBody: JSON.stringify(email),
      DelaySeconds: 0
    }));

    // Send in batches of 10 (SQS limit)
    const batches = chunk(messages, 10);

    for (const batch of batches) {
      await this.queueClient.sendMessageBatch({
        QueueUrl: this.queueUrl,
        Entries: batch
      });
    }
  }

  // Separate worker service processes the queue
}
```

#### Option 3: Supabase Edge Functions (For Complex Processing)
```typescript
// supabase/functions/process-email-queue/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process email queue logic here
    const emailQueue = new SupabaseEmailQueue(supabase);
    await emailQueue.processQueue();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### 8. Complete Implementation Architecture

#### Email Service Factory
```typescript
// lib/email/factory.ts
export class EmailServiceFactory {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!this.instance) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      this.instance = new EmailService(resend, supabase);
    }

    return this.instance;
  }

  static createQueue(): EmailQueue {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    return new SupabaseEmailQueue(supabase);
  }

  static createAnalytics(): EmailAnalyticsService {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    return new EmailAnalyticsService(supabase);
  }
}
```

#### Environment Configuration
```env
# Resend Configuration
RESEND_API_KEY=re_123456789
RESEND_FROM_EMAIL=noreply@domani.app
RESEND_REPLY_TO=support@domani.app
RESEND_WEBHOOK_SECRET=whsec_123456789

# Supabase Configuration
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Queue Configuration
EMAIL_QUEUE_BATCH_SIZE=50
EMAIL_RATE_LIMIT_PER_SECOND=10
EMAIL_RATE_LIMIT_PER_MONTH=50000

# Cron Secret
CRON_SECRET=your-secret-key

# External Queue (Optional)
EMAIL_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/email-queue
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

## Performance Impact
- Queue-based processing prevents API timeouts
- Rate limiting prevents service interruptions
- Background processing improves user experience
- Analytics provide optimization insights

## Next Steps
1. Implement email service architecture
2. Set up webhook endpoints for delivery tracking
3. Create database migrations for email tables
4. Configure cron jobs for queue processing
5. Set up monitoring and alerting
6. Implement email template system
7. Add email analytics dashboard

## Notes
- Resend offers excellent deliverability and developer experience
- Supabase + pg_cron provides robust queue management
- Webhook handling is crucial for delivery tracking
- Rate limiting prevents service disruptions
- Background processing is essential for bulk operations
- Analytics enable continuous optimization

## Timestamp
Created: 2025-09-19 12:50:00
Research Focus: Email Service Architecture for Next.js/Vercel/Supabase

## Architecture Recommendations

### For Small to Medium Volume (< 10k emails/month)
1. Use Vercel Cron Jobs with Supabase queue
2. Implement simple rate limiting with Vercel KV
3. Use Resend webhooks for tracking
4. Store analytics in Supabase

### For Large Volume (> 10k emails/month)
1. Use external queue service (SQS/Redis)
2. Implement Supabase Edge Functions for processing
3. Use dedicated worker services
4. Implement advanced analytics and monitoring

### Production Checklist
- [ ] Set up proper error handling and retries
- [ ] Implement comprehensive logging
- [ ] Configure monitoring and alerting
- [ ] Test webhook signature verification
- [ ] Set up email template versioning
- [ ] Implement unsubscribe handling
- [ ] Configure bounce and complaint handling
- [ ] Set up analytics dashboard
- [ ] Test rate limiting behavior
- [ ] Verify GDPR compliance features
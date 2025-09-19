-- ============================================
-- Phase 7: Email Campaign Database Schema
-- ============================================
-- This migration creates the foundation for email marketing functionality
-- including templates, campaigns, and recipient tracking

-- ============================================
-- 1. Email Templates Table
-- ============================================
-- Store reusable email templates with versioning support

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- welcome, newsletter, promotion, transactional

  -- Email content
  subject VARCHAR(500) NOT NULL,
  preview_text VARCHAR(255), -- Email preview/preheader text
  html_content TEXT NOT NULL,
  text_content TEXT, -- Plain text version

  -- Variable placeholders (e.g., {{first_name}}, {{company}})
  variables JSONB DEFAULT '[]'::JSONB,

  -- Template settings
  from_name VARCHAR(255),
  from_email VARCHAR(255),
  reply_to_email VARCHAR(255),

  -- Status and tracking
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false, -- Default template for category

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_category CHECK (
    category IN ('welcome', 'newsletter', 'promotion', 'transactional', 'notification', 'other')
  )
);

-- Indexes for performance
CREATE INDEX idx_email_templates_category ON email_templates(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_email_templates_active ON email_templates(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_email_templates_created_at ON email_templates(created_at DESC);

-- ============================================
-- 2. Email Campaigns Table
-- ============================================
-- Manage email campaigns with scheduling and tracking

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Campaign metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'manual', -- manual, automated, triggered

  -- Template and content
  template_id UUID REFERENCES email_templates(id),
  subject VARCHAR(500) NOT NULL, -- Can override template subject
  preview_text VARCHAR(255),
  html_content TEXT, -- Can override template content
  text_content TEXT,

  -- Sender information (overrides template if provided)
  from_name VARCHAR(255),
  from_email VARCHAR(255),
  reply_to_email VARCHAR(255),

  -- Recipient targeting
  recipient_filter JSONB DEFAULT '{}'::JSONB, -- Filter criteria for recipients
  recipient_count INTEGER DEFAULT 0, -- Cached count of recipients

  -- Campaign status
  status VARCHAR(50) DEFAULT 'draft',

  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Campaign metrics (updated after sending)
  metrics JSONB DEFAULT '{
    "total_sent": 0,
    "delivered": 0,
    "opened": 0,
    "clicked": 0,
    "bounced": 0,
    "unsubscribed": 0
  }'::JSONB,

  -- Settings
  settings JSONB DEFAULT '{
    "track_opens": true,
    "track_clicks": true,
    "include_unsubscribe": true
  }'::JSONB,

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_status CHECK (
    status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled', 'failed')
  ),
  CONSTRAINT valid_type CHECK (
    type IN ('manual', 'automated', 'triggered', 'test')
  )
);

-- Indexes for performance
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_email_campaigns_scheduled ON email_campaigns(scheduled_at) WHERE status = 'scheduled' AND deleted_at IS NULL;
CREATE INDEX idx_email_campaigns_created_at ON email_campaigns(created_at DESC);
CREATE INDEX idx_email_campaigns_template ON email_campaigns(template_id);

-- ============================================
-- 3. Campaign Recipients Table
-- ============================================
-- Track individual email sends and their status

CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES waitlist(id), -- Link to waitlist user

  -- Recipient info (denormalized for history)
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),

  -- Personalization data
  merge_data JSONB DEFAULT '{}'::JSONB, -- Data for template variables

  -- Delivery status
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_type VARCHAR(50), -- hard, soft, blocked
  bounce_reason TEXT,

  -- Engagement tracking
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  clicked_links JSONB DEFAULT '[]'::JSONB, -- Array of clicked URLs

  -- Unsubscribe tracking
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,

  -- Email provider response
  provider_id VARCHAR(255), -- Message ID from email provider
  provider_response JSONB, -- Full response from provider

  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_recipient_status CHECK (
    status IN ('pending', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed')
  ),
  CONSTRAINT valid_bounce_type CHECK (
    bounce_type IN ('hard', 'soft', 'blocked', 'complaint', 'other')
  )
);

-- Indexes for performance
CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_email ON campaign_recipients(email);
CREATE INDEX idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX idx_campaign_recipients_sent_at ON campaign_recipients(sent_at DESC);
CREATE INDEX idx_campaign_recipients_recipient ON campaign_recipients(recipient_id);

-- Unique constraint to prevent duplicate sends
CREATE UNIQUE INDEX idx_campaign_recipients_unique ON campaign_recipients(campaign_id, email);

-- ============================================
-- 4. Email Unsubscribes Table (Global)
-- ============================================
-- Global suppression list for unsubscribed emails

CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email VARCHAR(255) NOT NULL,
  reason VARCHAR(255),
  feedback TEXT,

  -- Source of unsubscribe
  campaign_id UUID REFERENCES email_campaigns(id),
  unsubscribe_token UUID DEFAULT gen_random_uuid(),

  -- Tracking
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,

  -- Allow re-subscription
  resubscribed_at TIMESTAMPTZ,

  CONSTRAINT unique_email_unsubscribe UNIQUE(email)
);

-- Index for quick lookup
CREATE INDEX idx_email_unsubscribes_email ON email_unsubscribes(email) WHERE resubscribed_at IS NULL;

-- ============================================
-- 5. Helper Functions
-- ============================================

-- Function to update campaign metrics
CREATE OR REPLACE FUNCTION update_campaign_metrics(p_campaign_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE email_campaigns
  SET
    metrics = jsonb_build_object(
      'total_sent', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND status != 'pending'),
      'delivered', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND status = 'delivered'),
      'opened', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND opened_at IS NOT NULL),
      'clicked', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND clicked_at IS NOT NULL),
      'bounced', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND status = 'bounced'),
      'unsubscribed', (SELECT COUNT(*) FROM campaign_recipients WHERE campaign_id = p_campaign_id AND unsubscribed_at IS NOT NULL)
    ),
    updated_at = NOW()
  WHERE id = p_campaign_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get subscriber status
CREATE OR REPLACE FUNCTION is_email_subscribed(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM email_unsubscribes
    WHERE email = p_email
    AND resubscribed_at IS NULL
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. Row Level Security Policies
-- ============================================

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Templates: Admins can manage all
CREATE POLICY "Admins can manage email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON u.id = au.user_id
      WHERE u.id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.is_active = true
    )
  );

-- Campaigns: Admins can manage all
CREATE POLICY "Admins can manage email campaigns"
  ON email_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON u.id = au.user_id
      WHERE u.id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.is_active = true
    )
  );

-- Recipients: Admins can view/manage
CREATE POLICY "Admins can manage campaign recipients"
  ON campaign_recipients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON u.id = au.user_id
      WHERE u.id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor')
      AND au.is_active = true
    )
  );

-- Unsubscribes: Public can insert (for unsubscribe links), admins can view
CREATE POLICY "Public can unsubscribe"
  ON email_unsubscribes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view unsubscribes"
  ON email_unsubscribes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      JOIN auth.users u ON u.id = au.user_id
      WHERE u.id = auth.uid()
      AND au.role IN ('super_admin', 'admin', 'editor', 'viewer')
      AND au.is_active = true
    )
  );

-- ============================================
-- 7. Triggers for Updated Timestamps
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_recipients_updated_at
  BEFORE UPDATE ON campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. Sample Data (Optional - Remove in Production)
-- ============================================

-- Insert sample welcome email template
INSERT INTO email_templates (
  name,
  category,
  subject,
  preview_text,
  html_content,
  text_content,
  variables,
  from_name,
  from_email,
  is_default
) VALUES (
  'Welcome Email',
  'welcome',
  'Welcome to Domani, {{first_name}}!',
  'Start planning your tomorrow, tonight',
  '<h1>Welcome to Domani, {{first_name}}!</h1><p>We''re excited to have you join us.</p>',
  'Welcome to Domani, {{first_name}}! We''re excited to have you join us.',
  '["first_name", "email"]'::JSONB,
  'Domani Team',
  'hello@domani.app',
  true
) ON CONFLICT DO NOTHING;

-- Insert sample newsletter template
INSERT INTO email_templates (
  name,
  category,
  subject,
  preview_text,
  html_content,
  text_content,
  variables,
  from_name,
  from_email
) VALUES (
  'Monthly Newsletter',
  'newsletter',
  'Domani Monthly Update - {{month}}',
  'New features and productivity tips',
  '<h1>Domani Monthly Update</h1><p>Here''s what''s new this month...</p>',
  'Domani Monthly Update - Here''s what''s new this month...',
  '["month", "first_name"]'::JSONB,
  'Domani Newsletter',
  'newsletter@domani.app'
) ON CONFLICT DO NOTHING;
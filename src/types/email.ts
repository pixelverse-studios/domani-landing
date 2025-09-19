/**
 * Email Campaign System Type Definitions
 * Matches the database schema for email marketing functionality
 */

// ============================================
// Enums
// ============================================

export enum EmailTemplateCategory {
  Welcome = 'welcome',
  Newsletter = 'newsletter',
  Promotion = 'promotion',
  Transactional = 'transactional',
  Notification = 'notification',
  Other = 'other'
}

export enum CampaignStatus {
  Draft = 'draft',
  Scheduled = 'scheduled',
  Sending = 'sending',
  Sent = 'sent',
  Cancelled = 'cancelled',
  Failed = 'failed'
}

export enum CampaignType {
  Manual = 'manual',
  Automated = 'automated',
  Triggered = 'triggered',
  Test = 'test'
}

export enum RecipientStatus {
  Pending = 'pending',
  Queued = 'queued',
  Sent = 'sent',
  Delivered = 'delivered',
  Opened = 'opened',
  Clicked = 'clicked',
  Bounced = 'bounced',
  Failed = 'failed',
  Unsubscribed = 'unsubscribed'
}

export enum BounceType {
  Hard = 'hard',
  Soft = 'soft',
  Blocked = 'blocked',
  Complaint = 'complaint',
  Other = 'other'
}

// ============================================
// Database Tables
// ============================================

/**
 * Email Template
 */
export interface EmailTemplate {
  id: string
  name: string
  description?: string
  category?: EmailTemplateCategory

  // Email content
  subject: string
  previewText?: string
  htmlContent: string
  textContent?: string

  // Variables for personalization
  variables: string[] // e.g., ['first_name', 'email', 'company']

  // Sender info
  fromName?: string
  fromEmail?: string
  replyToEmail?: string

  // Status
  isActive: boolean
  isDefault: boolean

  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  deletedAt?: Date
}

/**
 * Email Campaign
 */
export interface EmailCampaign {
  id: string
  name: string
  description?: string
  type: CampaignType

  // Template and content
  templateId?: string
  subject: string
  previewText?: string
  htmlContent?: string
  textContent?: string

  // Sender info
  fromName?: string
  fromEmail?: string
  replyToEmail?: string

  // Recipients
  recipientFilter: RecipientFilter
  recipientCount: number

  // Status
  status: CampaignStatus

  // Scheduling
  scheduledAt?: Date
  sentAt?: Date
  completedAt?: Date

  // Metrics
  metrics: CampaignMetrics

  // Settings
  settings: CampaignSettings

  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  deletedAt?: Date
}

/**
 * Campaign Recipient
 */
export interface CampaignRecipient {
  id: string
  campaignId: string
  recipientId?: string // Link to waitlist user

  // Recipient info
  email: string
  firstName?: string
  lastName?: string

  // Personalization
  mergeData: Record<string, any>

  // Delivery status
  status: RecipientStatus
  sentAt?: Date
  deliveredAt?: Date
  bouncedAt?: Date
  bounceType?: BounceType
  bounceReason?: string

  // Engagement
  openedAt?: Date
  openCount: number
  clickedAt?: Date
  clickCount: number
  clickedLinks: string[]

  // Unsubscribe
  unsubscribedAt?: Date
  unsubscribeReason?: string

  // Provider info
  providerId?: string
  providerResponse?: Record<string, any>

  // Audit
  createdAt: Date
  updatedAt: Date
}

/**
 * Email Unsubscribe
 */
export interface EmailUnsubscribe {
  id: string
  email: string
  reason?: string
  feedback?: string
  campaignId?: string
  unsubscribeToken: string
  unsubscribedAt: Date
  ipAddress?: string
  userAgent?: string
  resubscribedAt?: Date
}

// ============================================
// Support Types
// ============================================

/**
 * Recipient filter criteria
 */
export interface RecipientFilter {
  // Filter by waitlist status
  status?: 'all' | 'pending' | 'invited' | 'registered'

  // Filter by source
  source?: string[]

  // Filter by date range
  dateFrom?: Date
  dateTo?: Date

  // Custom filters
  customFilters?: Record<string, any>
}

/**
 * Campaign metrics
 */
export interface CampaignMetrics {
  totalSent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number

  // Calculated rates
  deliveryRate?: number
  openRate?: number
  clickRate?: number
  bounceRate?: number
  unsubscribeRate?: number
}

/**
 * Campaign settings
 */
export interface CampaignSettings {
  trackOpens: boolean
  trackClicks: boolean
  includeUnsubscribe: boolean

  // Advanced settings
  sendTimeOptimization?: boolean
  abTesting?: {
    enabled: boolean
    variants?: CampaignVariant[]
  }
}

/**
 * A/B test variant
 */
export interface CampaignVariant {
  id: string
  name: string
  subject?: string
  previewText?: string
  templateId?: string
  percentage: number // Traffic percentage
  metrics?: CampaignMetrics
}

// ============================================
// Request/Response Types
// ============================================

/**
 * Create email template request
 */
export interface CreateEmailTemplateRequest {
  name: string
  category?: EmailTemplateCategory
  subject: string
  previewText?: string
  htmlContent: string
  textContent?: string
  variables?: string[]
  fromName?: string
  fromEmail?: string
  replyToEmail?: string
  isDefault?: boolean
}

/**
 * Update email template request
 */
export interface UpdateEmailTemplateRequest extends Partial<CreateEmailTemplateRequest> {
  isActive?: boolean
}

/**
 * Create campaign request
 */
export interface CreateCampaignRequest {
  name: string
  description?: string
  type?: CampaignType
  templateId?: string
  subject: string
  previewText?: string
  htmlContent?: string
  textContent?: string
  recipientFilter?: RecipientFilter
  scheduledAt?: Date
  settings?: Partial<CampaignSettings>
}

/**
 * Update campaign request
 */
export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  status?: CampaignStatus
}

/**
 * Send campaign request
 */
export interface SendCampaignRequest {
  campaignId: string
  testMode?: boolean
  testEmails?: string[]
}

/**
 * Campaign list response
 */
export interface CampaignListResponse {
  campaigns: EmailCampaign[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Template list response
 */
export interface TemplateListResponse {
  templates: EmailTemplate[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// Extended Types (with relations)
// ============================================

/**
 * Campaign with template
 */
export interface CampaignWithTemplate extends EmailCampaign {
  template?: EmailTemplate
}

/**
 * Campaign with recipients
 */
export interface CampaignWithRecipients extends EmailCampaign {
  recipients: CampaignRecipient[]
}

/**
 * Campaign analytics
 */
export interface CampaignAnalytics {
  campaign: EmailCampaign
  metrics: CampaignMetrics

  // Time-based metrics
  hourlyStats?: {
    hour: string
    opens: number
    clicks: number
  }[]

  // Link performance
  topLinks?: {
    url: string
    clicks: number
    uniqueClicks: number
  }[]

  // Device/client stats
  deviceStats?: {
    desktop: number
    mobile: number
    tablet: number
  }

  // Geographic stats
  geoStats?: {
    country: string
    count: number
  }[]
}

// ============================================
// Utility Functions
// ============================================

/**
 * Calculate campaign metrics rates
 */
export function calculateMetricRates(metrics: CampaignMetrics): CampaignMetrics {
  const total = metrics.totalSent || 1 // Prevent division by zero

  return {
    ...metrics,
    deliveryRate: (metrics.delivered / total) * 100,
    openRate: (metrics.opened / metrics.delivered) * 100,
    clickRate: (metrics.clicked / metrics.delivered) * 100,
    bounceRate: (metrics.bounced / total) * 100,
    unsubscribeRate: (metrics.unsubscribed / metrics.delivered) * 100
  }
}

/**
 * Get status badge color
 */
export function getCampaignStatusColor(status: CampaignStatus): string {
  const colors: Record<CampaignStatus, string> = {
    [CampaignStatus.Draft]: 'gray',
    [CampaignStatus.Scheduled]: 'blue',
    [CampaignStatus.Sending]: 'yellow',
    [CampaignStatus.Sent]: 'green',
    [CampaignStatus.Cancelled]: 'red',
    [CampaignStatus.Failed]: 'red'
  }
  return colors[status] || 'gray'
}

/**
 * Get recipient status color
 */
export function getRecipientStatusColor(status: RecipientStatus): string {
  const colors: Record<RecipientStatus, string> = {
    [RecipientStatus.Pending]: 'gray',
    [RecipientStatus.Queued]: 'blue',
    [RecipientStatus.Sent]: 'blue',
    [RecipientStatus.Delivered]: 'green',
    [RecipientStatus.Opened]: 'green',
    [RecipientStatus.Clicked]: 'green',
    [RecipientStatus.Bounced]: 'red',
    [RecipientStatus.Failed]: 'red',
    [RecipientStatus.Unsubscribed]: 'orange'
  }
  return colors[status] || 'gray'
}

/**
 * Format campaign type
 */
export function formatCampaignType(type: CampaignType): string {
  const formats: Record<CampaignType, string> = {
    [CampaignType.Manual]: 'Manual',
    [CampaignType.Automated]: 'Automated',
    [CampaignType.Triggered]: 'Triggered',
    [CampaignType.Test]: 'Test'
  }
  return formats[type] || type
}

/**
 * Check if campaign is editable
 */
export function isCampaignEditable(status: CampaignStatus): boolean {
  return status === CampaignStatus.Draft || status === CampaignStatus.Scheduled
}

/**
 * Check if campaign can be sent
 */
export function canSendCampaign(campaign: EmailCampaign): boolean {
  return campaign.status === CampaignStatus.Draft &&
         campaign.recipientCount > 0 &&
         campaign.subject.length > 0 &&
         (campaign.htmlContent?.length > 0 || campaign.templateId)
}

// ============================================
// Type Guards
// ============================================

export function isEmailTemplate(obj: any): obj is EmailTemplate {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.subject === 'string' &&
         typeof obj.htmlContent === 'string'
}

export function isEmailCampaign(obj: any): obj is EmailCampaign {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         Object.values(CampaignStatus).includes(obj.status)
}

export function isCampaignRecipient(obj: any): obj is CampaignRecipient {
  return obj &&
         typeof obj.id === 'string' &&
         typeof obj.campaignId === 'string' &&
         typeof obj.email === 'string' &&
         Object.values(RecipientStatus).includes(obj.status)
}
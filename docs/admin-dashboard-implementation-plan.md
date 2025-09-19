# Admin Dashboard Implementation Plan for Domani

## Executive Summary
This document outlines the implementation plan for adding a secure admin dashboard to the Domani landing page. The dashboard will feature Supabase authentication, waitlist management with a data grid interface, and bulk email capabilities for selected users.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Authentication**: Supabase Auth with RBAC
- **Database**: Supabase (PostgreSQL)
- **Data Grid**: TanStack Table v8
- **Email Service**: Resend (already in dependencies)
- **UI Components**: Shadcn/ui + Custom components
- **Real-time Updates**: Supabase Realtime
- **Forms**: React Hook Form + Zod

### Project Structure
```
apps/landing/
├── src/
│   ├── app/
│   │   ├── admin/                    # Admin routes (protected)
│   │   │   ├── layout.tsx           # Admin layout with sidebar
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── login/               # Admin login page
│   │   │   │   └── page.tsx
│   │   │   ├── waitlist/            # Waitlist management
│   │   │   │   └── page.tsx
│   │   │   ├── campaigns/           # Email campaigns
│   │   │   │   ├── page.tsx         # Campaign list
│   │   │   │   ├── new/page.tsx     # Create campaign
│   │   │   │   └── [id]/page.tsx    # Campaign details
│   │   │   ├── templates/           # Email templates
│   │   │   │   └── page.tsx
│   │   │   └── settings/            # Admin settings
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── admin/
│   │       │   ├── auth/             # Admin auth endpoints
│   │       │   ├── users/            # User management
│   │       │   ├── campaigns/        # Email campaign API
│   │       │   └── emails/send/      # Email sending endpoint
│   ├── components/
│   │   ├── admin/
│   │   │   ├── layout/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   └── AdminNav.tsx
│   │   │   ├── data-grid/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── TableToolbar.tsx
│   │   │   │   ├── BulkActions.tsx
│   │   │   │   └── SelectionControls.tsx
│   │   │   ├── email/
│   │   │   │   ├── EmailComposer.tsx
│   │   │   │   ├── TemplateSelector.tsx
│   │   │   │   ├── RecipientSelector.tsx
│   │   │   │   └── EmailPreview.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── admin/
│   │   │   ├── auth.ts              # Admin auth helpers
│   │   │   ├── permissions.ts       # RBAC utilities
│   │   │   └── queries.ts           # Admin-specific queries
│   │   ├── email/
│   │   │   ├── templates.ts         # Email template engine
│   │   │   ├── sender.ts            # Email sending logic
│   │   │   └── compliance.ts        # CAN-SPAM/GDPR compliance
│   ├── emails/                       # React Email templates
│   │   ├── WaitlistWelcome.tsx
│   │   ├── CampaignEmail.tsx
│   │   └── components/
│   └── middleware.ts                 # Enhanced with admin auth
```

## UI/UX Design Specifications

### Design System
```typescript
// Color Palette
const adminColors = {
  // Primary (Purple - matches main brand)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },

  // Neutral (Professional grays)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },

  // Semantic Colors
  success: '#10b981', // Green
  warning: '#f59e0b', // Amber
  danger: '#ef4444',  // Red
  info: '#3b82f6',    // Blue
}
```

### Layout Design

#### Admin Sidebar (240px width)
```
┌────────────────────────┐
│  🟣 Domani Admin       │ <- Brand header
├────────────────────────┤
│ 📊 Dashboard           │ <- Active state
│ 👥 Waitlist            │
│ 📧 Campaigns           │
│ 📝 Templates           │
│ ⚙️ Settings            │
├────────────────────────┤
│ Profile Section        │
│ John Admin             │
│ john@domani.app        │
│ [Sign Out]             │
└────────────────────────┘
```

#### Main Content Area
```
┌──────────────────────────────────────────────────────┐
│  Page Title                    [Action Button]       │ <- Page header
├──────────────────────────────────────────────────────┤
│  [Search...] [Filter ▼] [Date Range]  [Export ▼]    │ <- Toolbar
├──────────────────────────────────────────────────────┤
│  ☑ Select All (847)           [Bulk Actions ▼]      │ <- Selection bar
├──────────────────────────────────────────────────────┤
│  Data Grid Area                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │ ☑ │ Name      │ Email        │ Date    │ Status ││
│  ├─────────────────────────────────────────────────┤│
│  │ ☑ │ John Doe  │ john@...     │ Jan 15  │ Active ││
│  │ ☐ │ Jane Smith│ jane@...     │ Jan 14  │ Pending││
│  └─────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────┤
│  [◀] [1] 2 3 ... 10 [▶]  Showing 1-50 of 500       │ <- Pagination
└──────────────────────────────────────────────────────┘
```

### Email Composer Modal
```
┌────────────────────────────────────────────────────────┐
│  ✕  Compose Email Campaign                            │
├────────────────────────────────────────────────────────┤
│  Campaign Name: [Winter Newsletter]                    │
│                                                        │
│  Recipients:                                           │
│  ┌────────────────────────────────────────────┐       │
│  │ Selected Users (234)                  [▼]  │       │
│  │ ✓ Active users from waitlist               │       │
│  │ ✓ Joined in last 30 days                  │       │
│  └────────────────────────────────────────────┘       │
│                                                        │
│  Subject: [Welcome to Domani - Plan Tomorrow Tonight]  │
│                                                        │
│  Template: [Select Template ▼]  [Preview]            │
│                                                        │
│  Message:                                              │
│  ┌────────────────────────────────────────────┐       │
│  │ [B] [I] [U] [🔗] [📷] [Variable ▼]        │       │
│  ├────────────────────────────────────────────┤       │
│  │ Hi {{firstName}},                          │       │
│  │                                             │       │
│  │ Welcome to Domani! We're excited to have   │       │
│  │ you join our community of productive        │       │
│  │ professionals.                              │       │
│  │                                             │       │
│  └────────────────────────────────────────────┘       │
│                                                        │
│  [Save as Draft]           [Schedule ▼] [Send Now]    │
└────────────────────────────────────────────────────────┘
```

## Database Schema

### 1. Authentication & RBAC Tables
```sql
-- Admin roles table
CREATE TABLE admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role)
);

-- Admin permissions
CREATE TABLE admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  UNIQUE(role, resource, action)
);

-- Audit log for admin actions
CREATE TABLE admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Email Campaign Tables
```sql
-- Email templates
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  from_email TEXT NOT NULL,
  from_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT,
  text_content TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign recipients
CREATE TABLE campaign_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES early_access_users(id),
  email TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Row Level Security Policies
```sql
-- Enable RLS on all admin tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin access to campaigns" ON email_campaigns
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('super_admin', 'admin')
    )
  );
```

## Security Implementation

### 1. Authentication Flow
```typescript
// Authentication middleware
export async function authenticateAdmin(request: NextRequest) {
  const supabase = createServerClient(cookies())
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { authorized: false, redirect: '/admin/login' }
  }

  const { data: adminRole } = await supabase
    .from('admin_roles')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single()

  if (!adminRole?.is_active) {
    return { authorized: false, redirect: '/unauthorized' }
  }

  return {
    authorized: true,
    user: { ...session.user, role: adminRole.role }
  }
}
```

### 2. API Route Protection
```typescript
// API route wrapper
export function withAdminAuth(
  handler: Function,
  requiredPermission?: { resource: string; action: string }
) {
  return async (req: NextRequest) => {
    const auth = await authenticateAdmin(req)

    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (requiredPermission) {
      const hasPermission = await checkPermission(
        auth.user.id,
        requiredPermission
      )

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }

    return handler(req, auth.user)
  }
}
```

### 3. CSRF Protection
```typescript
// CSRF token generation and validation
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  )
}
```

## Email Functionality

### 1. Bulk Email Sending with Resend
```typescript
interface BulkEmailConfig {
  campaignId: string
  recipients: Array<{
    email: string
    variables: Record<string, string>
  }>
  template: {
    subject: string
    html: string
    text?: string
  }
  fromEmail: string
  fromName?: string
}

export async function sendBulkEmails(config: BulkEmailConfig) {
  // Batch recipients (Resend limit: 100 per batch)
  const batches = chunk(config.recipients, 100)
  const results = []

  for (const batch of batches) {
    const emails = batch.map(recipient => ({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: recipient.email,
      subject: replaceVariables(config.template.subject, recipient.variables),
      html: replaceVariables(config.template.html, recipient.variables),
      text: config.template.text ? replaceVariables(config.template.text, recipient.variables) : undefined,
      tags: {
        campaign_id: config.campaignId
      }
    }))

    const { data, error } = await resend.batch.send(emails)

    if (error) {
      // Log error and update campaign status
      await logEmailError(config.campaignId, batch, error)
    } else {
      // Update recipient statuses
      await updateRecipientStatuses(config.campaignId, batch, 'sent')
    }

    results.push({ batch, data, error })

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}
```

### 2. Email Templates with Variables
```typescript
// Variable replacement engine
export function replaceVariables(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match
  })
}

// Default variables for all emails
export function getDefaultVariables(user: WaitlistUser): Record<string, string> {
  return {
    firstName: user.firstName || 'Friend',
    email: user.email,
    joinedDate: formatDate(user.createdAt),
    unsubscribeUrl: `${process.env.NEXT_PUBLIC_URL}/unsubscribe?token=${user.unsubscribeToken}`,
    currentYear: new Date().getFullYear().toString(),
    companyName: 'Domani',
    companyAddress: '123 Productivity St, San Francisco, CA 94107'
  }
}
```

### 3. Email Compliance
```typescript
// Add required compliance elements
export function addComplianceFooter(html: string): string {
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
      <p>
        You're receiving this email because you signed up for Domani's waitlist.
        <br>
        <a href="{{unsubscribeUrl}}" style="color: #666; text-decoration: underline;">Unsubscribe</a> |
        <a href="${process.env.NEXT_PUBLIC_URL}/privacy" style="color: #666; text-decoration: underline;">Privacy Policy</a>
      </p>
      <p>
        {{companyName}}<br>
        {{companyAddress}}
      </p>
    </div>
  `

  // Insert before closing body tag
  return html.replace('</body>', `${footer}</body>`)
}
```

## Implementation Steps

### Phase 1: Foundation (Day 1)
1. **Database Setup**
   - [ ] Create admin tables in Supabase
   - [ ] Set up RLS policies
   - [ ] Create initial super admin user
   - [ ] Add indexes for performance

2. **Authentication**
   - [ ] Implement admin login page
   - [ ] Set up middleware for route protection
   - [ ] Create auth context/hooks
   - [ ] Add session management

3. **Base Layout**
   - [ ] Create admin layout with sidebar
   - [ ] Implement navigation components
   - [ ] Add dark/light mode toggle
   - [ ] Set up responsive design

### Phase 2: Waitlist Management (Day 2)
1. **Data Grid Implementation**
   - [ ] Install and configure TanStack Table
   - [ ] Create DataTable component
   - [ ] Add sorting and filtering
   - [ ] Implement pagination

2. **Selection Features**
   - [ ] Add checkbox column
   - [ ] Implement select all functionality
   - [ ] Create bulk action dropdown
   - [ ] Add selection counter

3. **User Data Display**
   - [ ] Connect to early_access_users table
   - [ ] Display user information
   - [ ] Add status badges
   - [ ] Implement search functionality

### Phase 3: Email Composer (Day 3)
1. **Email UI Components**
   - [ ] Create email composer modal
   - [ ] Add rich text editor
   - [ ] Implement template selector
   - [ ] Build recipient selector

2. **Template System**
   - [ ] Create email templates table
   - [ ] Build template management UI
   - [ ] Add variable system
   - [ ] Implement preview functionality

3. **Campaign Creation**
   - [ ] Create campaign form
   - [ ] Add validation with Zod
   - [ ] Implement draft saving
   - [ ] Add scheduling options

### Phase 4: Email Sending (Day 4)
1. **Resend Integration**
   - [ ] Configure Resend API
   - [ ] Create email sending service
   - [ ] Implement batch processing
   - [ ] Add error handling

2. **Campaign Execution**
   - [ ] Build send confirmation dialog
   - [ ] Implement sending queue
   - [ ] Add progress tracking
   - [ ] Create success/error notifications

3. **Compliance**
   - [ ] Add unsubscribe functionality
   - [ ] Implement compliance footer
   - [ ] Add bounce handling
   - [ ] Create suppression list

### Phase 5: Analytics & Polish (Day 5)
1. **Campaign Analytics**
   - [ ] Create analytics dashboard
   - [ ] Track open rates
   - [ ] Monitor click rates
   - [ ] Display campaign stats

2. **Audit & Logging**
   - [ ] Implement audit trail
   - [ ] Add activity logging
   - [ ] Create admin action history
   - [ ] Build export functionality

3. **Testing & Optimization**
   - [ ] Add unit tests
   - [ ] Perform security audit
   - [ ] Optimize queries
   - [ ] Test email deliverability

### Phase 6: Documentation & Deployment (Day 6)
1. **Documentation**
   - [ ] Create admin user guide
   - [ ] Document API endpoints
   - [ ] Add code comments
   - [ ] Create troubleshooting guide

2. **Deployment Prep**
   - [ ] Set up environment variables
   - [ ] Configure production database
   - [ ] Test in staging environment
   - [ ] Create backup procedures

3. **Launch**
   - [ ] Deploy to production
   - [ ] Monitor for issues
   - [ ] Gather feedback
   - [ ] Plan iterations

## Performance Considerations

### 1. Data Grid Optimization
- Implement virtual scrolling for large datasets
- Use server-side pagination
- Add debounced search
- Cache frequently accessed data

### 2. Email Sending Optimization
- Queue emails for background processing
- Implement retry logic for failures
- Use webhook for delivery tracking
- Batch database updates

### 3. Database Optimization
- Add appropriate indexes
- Use database views for complex queries
- Implement connection pooling
- Regular VACUUM and ANALYZE

## Monitoring & Maintenance

### 1. Error Tracking
- Integrate Sentry for error monitoring
- Add custom error boundaries
- Log failed email sends
- Monitor API response times

### 2. Analytics
- Track admin actions
- Monitor email performance
- Measure feature usage
- Generate weekly reports

### 3. Security Monitoring
- Log all admin access
- Monitor failed login attempts
- Track permission changes
- Regular security audits

## Success Metrics

### Key Performance Indicators
1. **Technical Metrics**
   - Page load time < 2 seconds
   - Email delivery rate > 95%
   - Zero security incidents
   - 99.9% uptime

2. **User Experience Metrics**
   - Admin task completion rate > 90%
   - Email campaign creation time < 5 minutes
   - Bulk action processing < 10 seconds
   - Search response time < 500ms

3. **Business Metrics**
   - Email open rate > 25%
   - Click-through rate > 5%
   - Admin efficiency increase > 50%
   - Support ticket reduction > 30%

## Risk Mitigation

### Potential Risks & Solutions
1. **Email Deliverability Issues**
   - Solution: Implement SPF, DKIM, DMARC
   - Use dedicated IP for sending
   - Monitor sender reputation

2. **Data Security Breach**
   - Solution: Encrypt sensitive data
   - Implement 2FA for admins
   - Regular security audits

3. **Performance Degradation**
   - Solution: Implement caching
   - Use CDN for assets
   - Database query optimization

4. **Admin Errors**
   - Solution: Add confirmation dialogs
   - Implement undo functionality
   - Create audit trails

## Next Steps After Review

Once this plan is approved:
1. Set up the development environment
2. Create feature branches for each phase
3. Begin implementation following the phases
4. Conduct daily reviews and adjustments
5. Test thoroughly before deployment

## Questions for Review

Before implementation, please confirm:
1. Are the admin role levels (super_admin, admin, editor, viewer) appropriate?
2. Should we implement any additional email service providers besides Resend?
3. Do you want real-time collaboration features for multiple admins?
4. Should we add export functionality for waitlist data (CSV, Excel)?
5. Do you need any specific email templates pre-built?
6. Are there any specific compliance requirements (GDPR, CAN-SPAM)?
7. Should we implement A/B testing for email campaigns?

---

This plan provides a comprehensive roadmap for implementing the admin dashboard with all requested features. The modular approach allows for iterative development and testing while maintaining security and performance standards.
# Domani: Complete Project Context
**PixelVerse Studios | Single Source of Truth for Development**

---

## Executive Summary

**Domani** is a cloud-based mobile productivity app that leverages evening planning psychology to help users wake up with clear priorities. Using a freemium model with subscription and lifetime purchase options, we target sustainable growth through flexible monetization that respects user preferences.

### Key Metrics
- **Core Value Proposition**: Plan tomorrow tonight. Wake up ready.
- **Launch Timeline**: 10 weeks to MVP
- **Revenue Goal**: $300,000 ARR in Year 1
- **Business Model**: Freemium (Free + $4.99/month + $99.99 lifetime)

---

## Product Vision & Philosophy

### Core Philosophy
> "Plan tomorrow tonight, wake up ready"

A productivity app that helps users make better decisions in the evening when calm and reflective, not in the morning when rushed and reactive.

### Mission Statement
Help one million people reclaim their mornings through evening planning, with flexible pricing that works for everyone - free users, subscribers, and lifetime purchasers.

### Unique Value Propositions

#### 1. Evening Planning First™
Research-backed methodology: Plan when your mind is calm (evening) rather than rushed (morning). Studies show decision quality decreases throughout the day.

#### 2. Flexible Pricing™
Three ways to use Domani:
- **Free Forever**: 3 tasks/day, basic features
- **Premium Subscription**: $4.99/month or $39.99/year
- **Lifetime Purchase**: $99.99 one-time

#### 3. Simple by Design™
Four default categories cover 90% of life. No feature creep, no overwhelming complexity. Start simple, expand thoughtfully.

#### 4. Sync Everywhere™
Your plans follow you across all devices. Start on phone, check on tablet, review on web (future).

---

## Feature Specifications

### Free Tier (Forever Free)
- **3 tasks per day** - Research shows 3-6 tasks is optimal for daily productivity
- **4 default categories**: Work 💼, Personal 🏠, Health ❤️, Other 📌
- **Evening planning interface** with guided flow
- **Morning execution view** (Focus and List modes)
- **7-day history** to review past performance
- **Basic streak tracking** for habit building
- **Cloud backup** with single device access

### Premium Tier ($4.99/month or $39.99/year)
Everything in Free, plus:
- **Unlimited tasks** per day
- **20+ custom categories** with colors and emojis
- **Smart notifications** (evening planning reminder, morning alert)
- **Multi-device sync** (phone, tablet, web coming soon)
- **Advanced analytics dashboard** with insights
- **Unlimited history** for long-term tracking
- **10+ themes** for personalization
- **Data export** (CSV/JSON)
- **Widgets** for iOS and Android
- **Priority email support**

### Lifetime Unlock ($99.99 one-time)
- All Premium features forever
- All future features included
- No recurring charges ever
- Early access to beta features
- Lifetime supporter badge
- Transferable between devices

### Core Workflows

#### Evening Planning Mode (Default: 8 PM)
1. **Notification** (Premium): "Ready to plan tomorrow?"
2. **Quick Add**: Fast task entry with smart suggestions
3. **Categorization**: Assign each task to a life area
4. **MIT Selection**: Star your Most Important Task
5. **Time Estimates**: Optional duration setting
6. **Balance Check**: "No health tasks today?" nudges
7. **Lock & Confirm**: Finalize tomorrow's plan

#### Morning Execution Mode (Default: 6 AM)
- **Focus Mode**: Shows MIT prominently with minimal distractions
- **List Mode**: All tasks visible with filters and progress tracking

Both modes include:
- Visual progress indicators
- Satisfying completion animations
- Category-based organization
- Quick task management

---

## Technical Architecture

### Technology Stack

```javascript
{
  "frontend": {
    "framework": "React Native (Expo)",
    "state": "Zustand + React Query",
    "auth": "Supabase Auth SDK",
    "payments": "RevenueCat + Stripe"
  },
  "backend": {
    "platform": "Supabase",
    "database": "PostgreSQL (Supabase)",
    "auth": "Supabase Auth (Email, Google, Apple)",
    "functions": "Supabase Edge Functions",
    "storage": "Supabase Storage"
  },
  "services": {
    "payments": "Stripe",
    "email": "Supabase Auth (built-in)",
    "push": "Expo Notifications",
    "analytics": "Mixpanel"
  }
}
```

### System Architecture

```
Mobile App → Supabase Client → PostgreSQL Database
    ↓             ↓                    ↓
RevenueCat    Supabase Auth      Row Level Security
  (IAP)      (OAuth + Email)      (Data Access)
    ↓             ↓                    ↓
App Stores   Edge Functions       Cloud Backup
```

### Database Schema (PostgreSQL with Supabase)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name TEXT,
  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'lifetime')),
  stripe_customer_id VARCHAR(255) UNIQUE,
  push_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plans table  
CREATE TABLE plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  planned_for DATE NOT NULL,
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, planned_for)
);

-- Tasks table with RLS enforcement
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  is_mit BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table (Stripe integration)
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id VARCHAR(255),
  status VARCHAR(50),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
- Users can only access their own data
- Free tier limited to 3 tasks per plan (enforced in database)
- Premium/Lifetime users have unlimited access
- All policies use auth.uid() for security

### Supabase Edge Functions
- `/stripe-webhook`: Handle Stripe subscription events
- `/check-tier`: Verify user tier for premium features
- `/daily-reminder`: Send evening planning notifications
- `/export-data`: Generate CSV/JSON exports for premium users

### Authentication Flow
```javascript
// Supabase handles all auth complexity
- Email/Password with verification
- Magic Link (passwordless)
- Google OAuth
- Apple Sign-In (iOS requirement)
- Automatic session management
- Secure token refresh
- Multi-device sync via auth.uid()
```

---

## Business Model & Monetization

### Three-Tier Pricing Strategy
1. **Free Tier**: Mass adoption, habit formation
2. **Premium Subscription**: Recurring revenue base
3. **Lifetime Option**: High-value one-time revenue

### Pricing Details

| Tier | Price | Billing | Target Users |
|------|-------|---------|--------------|
| Free | $0 | Never | Casual users, trial |
| Premium Monthly | $4.99 | Monthly | Regular users |
| Premium Annual | $39.99 | Annual | Committed users (33% savings) |
| Lifetime | $99.99 | Once | Subscription-averse users |

### Revenue Projections (Year 1)

| Metric | Target | Notes |
|--------|--------|-------|
| Total Users | 50,000 | 85% free, 15% paid |
| Premium Subscribers | 6,500 | 80% annual, 20% monthly |
| Lifetime Purchases | 1,000 | 2% of total users |
| Monthly Recurring Revenue | $32,500 | By month 12 |
| Annual Revenue | $350,000 | Combined all sources |

### Unit Economics
- **Customer Acquisition Cost (CAC)**: $2-5
- **Lifetime Value (LTV)**: $45 (subscription), $99 (lifetime)
- **Gross Margin**: 85% after payment processing
- **Payback Period**: <1 month for annual, immediate for lifetime

---

## User Experience & Journey

### First-Time User Flow
1. **Welcome Screen**: Value proposition, social proof
2. **Sign Up**: Email + password or social login (Google/Apple)
3. **Email Verification**: Handled by Supabase Auth
4. **Onboarding**: Categories intro, time setup
5. **First Task**: Create initial plan
6. **Soft Upsell**: Show premium benefits

### Daily User Journey

#### Evening (8 PM)
1. Notification reminder (Premium)
2. Add tasks (3 free, unlimited premium)
3. Categorize and prioritize
4. Lock plan for tomorrow

#### Morning (6 AM)
1. Morning alert (Premium)
2. View MIT in focus mode
3. Complete tasks throughout day
4. Track progress

### Free to Premium Conversion Journey

#### Trigger Points
- Hitting 3-task limit (enforced by RLS)
- After 7-day streak
- Attempting premium features
- From settings menu

#### Conversion Flow
1. Show value clearly
2. Offer 7-day free trial
3. Multiple payment options (monthly/annual/lifetime)
4. Easy cancellation policy

### Authentication Options
- **Email/Password**: Traditional signup with verification
- **Google Sign-In**: One-tap authentication
- **Apple Sign-In**: Required for iOS App Store
- **Magic Link**: Passwordless email login

---

## Design System & Brand

### Visual Identity

#### Colors
- **Primary**: Purple (#5D3A9B) - Evening/wisdom
- **Secondary**: Blue (#3B4C79) - Morning/productivity
- **Premium**: Gold (#FFB800) - Premium features
- **Categories**: Work (Blue), Personal (Green), Health (Red), Other (Gray)

#### Typography
- **Headers**: SF Pro Display / Roboto
- **Body**: System fonts
- **Sizes**: 12px to 30px scale

#### Key UI Elements
- Task cards with category badges
- Premium crown badge (👑)
- Lock icons for gated features
- Sync status indicators
- Progress visualizations
- OAuth provider buttons (Google/Apple)

---

## Go-to-Market Strategy

### Launch Plan

#### Phase 1: Beta (Month 1)
- 500 beta testers
- Free premium access
- Gather feedback
- Iterate quickly

#### Phase 2: Public Launch (Month 2)
- Product Hunt launch
- App Store optimization
- Content marketing
- Initial paid ads

#### Phase 3: Growth (Months 3-12)
- Scale paid acquisition
- Referral program
- Content marketing
- Influencer partnerships

### Marketing Channels
- **App Store Optimization** (40% of growth)
- **Content Marketing** (25%)
- **Paid Ads** (Facebook, Google) (20%)
- **Referrals** (15%)

### Core Messaging
- **Primary**: "Plan tomorrow tonight, wake up ready"
- **Secondary**: "Your day, your way, your price"
- **Differentiators**: Evening planning + Flexible pricing + Simple design

---

## Development Timeline

### 10-Week Development Plan

#### Weeks 1-2: Backend Infrastructure
- Supabase project setup
- Database schema with RLS policies
- Authentication configuration (Email, Google, Apple)
- Edge Functions setup

#### Weeks 3-4: Frontend Foundation
- Auth screens with Supabase Auth UI
- Core planning interface
- Task management with RLS enforcement
- Basic navigation

#### Weeks 5-6: Monetization
- Stripe integration via Edge Functions
- Subscription management
- In-app purchases (RevenueCat)
- Upgrade flows

#### Weeks 7-8: Premium Features
- Push notifications setup
- Custom categories (premium only)
- Multi-device sync (automatic with Supabase)
- Analytics dashboard

#### Weeks 9-10: Polish & Launch
- Bug fixes
- Performance optimization
- App Store preparation
- Marketing website

---

## Success Metrics & KPIs

### Business Metrics
- **Users**: 50,000 in Year 1
- **Free-to-Paid Conversion**: 5% minimum
- **MRR**: $30,000 by Month 12
- **Churn**: <10% monthly
- **LTV/CAC Ratio**: >3:1

### Product Metrics
- **Daily Active Users**: 40% of total
- **7-Day Retention**: >60%
- **Task Completion Rate**: >70%
- **Evening Planning Rate**: >50%
- **MIT Completion**: >75%

### Technical Metrics
- **API Response Time**: <200ms (Supabase Edge)
- **App Crash Rate**: <0.1%
- **Sync Reliability**: >99.9% (Supabase Realtime)
- **Payment Success**: >95%
- **Auth Success Rate**: >98%

---

## Risk Analysis & Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase downtime | High | Multi-region deployment, status monitoring |
| Data loss | High | Supabase automatic backups, point-in-time recovery |
| Payment failures | Medium | Stripe retry logic, multiple payment methods |
| Auth provider issues | Medium | Multiple providers (Email, Google, Apple) |
| Scaling issues | Medium | Supabase auto-scaling, connection pooling |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low conversion | High | A/B testing, user research |
| High churn | High | Better onboarding, engagement features |
| Competition | Medium | Unique positioning, rapid iteration |
| Platform fees | Medium | Direct payment options, lifetime option |

---

## Future Roadmap

### Year 1: Foundation
- iOS & Android apps with Supabase Auth
- Core feature set with RLS enforcement
- Payment systems (Stripe + RevenueCat)
- 50,000 users

### Year 2: Expansion
- Web application (Supabase Auth works everywhere)
- Team collaboration features
- AI suggestions via Edge Functions
- API for integrations
- 200,000 users

### Year 3: Platform
- Third-party integrations
- White-label options with Supabase Organizations
- Enterprise tier with SSO
- International expansion
- 500,000 users

---

## Development Guidelines

### Core Principles
1. **Mobile-First**: Every feature optimized for mobile
2. **Performance**: <200ms response times via Edge Functions
3. **Reliability**: 99.9% uptime (Supabase SLA)
4. **Security**: RLS policies, secure auth, encrypted connections
5. **Scalability**: Supabase architecture supports 1M+ users
6. **Accessibility**: WCAG 2.1 AA compliance

### Code Standards
- TypeScript everywhere
- Supabase TypeScript generation
- Comprehensive error handling
- RLS policies for all data access
- API documentation via OpenAPI
- Code reviews required
- CI/CD pipeline with preview branches

### Security Implementation
- All data access via Row Level Security
- No client-side security checks needed
- Supabase Auth handles token management
- Automatic session refresh
- Secure OAuth redirects
- Rate limiting on Edge Functions

---

## Team & Resources

### Development Team
- Full-stack developer (1)
- UI/UX designer (1)
- Part-time backend specialist

### Budget
- **Development**: $44,000
- **Infrastructure**: $25/month (Supabase Pro)
- **Marketing**: $50,000 Year 1
- **Total Year 1**: ~$100,000

### Timeline
- **Development**: 10 weeks
- **Beta testing**: 2 weeks
- **Launch preparation**: 2 weeks
- **Total**: 14 weeks to market

---

## Key Differentiators

### Domani vs. Competition

| Feature | Domani | Todoist | Any.do | Things 3 |
|---------|--------|---------|--------|----------|
| Pricing Model | Freemium + Lifetime | Freemium | Freemium | One-time |
| Monthly Cost | $0-4.99 | $0-4 | $0-6 | $0 |
| Lifetime Option | ✅ $99.99 | ❌ | ❌ | ✅ $50 |
| Evening Planning | ✅ Core feature | ❌ | ❌ | ❌ |
| Task Limit (Free) | 3/day (RLS enforced) | Unlimited | Limited | N/A |
| Multi-device | ✅ Premium (Supabase Realtime) | ✅ | ✅ | ✅ |
| Categories | ✅ 4 default + custom | Labels | Lists | Areas |
| Social Login | ✅ Google & Apple | Limited | Limited | ❌ |

### Why We Win
1. **Unique Methodology**: Evening planning is our differentiator
2. **Flexible Pricing**: Appeals to all user segments
3. **Generous Free Tier**: 3 tasks/day is enough to be useful
4. **Simple Design**: Not overwhelming like Notion
5. **Clear Upgrade Path**: Users know exactly what they get
6. **Modern Auth**: Seamless login with Google/Apple via Supabase

---

## Core Mantras

- "Plan tomorrow tonight, wake up ready"
- "Your day, your way, your price"
- "Simple enough to start, powerful enough to scale"
- "Three tasks free, unlimited potential"
- "Evening calm, morning clarity"

---

*This document serves as the single source of truth for Domani development. All decisions should align with the freemium model, evening planning methodology, and flexible pricing strategy outlined here.*

**Document Version**: 3.0  
**Last Updated**: January 2025  
**Status**: Updated for Supabase Auth Integration
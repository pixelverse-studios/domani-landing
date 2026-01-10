# Public Beta Launch - Landing Page Updates Plan

**Created**: 2026-01-04
**Status**: Planning
**Priority**: High

## Executive Summary

This document outlines all required changes to transition the Domani landing page from "Early Access" to "Public Beta" status. The most significant change is a business model pivot from subscription-based pricing to **free trial + one-time lifetime purchase only**.

---

## Business Model Change

### Old Model (Current Site)
- **Free**: $0 forever (3 tasks/day)
- **Premium**: $3.99/month (unlimited)
- **Lifetime**: $99 one-time

### New Model (From Marketing Brief)
- **Free Tier**: $0 forever
  - 3 tasks per day
  - System categories (Work, Wellness, Personal, Education)
  - 7 days task history
  - All core features (MIT, plan locking, reminders)

- **Premium Trial**: 14-day free trial
  - Unlimited tasks per day
  - Custom categories
  - Unlimited history
  - Advanced analytics

- **Lifetime Purchase**: $34.99 one-time (launch pricing)
  - Everything in Premium, forever
  - All future updates
  - No subscription required

### Key Changes
1. **Remove monthly subscription tier entirely**
2. **Update trial from 7-day to 14-day**
3. **Update lifetime price from $99 to $34.99** (launch pricing)
4. **Restructure pricing page to show Free vs Lifetime only**
5. **Update all CTAs to reflect new model**
6. **Create centralized pricing configuration** (see Technical Requirements below)

---

## Required Updates by Section

### 1. Hero Section (`src/components/HeroSection.tsx`)

| Current | New |
|---------|-----|
| Badge: "✨ Early Access Available" | "🚀 Public Beta Now Live" |
| Headline: "Plan Tomorrow Tonight, Wake Up Ready" | "Plan Tomorrow, Tonight" |
| Subheadline: Long psychology text | "Make better decisions when you're calm, not rushed. Execute with clarity." |
| CTA: Waitlist form | Download buttons (iOS/Android) |

**Status**: ✅ Badge & Headline - Ready to implement now
**Status**: 🎫 Download buttons - Needs ticket

### 2. Pricing Page (`src/app/pricing/page.tsx`)

**Current Structure (3 tiers)**:
- Free / Premium ($3.99/mo) / Lifetime ($99)

**New Structure (2 tiers)**:
- Free Forever / Lifetime ($34.99)
- Add "14-day Premium trial included" messaging

**Changes Required**:
- [ ] Remove Premium monthly tier card
- [ ] Update Lifetime price to $34.99 (pull from central config)
- [ ] Update trial period from 7 to 14 days in FAQ
- [ ] Add prominent "Try Premium Free for 14 Days" messaging
- [ ] Update CTAs to "Download Free" / "Unlock Lifetime"
- [ ] Update comparison table (if exists)

**Status**: 🎫 Needs ticket - Major restructure

### 3. Feature Messaging

**Features to Highlight More Prominently**:

| Feature | Current Visibility | Needed Visibility |
|---------|-------------------|-------------------|
| MIT (Most Important Task) | Hidden in mockup | Dedicated section |
| Plan Locking | Button in mockup | Feature highlight |
| Evening Planning (9 PM default) | Mentioned | More prominent |
| Morning Reminder (8 AM default) | Not shown | Add to features |

**Status**: 🎫 Needs ticket

### 4. App Store Integration

**New Elements Needed**:
- [ ] iOS App Store badge/button (placeholder → real link)
- [ ] Google Play Store badge/button (placeholder → real link)
- [ ] Download CTA section in hero
- [ ] Download CTA section in footer
- [ ] Mobile-specific landing experience

**Current Links** (from brief):
- iOS: TestFlight Public Beta Link - TBD
- Android: Google Play Open Testing - In Review

**Status**: ✅ Placeholder buttons - Ready to implement now

### 5. Category Naming

| Current | New (from Brief) |
|---------|-----------------|
| ❤️ Health | ❤️ Wellness |
| 💼 Work | 💼 Work |
| 🏠 Personal | 🏠 Personal |
| (missing) | 📚 Education |

**Locations to Update**:
- Hero mockup task categories
- Any category references in copy

**Status**: 🎫 Needs ticket

### 6. Copy Updates Throughout Site

**Hero Subheadline**:
- Current: "Transform your productivity with evening planning psychology. Add tomorrow's tasks when you're calm, execute when you're focused."
- New: "Make better decisions when you're calm, not rushed. Execute with clarity."

**CTA Text Changes**:
| Location | Current | New |
|----------|---------|-----|
| Hero primary | Waitlist form | "Download Free" |
| Hero secondary | N/A | "See How It Works" |
| Pricing Free | "Start Free" | "Download Free" |
| Pricing Lifetime | "Buy Once, Use Forever" | "Unlock Lifetime - $34.99" |
| App Showcase | "Get Early Access" | "Download Now" |

**Status**: 🎫 Needs ticket

### 7. About Page (`src/app/about/page.tsx`)

**Current Values**:
1. Evening Over Morning
2. Focus on What Matters
3. Opinionated & Simple
4. Flexible Pricing, Zero Pressure

**Update Needed**:
- Value #4 copy should reflect new pricing model (free + lifetime only)

**Status**: 🎫 Needs ticket

### 8. FAQ Updates (`src/app/faq/page.tsx`)

**Questions to Add/Update**:
- [ ] "How does the 14-day trial work?"
- [ ] "What's included in the Lifetime purchase?"
- [ ] "Is there a monthly subscription?" → No, just free + lifetime
- [ ] Update "7-day" references to "14-day"

**Status**: 🎫 Needs ticket

### 9. Technical/Branding Updates

**Color Confirmation** (from Brief):
- Primary Gradient: Pink to Purple (#ec4899 → #a855f7)
- Primary Action: Purple (#a855f7)
- Success: Green (#22c55e)
- These appear to match current implementation ✅

**Status**: ✅ No changes needed

---

## Technical Requirements: Centralized Pricing Configuration

### Problem
Currently, pricing values are hardcoded in multiple locations across the site:
- `src/app/pricing/page.tsx` - Plans array with prices
- Various CTA buttons with price mentions
- FAQ answers referencing prices
- Any future marketing copy

This makes price changes error-prone and requires updating multiple files.

### Solution
Create a single source of truth for all pricing data at `src/lib/config/pricing.ts`.

### Proposed Implementation

```typescript
// src/lib/config/pricing.ts

export const PRICING_CONFIG = {
  // Current launch pricing - easy to update in one place
  lifetime: {
    price: 34.99,
    currency: 'USD',
    displayPrice: '$34.99',
    label: 'Lifetime',
    description: 'Pay once, use forever',
    badge: 'Best Value',
  },

  free: {
    price: 0,
    displayPrice: '$0',
    label: 'Free',
    description: 'Perfect for getting started',
    tasksPerDay: 3,
    historyDays: 7,
  },

  trial: {
    durationDays: 14,
    label: '14-day free trial',
  },

  // Feature flags for easy toggling
  showMonthlyOption: false, // Disabled - lifetime only model
  showAnnualOption: false,  // Disabled - lifetime only model
} as const

// Helper functions
export const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price)
}

export const getLifetimeDisplayPrice = () => PRICING_CONFIG.lifetime.displayPrice
export const getTrialDuration = () => PRICING_CONFIG.trial.durationDays
```

### Files to Refactor

| File | Current State | Refactored State |
|------|---------------|------------------|
| `src/app/pricing/page.tsx` | Hardcoded `$99`, `$3.99` | Import from `PRICING_CONFIG` |
| `src/components/pricing/PricingContent.tsx` | Receives hardcoded props | Use config directly or typed props |
| `src/app/faq/page.tsx` | Hardcoded "7-day" trial | Use `PRICING_CONFIG.trial.durationDays` |
| CTA components | Hardcoded price in text | Use `getLifetimeDisplayPrice()` |

### Benefits
1. **Single source of truth** - Change price once, updates everywhere
2. **Type safety** - TypeScript ensures correct usage
3. **Easy A/B testing** - Can swap configs for experiments
4. **Future flexibility** - Easy to add regional pricing, promotions, etc.
5. **Audit trail** - Git history shows all pricing changes in one file

### Migration Steps
1. Create `src/lib/config/pricing.ts` with config object
2. Update `src/app/pricing/page.tsx` to import and use config
3. Update FAQ to use trial duration from config
4. Search codebase for hardcoded prices and refactor
5. Add ESLint rule or code review check to prevent future hardcoding

**Status**: 🎫 Needs ticket - Should be done FIRST before other pricing changes

---

## Implementation Priority

### Phase 1 - Immediate (Can Do Now)
1. ✅ Update hero badge to "Public Beta Now Live"
2. ✅ Update hero headline to "Plan Tomorrow, Tonight"
3. ✅ Add placeholder download buttons

### Phase 2 - Pricing Restructure (Ticket Required)
4. 🎫 Create centralized pricing config (`src/lib/config/pricing.ts`)
5. 🎫 Remove Premium monthly tier
6. 🎫 Update Lifetime price to $34.99 (via central config)
7. 🎫 Update trial period to 14 days
8. 🎫 Restructure pricing page layout

### Phase 3 - Feature Messaging (Ticket Required)
9. 🎫 Add MIT feature highlight section
10. 🎫 Add Plan Locking feature highlight
11. 🎫 Update category naming (Health → Wellness)
12. 🎫 Add Education category to mockup

### Phase 4 - Download Flow (Ticket Required)
13. 🎫 Replace waitlist with download CTAs
14. 🎫 Add App Store/Play Store links when ready
15. 🎫 Update all CTAs throughout site

### Phase 5 - Copy Polish (Ticket Required)
16. 🎫 Update hero subheadline
17. 🎫 Update About page pricing value
18. 🎫 Update FAQ with new pricing model
19. 🎫 Remove/update "Early Access" language site-wide

---

## Suggested Linear Tickets

### DOM-XXX: Update Landing Page for Public Beta Launch
**Description**: Update hero section status badge and headline for public beta
**Scope**: Badge text, headline copy
**Estimate**: Small

### DOM-XXX: Create Centralized Pricing Configuration
**Description**: Create a single source of truth for all pricing data that the entire site pulls from
**Scope**: New config file, refactor all pricing references
**Estimate**: Medium
**Priority**: Do this FIRST before other pricing changes

### DOM-XXX: Restructure Pricing Page for Lifetime-Only Model
**Description**: Remove subscription tier, update to Free + Lifetime ($34.99) only
**Scope**: Pricing page, pricing component, FAQ (must use central config)
**Estimate**: Medium

### DOM-XXX: Add App Store Download Buttons
**Description**: Add iOS/Android download CTAs with placeholder links
**Scope**: Hero section, footer, new download component
**Estimate**: Medium

### DOM-XXX: Update Feature Messaging for Core Features
**Description**: Add prominent sections for MIT and Plan Locking features
**Scope**: New feature sections or updates to existing
**Estimate**: Medium

### DOM-XXX: Update All CTAs and Copy for Public Launch
**Description**: Replace waitlist language with download CTAs, update copy
**Scope**: Site-wide copy updates
**Estimate**: Medium

### DOM-XXX: Update Categories (Health → Wellness, Add Education)
**Description**: Align category naming with app
**Scope**: Hero mockup, any category references
**Estimate**: Small

---

## Files Affected

| File | Changes |
|------|---------|
| `src/lib/config/pricing.ts` | **NEW** - Centralized pricing configuration |
| `src/components/HeroSection.tsx` | Badge, headline, CTAs, download buttons |
| `src/app/pricing/page.tsx` | Plans data, tier structure (refactor to use config) |
| `src/components/pricing/PricingContent.tsx` | Card layout for 2 tiers |
| `src/app/faq/page.tsx` | Pricing FAQs (refactor to use config) |
| `src/app/about/page.tsx` | Value #4 copy |
| `src/components/Footer.tsx` | Download links |
| `src/components/WaitlistInline.tsx` | Possibly deprecate/replace |
| `src/components/showcase/AppShowcase.tsx` | CTA text |

---

## Notes

- The current site has strong science-backed messaging (Zeigarnik effect, decision fatigue, etc.) - this should be retained
- Testimonials section is disabled awaiting real quotes
- Admin panel exists for waitlist management - may need updates if waitlist is removed
- Dark mode support throughout - all changes must work in both themes

---

## Reference Links

- Marketing Brief: (provided in conversation)
- Current Site: domani-app.com (or local dev)
- Mobile App Repo: (separate repo)

# Sage Green Palette Migration - Comprehensive Scope & Plan

**Date:** 2026-02-07
**Project:** Domani Landing Page Theme Update
**Objective:** Migrate from indigo/purple palette to sage green palette and create theme-ready system

---

## Executive Summary

This plan outlines the complete migration from the current indigo/purple color palette to the new sage green palette, while simultaneously creating a reusable theme system for future color schemes.

### New Color Palette

```
Primary Colors:
- Primary: #7D9B8A
- Primary Light: #A3BFB0
- Primary Dark: #5A7765

Backgrounds:
- Background: #FAF8F5
- Card Background: #F5F2ED

Text Colors:
- Text Primary: #3D4A44
- Text Secondary: #6B7265
- Text Tertiary: #9BA69E
- Text Muted: #ADB7B0

Priority Colors:
- High Priority: #D77A61 (Coral/Terracotta)
- Medium Priority: #E8B86D (Golden Amber)
- Low Priority: #8B9DAF (Blue-Gray)
- Top Priority: Gradient from #7D9B8A to #5A7765

Borders & Dividers:
- Border Primary: #E8E4DD
- Border Secondary: #DDD9D0
- Divider: #E8E4DD

Gradients:
- Primary Gradient: from-[#7D9B8A] to-[#5A7765]
- Primary Light Gradient: from-[#7D9B8A] to-[#A3BFB0]

Interactive States:
- Hover Background: #EFEEE8
- Active/Selected: Primary gradient with shadow rgba(125, 155, 138, 0.3)
```

---

## Current State Analysis

### Existing Color System
- **Primary:** Indigo (#6366f1)
- **Secondary/Evening:** Purple (#8B5CF6, #A855F7)
- **Accent:** Emerald green (#10B981)
- **Implementation:** Mix of Tailwind config, CSS variables (HSL), and some hardcoded values

### Color Distribution
| Color Type | Usage Frequency | Impact Level |
|------------|----------------|--------------|
| Primary/Evening Gradients | Very High | Critical |
| Text Colors (Gray) | Very High | Critical |
| Background Colors | Very High | Critical |
| Border Colors | High | High |
| Feature Accents (Red/Green) | High | Medium |
| Dark Mode Variants | Medium | Medium |

---

## Migration Strategy

### Phase 1: Foundation (Theme System)
**Goal:** Create reusable, theme-ready infrastructure

**Tasks:**
1. Create centralized color tokens file (`src/lib/theme/colors.ts`)
2. Update Tailwind configuration with sage palette
3. Update CSS variables in `globals.css`
4. Create theme utility functions
5. Add dark mode color variants (future-ready)

**Files Created/Modified:**
- `src/lib/theme/colors.ts` (NEW)
- `tailwind.config.js` (MODIFY)
- `src/styles/globals.css` (MODIFY)

---

### Phase 2: Core Components
**Goal:** Update high-impact, frequently-used components

**Tasks:**
1. Update logo and branding colors
2. Update primary buttons and CTAs
3. Update navigation header
4. Update footer
5. Update hero section backgrounds and gradients

**Files Modified:**
- `src/components/Logo.tsx`
- `src/components/ui/button.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`

---

### Phase 3: Feature Sections
**Goal:** Update feature spotlights and content sections

**Tasks:**
1. Update MIT Spotlight (replace red accent)
2. Update Plan Lock Spotlight
3. Update Smart Rollover Spotlight
4. Update Benefits Section gradients
5. Update Benefit Cards
6. Update App Showcase

**Files Modified:**
- `src/components/features/MITSpotlight.tsx`
- `src/components/features/PlanLockSpotlight.tsx`
- `src/components/features/SmartRolloverSpotlight.tsx`
- `src/components/benefits/BenefitsSection.tsx`
- `src/components/benefits/BenefitCard.tsx`
- `src/components/showcase/AppShowcase.tsx`

---

### Phase 4: Secondary Components
**Goal:** Update supporting components and UI elements

**Tasks:**
1. Update Testimonials Section
2. Update Social Proof component
3. Update FAQ Content (hardcoded purple/blue gradients)
4. Update Waitlist Form
5. Update Dynamic CTA
6. Update Alert components
7. Update About Content

**Files Modified:**
- `src/components/testimonials/TestimonialsSection.tsx`
- `src/components/SocialProof.tsx`
- `src/components/faq/FAQContent.tsx`
- `src/components/WaitlistForm.tsx`
- `src/components/DynamicCTA.tsx`
- `src/components/ui/alert.tsx`
- `src/components/about/AboutContent.tsx`

---

### Phase 5: Admin & Utility Components
**Goal:** Update admin panels and utility components

**Tasks:**
1. Update admin alert colors (success/warning/error)
2. Update pricing content highlights
3. Update any remaining hardcoded colors

**Files Modified:**
- `src/components/admin/*.tsx` (multiple files)
- `src/components/pricing/PricingContent.tsx`

---

### Phase 6: Testing & Optimization
**Goal:** Ensure consistency and performance

**Tasks:**
1. Visual regression testing
2. Dark mode compatibility check
3. Accessibility contrast testing (WCAG 2.1 AA)
4. Mobile responsiveness verification
5. Performance audit (ensure no bundle size increase)

---

## Detailed File-by-File Changes

### 1. Configuration Files

#### `tailwind.config.js`
**Changes Needed:**
```javascript
// REPLACE
colors: {
  primary: {
    50: '#eef2ff',
    // ... indigo shades
  },
  evening: {
    // ... purple shades
  }
}

// WITH
colors: {
  primary: {
    50: '#F4F7F5',
    100: '#E8EDE9',
    200: '#D1DBD4',
    300: '#A3BFB0',
    400: '#7D9B8A',
    500: '#7D9B8A', // DEFAULT
    600: '#6A8577',
    700: '#5A7765',
    800: '#4A5F53',
    900: '#3D4A44',
    DEFAULT: '#7D9B8A',
    light: '#A3BFB0',
    dark: '#5A7765',
  },
  sage: {
    // Alias for semantic clarity
    DEFAULT: '#7D9B8A',
    light: '#A3BFB0',
    dark: '#5A7765',
  },
  priority: {
    high: '#D77A61',
    medium: '#E8B86D',
    low: '#8B9DAF',
  }
}
```

**Dark Mode Updates:**
- Update `dark.surface` from `#0F0F11` to `#1A1F1D`
- Update `dark.card` from `#242429` to `#242929`
- Update `dark.elevated` from `#1A1A1F` to `#2D3331`

**Impact:** Critical - affects all Tailwind color classes

---

#### `src/styles/globals.css`
**Changes Needed:**

```css
/* REPLACE :root variables */
--background: 250 250 252; /* old light blue-gray */
--foreground: 30 41 59; /* old dark slate */
--primary: 99 102 241; /* old indigo */

/* WITH new sage palette */
--background: 48 8% 98%; /* #FAF8F5 in HSL */
--card-background: 40 18% 95%; /* #F5F2ED in HSL */
--foreground: 150 9% 27%; /* #3D4A44 in HSL */
--primary: 150 21% 55%; /* #7D9B8A in HSL */
--primary-light: 150 24% 69%; /* #A3BFB0 in HSL */
--primary-dark: 150 20% 41%; /* #5A7765 in HSL */
--text-secondary: 60 6% 42%; /* #6B7265 in HSL */
--text-tertiary: 120 9% 63%; /* #9BA69E in HSL */
--text-muted: 120 9% 69%; /* #ADB7B0 in HSL */
--border: 40 24% 90%; /* #E8E4DD in HSL */
--hover: 60 23% 93%; /* #EFEEE8 in HSL */
```

**CSS Classes to Update:**
- `.gradient-text`: Change from `from-primary-600 to-evening-600` → `from-primary-600 to-primary-800`
- `.gradient-bg`: Update gradient stops
- `.hero-gradient`: Replace indigo/purple rgba → sage rgba
- `.btn-primary`: Update to new primary color

**Impact:** Critical - affects all CSS variable usage

---

### 2. Component Files (High Priority)

#### `src/components/Logo.tsx`
**Current Colors:**
- `from-primary-600 to-evening-600` (brand gradient)

**New Colors:**
- `from-primary-500 to-primary-700` or `from-sage to-sage-dark`

**Impact:** High - visible on every page

---

#### `src/components/HeroSection.tsx`
**Current Colors:**
- Gradient background: `from-primary-50/10 via-white to-white`
- Task priorities: Red (#EF4444), Green (#22C55B), Yellow, Blue
- Blob effects: Primary/Evening blobs

**New Colors:**
- Gradient background: `from-primary-50/20 via-background to-background`
- Task priorities:
  - High: `#D77A61` (coral)
  - Medium: `#E8B86D` (amber)
  - Low: `#8B9DAF` (blue-gray)
  - MIT/Top: Primary gradient
- Blob effects: Primary/Primary-light blobs

**Impact:** Critical - hero is first impression

---

#### `src/components/Header.tsx`
**Current Colors:**
- Nav underline: `from-purple-500 via-purple-400 to-blue-500`
- Hover: `hover:text-primary-600`

**New Colors:**
- Nav underline: `from-primary-500 to-primary-700` (consistent with brand)
- Hover: `hover:text-primary-600` (keep, but now sage)

**Impact:** High - visible on all pages

---

#### `src/components/ui/button.tsx`
**Current Colors:**
- Primary: `bg-primary` (uses CSS variable)
- Secondary: `bg-secondary`
- Accent: `bg-accent`

**New Colors:**
- Will automatically update via CSS variables
- Verify gradient buttons use `from-primary to-primary-dark`

**Impact:** High - buttons throughout site

---

### 3. Feature Components (Medium Priority)

#### `src/components/features/MITSpotlight.tsx`
**Current Colors:**
- Feature badge: `bg-red-500`, `text-red-600`
- Icon backgrounds: `bg-red-600`

**New Colors:**
- Feature badge: `bg-priority-high`, `text-priority-high`
- Icon backgrounds: `bg-priority-high`
- Use coral/terracotta from palette (#D77A61)

**Impact:** Medium - prominent feature, but isolated

---

#### `src/components/faq/FAQContent.tsx`
**Current Colors:**
- Hardcoded gradient: `from-purple-600 to-blue-600`

**New Colors:**
- Consistent gradient: `from-primary-600 to-primary-800`

**Impact:** Medium - FAQ section only

**Note:** This is a hardcoded gradient that doesn't follow the current system

---

### 4. Background & Accent Colors

#### Blob/Abstract Background Elements
**Files Affected:**
- `AboutContent.tsx`
- `PlanLockSpotlight.tsx`
- Various feature sections

**Current Pattern:**
```jsx
from-primary-200 to-primary-300
from-evening-200 to-evening-300
from-blue-200 to-blue-300
```

**New Pattern:**
```jsx
from-primary-100 to-primary-200
from-primary-200 to-primary-300
// No "evening" - use primary-dark variants instead
```

**Impact:** Low - decorative elements

---

## Color Mapping Reference

| Old Color | Old Hex | New Color | New Hex | Usage |
|-----------|---------|-----------|---------|-------|
| Primary-600 | #6366f1 | Primary-500/600 | #7D9B8A | Main brand color |
| Evening-600 | #A855F7 | Primary-700/800 | #5A7765 | Gradient end, dark accent |
| Accent (green) | #10B981 | Priority-high | #D77A61 | Feature highlights |
| Gray-900 | #111827 | Text-primary | #3D4A44 | Headings |
| Gray-600 | #4B5563 | Text-secondary | #6B7265 | Body text |
| Gray-500 | #6B7280 | Text-tertiary | #9BA69E | Muted text |
| Gray-200 | #E5E7EB | Border-primary | #E8E4DD | Borders |
| White | #FFFFFF | Background | #FAF8F5 | Page background |
| Red-500 | #EF4444 | Priority-high | #D77A61 | High priority tasks |
| Green-500 | #22C55B | Success (keep) | #22C55B | Success states |
| Blue-500 | #3B82F6 | Priority-low | #8B9DAF | Low priority |
| Yellow-500 | #EAB308 | Priority-medium | #E8B86D | Medium priority |

---

## Theme System Architecture

### File Structure
```
src/
├── lib/
│   └── theme/
│       ├── colors.ts          (NEW - centralized tokens)
│       ├── tokens.ts          (NEW - design tokens)
│       └── utils.ts           (NEW - theme utilities)
├── styles/
│   └── globals.css            (MODIFY - CSS variables)
└── components/
    └── [all components]        (MODIFY - use theme tokens)
```

### Theme Tokens File (`src/lib/theme/colors.ts`)
**Purpose:**
- Single source of truth for all colors
- Export Tailwind-compatible objects
- Provide helper functions (hex to HSL conversion)
- Enable future theme switching (light/dark/custom)

**Exports:**
```typescript
export const themeColors = { /* all colors */ }
export const tailwindColors = { /* Tailwind config */ }
export const cssVariables = { /* CSS variable values */ }
export function hexToHSL(hex: string): string
```

---

## Risk Assessment

### High Risk Items
1. **Gradient Replacements** - Many components use `primary-to-evening` gradients
   - **Mitigation:** Search all files for "evening" and replace systematically

2. **Dark Mode Compatibility** - New colors need dark mode variants
   - **Mitigation:** Test dark mode after each phase

3. **Accessibility Concerns** - Sage green may have lower contrast
   - **Mitigation:** Run contrast checker on all text/background combos
   - **Requirement:** Maintain WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large)

### Medium Risk Items
1. **Hardcoded Purple/Blue Gradients** - FAQ, Header nav
   - **Mitigation:** Systematic search and replace

2. **Feature Accent Colors** - Red for MIT, green for success
   - **Mitigation:** New priority colors should maintain semantic meaning

### Low Risk Items
1. **Blob/Decorative Backgrounds** - Low visual impact
2. **Admin Components** - Not user-facing

---

## Testing Requirements

### Visual Testing
- [ ] Compare before/after screenshots of all pages
- [ ] Verify gradient transitions are smooth
- [ ] Check blob/background animations render correctly
- [ ] Verify logo looks correct in all sizes

### Accessibility Testing
- [ ] Run WAVE accessibility checker
- [ ] Verify contrast ratios (WebAIM contrast checker)
  - Text-primary on Background: Must be ≥4.5:1
  - Primary on Background: Must be ≥3:1 for UI elements
- [ ] Test with screen readers (VoiceOver, NVDA)
- [ ] Keyboard navigation still works

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & iOS)
- [ ] Firefox
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android)

### Performance Testing
- [ ] Lighthouse score maintains 90+ (before and after)
- [ ] No increase in bundle size
- [ ] CSS file size comparison
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s

---

## Ticket Breakdown

### Epic: Sage Green Palette Migration

#### Ticket 1: Theme System Foundation
**Priority:** P0 (Blocker for other tickets)
**Estimate:** 2-3 hours
**Tasks:**
- Create `src/lib/theme/colors.ts` with all color tokens
- Add helper functions (hexToHSL, color utilities)
- Export Tailwind-compatible objects
- Add JSDoc documentation

**Acceptance Criteria:**
- Color tokens file exports all palette colors
- Tailwind config can import from tokens
- HSL conversion function tested and working

---

#### Ticket 2: Tailwind & CSS Variable Updates
**Priority:** P0 (Blocker for other tickets)
**Estimate:** 2-3 hours
**Tasks:**
- Update `tailwind.config.js` with sage palette
- Remove "evening" color references
- Add priority color definitions
- Update dark mode color variants
- Update `globals.css` CSS variables
- Update utility classes (gradient-text, gradient-bg, etc.)

**Acceptance Criteria:**
- Tailwind generates sage green utility classes
- CSS variables match new palette
- No build errors
- Dark mode variables defined (even if not fully implemented)

**Files:**
- `tailwind.config.js`
- `src/styles/globals.css`

---

#### Ticket 3: Core Branding Components
**Priority:** P0
**Estimate:** 2 hours
**Tasks:**
- Update Logo component gradient
- Update primary Button variants
- Update Header nav underline (remove purple/blue)
- Update Footer hover states
- Test on all pages

**Acceptance Criteria:**
- Logo uses sage gradient on all pages
- Primary buttons use sage colors
- Header nav uses consistent sage underline
- No console errors

**Files:**
- `src/components/Logo.tsx`
- `src/components/ui/button.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

---

#### Ticket 4: Hero Section Redesign
**Priority:** P1
**Estimate:** 3-4 hours
**Tasks:**
- Update hero gradient background
- Replace task priority colors (red→coral, green→keep, yellow→amber, blue→blue-gray)
- Update blob background animations
- Update social proof gradient
- Test mobile responsiveness

**Acceptance Criteria:**
- Hero uses new sage background
- Task priority colors match new palette
- Animations still work smoothly
- Mobile layout preserved

**Files:**
- `src/components/HeroSection.tsx`

---

#### Ticket 5: Feature Spotlights Update
**Priority:** P1
**Estimate:** 3-4 hours
**Tasks:**
- Update MIT Spotlight (red → coral/terracotta)
- Update Plan Lock Spotlight gradients
- Update Smart Rollover Spotlight
- Update blob backgrounds in all spotlights
- Verify icon colors

**Acceptance Criteria:**
- MIT feature uses coral accent (#D77A61)
- All spotlights use sage gradients
- No purple/indigo remnants
- Icons maintain visibility

**Files:**
- `src/components/features/MITSpotlight.tsx`
- `src/components/features/PlanLockSpotlight.tsx`
- `src/components/features/SmartRolloverSpotlight.tsx`

---

#### Ticket 6: Benefits & Showcase Sections
**Priority:** P1
**Estimate:** 2-3 hours
**Tasks:**
- Update BenefitsSection gradient backgrounds
- Update BenefitCard icon gradients
- Update AppShowcase icon backgrounds
- Update card hover states

**Acceptance Criteria:**
- Benefits section uses sage palette
- Icon gradients updated
- Hover states work correctly

**Files:**
- `src/components/benefits/BenefitsSection.tsx`
- `src/components/benefits/BenefitCard.tsx`
- `src/components/showcase/AppShowcase.tsx`

---

#### Ticket 7: Secondary Components Update
**Priority:** P2
**Estimate:** 3 hours
**Tasks:**
- Update Testimonials section background
- Update SocialProof gradient
- Update FAQ hardcoded purple/blue gradient
- Update WaitlistForm button gradient
- Update DynamicCTA gradient
- Update AboutContent blob backgrounds

**Acceptance Criteria:**
- All gradients use sage palette
- No hardcoded purple/blue gradients
- Forms still functional

**Files:**
- `src/components/testimonials/TestimonialsSection.tsx`
- `src/components/SocialProof.tsx`
- `src/components/faq/FAQContent.tsx`
- `src/components/WaitlistForm.tsx`
- `src/components/DynamicCTA.tsx`
- `src/components/about/AboutContent.tsx`

---

#### Ticket 8: Admin & Utility Components
**Priority:** P2
**Estimate:** 2 hours
**Tasks:**
- Update admin alert colors
- Update pricing content highlights
- Search for any remaining hardcoded colors
- Update Alert component variants

**Acceptance Criteria:**
- Admin components use priority colors correctly
- Success/warning/error states maintained
- No hardcoded hex values in components

**Files:**
- `src/components/admin/*.tsx`
- `src/components/pricing/PricingContent.tsx`
- `src/components/ui/alert.tsx`

---

#### Ticket 9: Accessibility & Contrast Audit
**Priority:** P1
**Estimate:** 2-3 hours
**Tasks:**
- Run WAVE accessibility checker
- Check all text/background contrast ratios
- Verify WCAG 2.1 AA compliance
- Document any issues and fixes
- Test keyboard navigation
- Test screen reader compatibility

**Acceptance Criteria:**
- All text meets 4.5:1 contrast ratio (normal text)
- All UI elements meet 3:1 contrast ratio
- WAVE shows no contrast errors
- Keyboard nav works on all interactive elements

**Deliverable:**
- Accessibility audit report in `docs/audits/landing/`

---

#### Ticket 10: Visual Regression Testing
**Priority:** P1
**Estimate:** 2 hours
**Tasks:**
- Take screenshots of all pages (before & after)
- Compare layouts, spacing, typography
- Test on multiple viewports (mobile, tablet, desktop)
- Test dark mode (if enabled)
- Verify animations still work

**Acceptance Criteria:**
- No layout shifts or breaks
- All pages visually consistent
- Mobile responsive on all breakpoints
- Animations smooth

**Deliverable:**
- Visual regression report with screenshots

---

#### Ticket 11: Performance Audit
**Priority:** P2
**Estimate:** 1-2 hours
**Tasks:**
- Run Lighthouse audit (before & after)
- Compare bundle sizes
- Check CSS file size
- Verify Core Web Vitals
- Optimize if needed

**Acceptance Criteria:**
- Lighthouse performance score ≥ 90
- No bundle size increase > 5%
- LCP < 2.5s
- CLS < 0.1

**Deliverable:**
- Performance comparison report

---

#### Ticket 12: Documentation & Audit Trail
**Priority:** P2
**Estimate:** 1 hour
**Tasks:**
- Update `docs/deployment_summary.md`
- Create final audit log in `docs/audits/landing/`
- Document theme system usage for future devs
- Update any relevant READMEs

**Acceptance Criteria:**
- Deployment summary lists all changes
- Audit log created with timestamp
- Theme system documented for reuse

**Deliverable:**
- Complete audit trail in `docs/`

---

## Estimated Total Time

| Phase | Tickets | Hours | Priority |
|-------|---------|-------|----------|
| Foundation | 1-2 | 4-6 | P0 |
| Core Components | 3-4 | 5-7 | P0-P1 |
| Feature Sections | 5-6 | 5-7 | P1 |
| Secondary Updates | 7-8 | 5 | P2 |
| Testing & QA | 9-11 | 5-7 | P1-P2 |
| Documentation | 12 | 1 | P2 |
| **TOTAL** | **12 tickets** | **25-33 hours** | |

**Recommended Sprint:** 1-2 week sprint with daily check-ins

---

## Success Metrics

### Before Launch
- [ ] All 74+ color references updated
- [ ] No "evening", "purple", or old indigo references in code
- [ ] WCAG 2.1 AA compliance maintained
- [ ] Lighthouse score ≥ 90
- [ ] No visual regressions
- [ ] All tests passing
- [ ] Dark mode ready (even if not enabled)

### Post Launch
- [ ] Monitor bounce rate (should not increase)
- [ ] Monitor conversion rate (waitlist signups)
- [ ] Gather user feedback on new design
- [ ] Monitor Core Web Vitals in production

---

## Rollback Plan

### If Issues Arise
1. **Git Safety:** All changes in feature branches, merged via PRs
2. **Revert Commit:** Can revert to previous palette instantly
3. **Staged Rollout:** Consider launching to 10% of users first (A/B test)

### Critical Issues That Warrant Rollback
- Accessibility failures (contrast too low)
- Conversion rate drops > 10%
- Performance degradation (Lighthouse < 80)
- Major visual bugs on production

---

## Future Enhancements (Post-Migration)

### Theme Switching System
Once base migration complete, consider:
1. **Dark Mode:** Full implementation with sage dark variants
2. **Multiple Themes:** User-selectable color schemes
3. **Seasonal Themes:** Holiday or seasonal palettes
4. **Accessibility Themes:** High contrast mode

### Infrastructure Ready For:
- CSS variable swapping
- Theme context provider (React)
- LocalStorage theme persistence
- Smooth theme transitions

---

## Notes & Considerations

### Design Decisions
1. **Why Sage Green?**
   - Calming, focused aesthetic
   - Differentiates from typical productivity apps (blue/purple)
   - Aligns with "evening planning" concept (calm, reflective)

2. **Priority Colors Rationale:**
   - Coral/Terracotta (high): Warm urgency without alarm
   - Golden Amber (medium): Noticeable but not aggressive
   - Blue-Gray (low): Recedes into background appropriately

3. **Gradient Strategy:**
   - Primary → Primary Dark (instead of Primary → Evening)
   - Maintains monochromatic harmony
   - Easier to adapt for future themes

### Technical Decisions
1. **CSS Variables vs Tailwind:**
   - Use both for maximum flexibility
   - CSS variables for dynamic theming
   - Tailwind for developer experience

2. **HSL Color Format:**
   - Easier to adjust lightness/saturation
   - Better for generating color scales
   - Tailwind CSS v3+ standard

---

## Questions for Stakeholders

Before starting implementation:

1. **Dark Mode Priority:**
   - Should we fully implement dark mode in this migration?
   - Or just prepare the tokens for future dark mode?

2. **A/B Testing:**
   - Should we A/B test the new palette before full rollout?
   - What conversion metric should we track?

3. **Accessibility:**
   - What's our minimum contrast requirement?
   - WCAG 2.1 AA (4.5:1) or AAA (7:1)?

4. **Timeline:**
   - Hard deadline or flexible?
   - Preference for speed vs thoroughness?

---

## Appendix: File Inventory

### All Files Requiring Updates (74 total references estimated)

**Configuration (2 files):**
- `tailwind.config.js`
- `src/styles/globals.css`

**Core Components (6 files):**
- `src/components/Logo.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/HeroSection.tsx`
- `src/components/ui/button.tsx`
- `src/components/DynamicCTA.tsx`

**Feature Components (7 files):**
- `src/components/features/MITSpotlight.tsx`
- `src/components/features/PlanLockSpotlight.tsx`
- `src/components/features/SmartRolloverSpotlight.tsx`
- `src/components/benefits/BenefitsSection.tsx`
- `src/components/benefits/BenefitCard.tsx`
- `src/components/showcase/AppShowcase.tsx`
- `src/components/SocialProof.tsx`

**Secondary Components (5 files):**
- `src/components/testimonials/TestimonialsSection.tsx`
- `src/components/faq/FAQContent.tsx`
- `src/components/WaitlistForm.tsx`
- `src/components/about/AboutContent.tsx`
- `src/components/pricing/PricingContent.tsx`

**UI Components (1 file):**
- `src/components/ui/alert.tsx`

**Admin Components (multiple files):**
- `src/components/admin/*.tsx` (estimate 5-10 files)

**New Files to Create (3 files):**
- `src/lib/theme/colors.ts`
- `src/lib/theme/tokens.ts` (optional)
- `src/lib/theme/utils.ts` (optional)

---

**End of Plan**

*Last Updated: 2026-02-07*
*Document Version: 1.0*
*Author: Claude Code*

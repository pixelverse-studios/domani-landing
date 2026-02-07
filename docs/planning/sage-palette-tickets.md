# Sage Green Palette Migration - Linear Ticket Templates

**Epic:** Sage Green Palette Migration & Theme System
**Project:** Domani Landing Page
**Date:** 2026-02-07

---

## Epic Description

Migrate the entire Domani landing page from the current indigo/purple color palette to the new sage green palette, while creating a reusable theme system for future color schemes.

**Goals:**
- Replace all indigo/purple colors with sage green palette
- Create centralized theme system for reusability
- Maintain WCAG 2.1 AA accessibility
- Preserve performance (Lighthouse 90+)
- Enable future theme switching capability

**Success Metrics:**
- All color references updated (74+ locations)
- Accessibility compliance maintained
- No performance degradation
- No visual regressions

---

## Ticket Templates

### TICKET 1: Theme System Foundation 🎨
**Type:** Feature
**Priority:** P0 (Blocker)
**Estimate:** 3 points
**Labels:** `foundation`, `theme-system`, `sage-palette`

**Description:**
Create the centralized theme system infrastructure that will enable consistent color usage across the landing page and support future theme switching.

**Acceptance Criteria:**
- [ ] Create `src/lib/theme/colors.ts` with all sage palette tokens
- [ ] Export `themeColors` object with complete palette
- [ ] Export `tailwindColors` for Tailwind config integration
- [ ] Export `cssVariables` for CSS variable generation
- [ ] Implement `hexToHSL()` conversion utility
- [ ] Add JSDoc documentation for all exports
- [ ] Include dark mode color variants (for future use)
- [ ] No TypeScript errors

**Technical Notes:**
```typescript
// Color palette to implement:
Primary: #7D9B8A, #A3BFB0, #5A7765
Backgrounds: #FAF8F5, #F5F2ED
Text: #3D4A44, #6B7265, #9BA69E, #ADB7B0
Priority: #D77A61, #E8B86D, #8B9DAF
Borders: #E8E4DD, #DDD9D0
```

**Files to Create:**
- `src/lib/theme/colors.ts`

**Dependencies:** None (blocker for all other tickets)

---

### TICKET 2: Tailwind & CSS Variable Configuration ⚙️
**Type:** Feature
**Priority:** P0 (Blocker)
**Estimate:** 3 points
**Labels:** `configuration`, `tailwind`, `sage-palette`

**Description:**
Update Tailwind configuration and global CSS variables to use the new sage green palette. Remove all "evening" (purple) color references and establish the new color system.

**Acceptance Criteria:**
- [ ] Update `tailwind.config.js`:
  - [ ] Replace `primary` with sage green scale (50-900)
  - [ ] Remove `evening` color definitions
  - [ ] Add `sage` alias for semantic clarity
  - [ ] Add `priority` colors (high/medium/low)
  - [ ] Update dark mode surface colors
- [ ] Update `src/styles/globals.css`:
  - [ ] Update `:root` CSS variables (HSL format)
  - [ ] Update `.dark` mode variables
  - [ ] Update utility classes (`.gradient-text`, `.gradient-bg`, `.hero-gradient`)
  - [ ] Update `.btn-primary` styles
- [ ] Import theme tokens from `src/lib/theme/colors.ts`
- [ ] Build succeeds with no errors
- [ ] Generated CSS includes sage color classes

**Technical Notes:**
- Use HSL format for CSS variables for easier manipulation
- Maintain color scale structure (50-900) for Tailwind compatibility
- Dark mode: surface #1A1F1D, card #242929, elevated #2D3331

**Files to Modify:**
- `tailwind.config.js`
- `src/styles/globals.css`

**Dependencies:** Ticket 1 (Theme System Foundation)

**Testing:**
- Run `npm run build` - should succeed
- Verify Tailwind generates `bg-primary-500`, `text-sage-600`, etc.
- Check dev tools that CSS variables are updated

---

### TICKET 3: Core Branding Components 🏷️
**Type:** Feature
**Priority:** P0
**Estimate:** 2 points
**Labels:** `branding`, `sage-palette`, `high-visibility`

**Description:**
Update the most visible branding components: Logo, Buttons, Header, and Footer. These appear on every page and establish the new visual identity.

**Acceptance Criteria:**
- [ ] **Logo Component:**
  - [ ] Replace gradient from `from-primary-600 to-evening-600` → `from-sage-500 to-sage-700`
  - [ ] Test in light and dark modes
  - [ ] Verify in header and footer
- [ ] **Button Component (`ui/button.tsx`):**
  - [ ] Verify primary variant uses new CSS variables
  - [ ] Test all button variants (primary, secondary, outline)
  - [ ] Check hover/active states
- [ ] **Header Component:**
  - [ ] Replace nav underline gradient `from-purple-500 via-purple-400 to-blue-500` → `from-sage-500 to-sage-700`
  - [ ] Update hover states to use sage
  - [ ] Verify mobile menu colors
- [ ] **Footer Component:**
  - [ ] Update link hover colors to `hover:text-primary-600`
  - [ ] Verify all footer sections
- [ ] No purple/indigo colors remain in these components
- [ ] Visual consistency across all pages

**Files to Modify:**
- `src/components/Logo.tsx`
- `src/components/ui/button.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

**Dependencies:** Ticket 2 (Tailwind config must be updated first)

**Testing Checklist:**
- [ ] Check logo on homepage, about, pricing pages
- [ ] Test all button types on forms
- [ ] Verify header on desktop and mobile
- [ ] Check footer links hover correctly

---

### TICKET 4: Hero Section Redesign 🎯
**Type:** Feature
**Priority:** P1
**Estimate:** 4 points
**Labels:** `hero`, `sage-palette`, `high-impact`

**Description:**
Redesign the hero section to use the sage green palette. This is the first impression users get, so it's critical for the new brand identity.

**Acceptance Criteria:**
- [ ] **Background Gradients:**
  - [ ] Replace `from-primary-50/10 via-white to-white` → `from-primary-50/20 via-background to-background`
  - [ ] Update blob animations to use sage colors
- [ ] **Task Priority Colors:**
  - [ ] High priority: `#EF4444` (red) → `#D77A61` (coral/terracotta)
  - [ ] Medium priority: `#EAB308` (yellow) → `#E8B86D` (golden amber)
  - [ ] Low priority: `#3B82F6` (blue) → `#8B9DAF` (blue-gray)
  - [ ] MIT/Top priority: Use primary gradient
  - [ ] Success/completed: Keep green `#22C55B`
- [ ] **Social Proof:**
  - [ ] Update gradient number display to use sage
- [ ] **Blob Effects:**
  - [ ] Replace primary/evening blobs → primary/primary-light
  - [ ] Maintain animation smoothness
- [ ] Mobile responsive on all breakpoints
- [ ] Animations perform smoothly (60fps)

**Files to Modify:**
- `src/components/HeroSection.tsx`

**Dependencies:** Ticket 2, Ticket 3

**Design Notes:**
- Hero gradient should be subtle (20% opacity max)
- Task cards should clearly differentiate priority levels
- Maintain readability of text over background

**Testing:**
- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (768px, 1024px)
- [ ] Mobile (375px, 414px)
- [ ] Check blob animations don't cause layout shift
- [ ] Verify priority colors are distinguishable

---

### TICKET 5: Feature Spotlights Update ⭐
**Type:** Feature
**Priority:** P1
**Estimate:** 4 points
**Labels:** `features`, `sage-palette`

**Description:**
Update all feature spotlight components (MIT, Plan Lock, Smart Rollover) to use the sage palette and new priority colors.

**Acceptance Criteria:**
- [ ] **MIT Spotlight:**
  - [ ] Replace red accent (`bg-red-500`, `text-red-600`) → coral (`#D77A61`)
  - [ ] Update icon backgrounds to `bg-priority-high`
  - [ ] Update feature badge colors
- [ ] **Plan Lock Spotlight:**
  - [ ] Replace gradients to use sage instead of purple/evening
  - [ ] Update blob backgrounds
  - [ ] Verify lock icon colors
- [ ] **Smart Rollover Spotlight:**
  - [ ] Update gradient backgrounds
  - [ ] Update checkmark/bullet colors (keep green if appropriate)
  - [ ] Update icon colors
- [ ] **All Spotlights:**
  - [ ] No purple, indigo, or "evening" color references
  - [ ] Blob animations use primary/primary-light
  - [ ] Hover states work correctly
  - [ ] Icons maintain visibility against backgrounds

**Files to Modify:**
- `src/components/features/MITSpotlight.tsx`
- `src/components/features/PlanLockSpotlight.tsx`
- `src/components/features/SmartRolloverSpotlight.tsx`

**Dependencies:** Ticket 2, Ticket 4

**Visual Check:**
- MIT feature should feel "high priority" but not alarming (coral works well)
- Plan Lock should feel "secure" and "calm" (sage is perfect)
- Smart Rollover should feel "smart" and "helpful"

**Testing:**
- [ ] Verify on homepage features section
- [ ] Check hover/focus states
- [ ] Verify animations still smooth

---

### TICKET 6: Benefits & Showcase Sections 💎
**Type:** Feature
**Priority:** P1
**Estimate:** 3 points
**Labels:** `benefits`, `sage-palette`

**Description:**
Update the benefits section and app showcase to use sage green gradients and backgrounds.

**Acceptance Criteria:**
- [ ] **Benefits Section:**
  - [ ] Update gradient backgrounds from primary/evening → primary/primary-light
  - [ ] Update section background overlays
  - [ ] Verify benefit card layouts
- [ ] **Benefit Card:**
  - [ ] Update icon gradient backgrounds to sage
  - [ ] Update hover states
  - [ ] Verify card shadows/borders use new border colors
- [ ] **App Showcase:**
  - [ ] Update icon backgrounds from `bg-primary-100` to match palette
  - [ ] Update gradient overlays
  - [ ] Verify screenshot borders/shadows
- [ ] All gradients use sage palette
- [ ] Visual hierarchy maintained

**Files to Modify:**
- `src/components/benefits/BenefitsSection.tsx`
- `src/components/benefits/BenefitCard.tsx`
- `src/components/showcase/AppShowcase.tsx`

**Dependencies:** Ticket 2

**Testing:**
- [ ] Hover states on benefit cards work
- [ ] Icon backgrounds have sufficient contrast
- [ ] Mobile layout preserved

---

### TICKET 7: Secondary Components Update 🔧
**Type:** Feature
**Priority:** P2
**Estimate:** 3 points
**Labels:** `secondary`, `sage-palette`

**Description:**
Update secondary components including Testimonials, Social Proof, FAQ, forms, and About page.

**Acceptance Criteria:**
- [ ] **Testimonials Section:**
  - [ ] Update background variants to use sage
  - [ ] Update quote highlight colors
- [ ] **Social Proof:**
  - [ ] Update gradient number display to sage
  - [ ] Update badge colors
- [ ] **FAQ Content:**
  - [ ] CRITICAL: Replace hardcoded `from-purple-600 to-blue-600` → `from-primary-600 to-primary-800`
  - [ ] Update section backgrounds
- [ ] **Waitlist Form:**
  - [ ] Update button gradient to sage
  - [ ] Verify input focus states
- [ ] **Dynamic CTA:**
  - [ ] Update button gradients to sage
  - [ ] Update hover animations
- [ ] **About Content:**
  - [ ] Update blob backgrounds to sage
  - [ ] Update section gradients
  - [ ] Update timeline/milestone colors

**Files to Modify:**
- `src/components/testimonials/TestimonialsSection.tsx`
- `src/components/SocialProof.tsx`
- `src/components/faq/FAQContent.tsx` (HARDCODED GRADIENT)
- `src/components/WaitlistForm.tsx`
- `src/components/DynamicCTA.tsx`
- `src/components/about/AboutContent.tsx`

**Dependencies:** Ticket 2

**Special Note:**
FAQ component has hardcoded purple/blue gradient that doesn't follow current system. This needs manual replacement.

**Testing:**
- [ ] Submit waitlist form (test button)
- [ ] Expand FAQ items
- [ ] Check About page animations
- [ ] Verify social proof numbers display correctly

---

### TICKET 8: Admin & Utility Components 🛠️
**Type:** Feature
**Priority:** P2
**Estimate:** 2 points
**Labels:** `admin`, `utilities`, `sage-palette`

**Description:**
Update admin components and utility components (alerts, pricing) to use the new priority colors and sage palette.

**Acceptance Criteria:**
- [ ] **Admin Components:**
  - [ ] Update success states to use appropriate color (keep green or use sage)
  - [ ] Update warning states to use `priority-medium` (golden amber)
  - [ ] Update error states to use `priority-high` (coral)
  - [ ] Update info states to use sage
- [ ] **Pricing Content:**
  - [ ] Update highlight colors to sage
  - [ ] Update popular badge to use primary gradient
  - [ ] Update feature check marks
- [ ] **Alert Component:**
  - [ ] Update variant colors (success, warning, error, info)
  - [ ] Verify border colors
  - [ ] Check icon colors
- [ ] Semantic meaning preserved (errors still feel like errors)

**Files to Modify:**
- `src/components/admin/*.tsx` (multiple files)
- `src/components/pricing/PricingContent.tsx`
- `src/components/ui/alert.tsx`

**Dependencies:** Ticket 2

**Color Semantics:**
- **Success:** Can use green (#22C55B) OR sage depending on context
- **Warning:** Use golden amber (#E8B86D)
- **Error:** Use coral (#D77A61)
- **Info:** Use sage (#7D9B8A)

**Testing:**
- [ ] Test each alert variant renders
- [ ] Check admin panel (if accessible)
- [ ] Verify pricing page highlights

---

### TICKET 9: Accessibility & Contrast Audit ♿
**Type:** Quality Assurance
**Priority:** P1
**Estimate:** 3 points
**Labels:** `accessibility`, `testing`, `wcag`

**Description:**
Comprehensive accessibility audit to ensure the new sage green palette meets WCAG 2.1 AA standards. Verify contrast ratios and keyboard navigation.

**Acceptance Criteria:**
- [ ] **Contrast Ratio Testing:**
  - [ ] Text-primary (#3D4A44) on Background (#FAF8F5): ≥ 4.5:1 ✓
  - [ ] Text-secondary (#6B7265) on Background: ≥ 4.5:1 ✓
  - [ ] Primary (#7D9B8A) on Background: ≥ 3:1 for UI elements ✓
  - [ ] Priority-high (#D77A61) on Background: ≥ 3:1 ✓
  - [ ] All interactive elements meet minimum contrast
- [ ] **WAVE Accessibility Checker:**
  - [ ] Run on homepage - 0 contrast errors
  - [ ] Run on pricing page - 0 contrast errors
  - [ ] Run on about page - 0 contrast errors
- [ ] **Keyboard Navigation:**
  - [ ] All interactive elements focusable
  - [ ] Focus indicators visible
  - [ ] Tab order logical
- [ ] **Screen Reader Testing:**
  - [ ] Test with VoiceOver (Mac) or NVDA (Windows)
  - [ ] All buttons/links properly labeled
  - [ ] Color is not the only indicator of meaning

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE Browser Extension
- Chrome DevTools Accessibility panel
- Screen readers (VoiceOver, NVDA)

**Deliverable:**
Create `docs/audits/landing/2026-02-07-accessibility-sage-palette.md` with:
- Contrast ratio test results
- WAVE scan results
- Any issues found and how they were fixed
- Screenshots of passing tests

**Dependencies:** Tickets 3-8 (all visual updates complete)

**Fail Criteria (requires fixes):**
- Any text contrast < 4.5:1
- UI element contrast < 3:1
- WAVE shows contrast errors
- Keyboard navigation broken

---

### TICKET 10: Visual Regression Testing 📸
**Type:** Quality Assurance
**Priority:** P1
**Estimate:** 2 points
**Labels:** `testing`, `visual`, `regression`

**Description:**
Comprehensive visual regression testing across all pages and viewports to ensure the color migration didn't break layouts or create visual bugs.

**Acceptance Criteria:**
- [ ] **Screenshot Comparison:**
  - [ ] Homepage (before/after)
  - [ ] Pricing page (before/after)
  - [ ] About page (before/after)
  - [ ] FAQ section (before/after)
  - [ ] Blog (if applicable)
- [ ] **Viewport Testing:**
  - [ ] Desktop: 1920px, 1440px, 1280px
  - [ ] Tablet: 1024px, 768px
  - [ ] Mobile: 414px, 375px, 360px
- [ ] **Browser Testing:**
  - [ ] Chrome (latest)
  - [ ] Safari (latest)
  - [ ] Firefox (latest)
  - [ ] Edge (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Android
- [ ] **Animation Testing:**
  - [ ] Hero blob animations smooth
  - [ ] Scroll animations working
  - [ ] Hover states working
  - [ ] Button transitions smooth
- [ ] **Dark Mode (if enabled):**
  - [ ] Test all components in dark mode
  - [ ] Verify contrast in dark mode
- [ ] No layout shifts (CLS = 0)
- [ ] No broken layouts
- [ ] Text remains readable
- [ ] Images/icons not distorted

**Testing Process:**
1. Checkout `main` branch, take screenshots
2. Checkout feature branch with sage palette
3. Take same screenshots
4. Compare side-by-side
5. Document any regressions

**Deliverable:**
Create `docs/audits/landing/2026-02-07-visual-regression-sage.md` with:
- Screenshot gallery (before/after)
- List of any visual regressions found
- Notes on intentional changes vs bugs
- Sign-off that all regressions resolved

**Dependencies:** Tickets 3-8 (all visual updates complete)

**Tools:**
- Browser DevTools (device emulation)
- Percy (if available) for automated screenshots
- Manual screenshot comparison

---

### TICKET 11: Performance Audit 🚀
**Type:** Quality Assurance
**Priority:** P2
**Estimate:** 2 points
**Labels:** `performance`, `testing`, `lighthouse`

**Description:**
Performance audit to ensure the color migration didn't negatively impact page load times, bundle size, or Core Web Vitals.

**Acceptance Criteria:**
- [ ] **Lighthouse Audit (before/after):**
  - [ ] Performance score: ≥ 90 (maintain or improve)
  - [ ] Accessibility score: ≥ 95
  - [ ] Best Practices: ≥ 95
  - [ ] SEO: 100
- [ ] **Core Web Vitals:**
  - [ ] LCP (Largest Contentful Paint): < 2.5s
  - [ ] FID (First Input Delay): < 100ms
  - [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] **Bundle Size:**
  - [ ] CSS bundle size increase: < 5%
  - [ ] JS bundle size: no change (color changes shouldn't affect JS)
  - [ ] Total page weight: < 5% increase
- [ ] **Build Time:**
  - [ ] Build completes without errors
  - [ ] Build time similar to before
- [ ] **Runtime Performance:**
  - [ ] No jank in animations
  - [ ] Smooth scrolling maintained
  - [ ] No memory leaks

**Testing Process:**
1. Run Lighthouse on `main` branch, record scores
2. Run Lighthouse on feature branch, compare
3. Check bundle sizes with `npm run build`
4. Use Chrome DevTools Performance panel
5. Test on throttled network (Fast 3G)

**Deliverable:**
Create `docs/audits/landing/2026-02-07-performance-sage.md` with:
- Lighthouse score comparison table
- Bundle size comparison
- Core Web Vitals results
- Any performance issues found and fixed
- Sign-off that performance maintained

**Dependencies:** Tickets 3-8 (all code changes complete)

**Fail Criteria (requires optimization):**
- Lighthouse performance < 90
- Bundle size increase > 10%
- LCP > 3.0s
- CLS > 0.1

---

### TICKET 12: Documentation & Deployment 📝
**Type:** Documentation
**Priority:** P2
**Estimate:** 1 point
**Labels:** `documentation`, `deployment`

**Description:**
Final documentation updates, audit trail creation, and deployment summary for the sage green palette migration.

**Acceptance Criteria:**
- [ ] **Deployment Summary:**
  - [ ] Update `docs/deployment_summary.md` with all changes
  - [ ] List all affected URLs
  - [ ] Note any breaking changes (should be none)
- [ ] **Audit Log:**
  - [ ] Create `docs/audits/landing/2026-02-07-[timestamp]-sage-palette-complete.md`
  - [ ] Document all files changed
  - [ ] Document all color mappings
  - [ ] Include before/after screenshots
  - [ ] Note any challenges/learnings
- [ ] **Theme System Documentation:**
  - [ ] Document how to use `src/lib/theme/colors.ts`
  - [ ] Provide examples for future theme additions
  - [ ] Document color token naming conventions
- [ ] **README Updates (if needed):**
  - [ ] Update any color-related documentation
  - [ ] Update design system references
- [ ] **CLAUDE.md Updates:**
  - [ ] Update color palette references
  - [ ] Update component implementation examples

**Deliverables:**
1. Updated `docs/deployment_summary.md`
2. Complete audit log in `docs/audits/landing/`
3. Theme system usage guide (can be in audit log or separate file)

**Template for Deployment Summary:**
```markdown
## Latest deploy summary
- Migrated entire landing page to sage green color palette
- Created reusable theme system for future color schemes
- Maintained WCAG 2.1 AA accessibility compliance
- Performance maintained (Lighthouse 90+)

## Notes for internal team
- All 74+ color references updated across codebase
- New theme tokens file: src/lib/theme/colors.ts
- Removed all "evening" (purple) color references
- Priority colors updated: high (coral), medium (amber), low (blue-gray)
- TICKETS: [list ticket IDs]

## Changed URLs
- https://www.domani-app.com/
- https://www.domani-app.com/about
- https://www.domani-app.com/pricing
- https://www.domani-app.com/faq
```

**Dependencies:** Tickets 1-11 (all work complete and tested)

**Sign-off Required:**
- [ ] Design team approves final look
- [ ] Accessibility audit passed
- [ ] Performance audit passed
- [ ] All tests passing

---

## Ticket Relationship Map

```
Epic: Sage Green Palette Migration
│
├─ Phase 1: Foundation (P0 - Must Complete First)
│  ├─ Ticket 1: Theme System Foundation [BLOCKER]
│  └─ Ticket 2: Tailwind & CSS Config [BLOCKER] (depends on 1)
│
├─ Phase 2: Core Components (P0-P1 - High Visibility)
│  ├─ Ticket 3: Core Branding (depends on 2)
│  └─ Ticket 4: Hero Section (depends on 2, 3)
│
├─ Phase 3: Feature Components (P1)
│  ├─ Ticket 5: Feature Spotlights (depends on 2, 4)
│  └─ Ticket 6: Benefits & Showcase (depends on 2)
│
├─ Phase 4: Secondary Components (P2)
│  ├─ Ticket 7: Secondary Components (depends on 2)
│  └─ Ticket 8: Admin & Utilities (depends on 2)
│
├─ Phase 5: Quality Assurance (P1-P2 - After All Dev Complete)
│  ├─ Ticket 9: Accessibility Audit (depends on 3-8)
│  ├─ Ticket 10: Visual Regression (depends on 3-8)
│  └─ Ticket 11: Performance Audit (depends on 3-8)
│
└─ Phase 6: Launch
   └─ Ticket 12: Documentation (depends on 1-11)
```

---

## Development Workflow

### For Each Ticket:
1. **Create Feature Branch:** `git checkout -b feature/sage-palette-ticket-[N]`
2. **Make Changes:** Follow acceptance criteria
3. **Self-Test:** Check all items in testing checklist
4. **Commit:** Use conventional commits (`feat:`, `fix:`, etc.)
5. **Create PR:** Against `dev` branch (or `main` if no dev branch)
6. **Review:** Get approval from team/designer
7. **Merge:** Squash and merge to keep history clean
8. **Update Audit:** Note completion in audit log

### Testing Strategy:
- **Unit Tests:** Not required for color changes (no logic changes)
- **Visual Testing:** Manual verification required for each ticket
- **Integration Testing:** After each phase complete
- **E2E Testing:** After Phase 5 (QA) complete

### Rollback Plan:
- Each ticket in separate PR for easy revert
- Keep feature branch alive until verified in production
- Can revert individual tickets if issues found

---

## Time Estimates

| Phase | Tickets | Estimated Hours | Priority |
|-------|---------|----------------|----------|
| Foundation | 1-2 | 6 hours | P0 |
| Core Components | 3-4 | 6 hours | P0-P1 |
| Features | 5-6 | 7 hours | P1 |
| Secondary | 7-8 | 5 hours | P2 |
| QA | 9-11 | 7 hours | P1-P2 |
| Docs | 12 | 1 hour | P2 |
| **TOTAL** | **12 tickets** | **32 hours** | |

**Recommended Schedule:**
- **Sprint 1 (Week 1):** Tickets 1-6 (Foundation + Core + Features)
- **Sprint 2 (Week 2):** Tickets 7-12 (Secondary + QA + Docs)

---

## Labels to Create in Linear

- `sage-palette` - All tickets in this epic
- `theme-system` - Theme infrastructure work
- `foundation` - Foundational/blocking work
- `branding` - Brand identity components
- `high-visibility` - User-facing high-impact
- `accessibility` - Accessibility-related
- `testing` - Testing and QA
- `documentation` - Docs and audit trails
- `P0`, `P1`, `P2` - Priority levels (or use Linear's built-in priorities)

---

## Quick Copy-Paste Ticket Creation

### For Creating in Linear:

**Epic Title:**
```
Sage Green Palette Migration & Theme System
```

**Epic Description:**
```
Migrate the Domani landing page from indigo/purple to sage green palette and create a reusable theme system.

Goals:
- Replace all colors with sage palette
- Create centralized theme tokens
- Maintain WCAG 2.1 AA accessibility
- Preserve performance (Lighthouse 90+)
- Enable future theme switching

Total: 12 tickets, ~32 hours, 2-week sprint
```

Then create each ticket (1-12) using the templates above.

---

**End of Ticket Templates**

*Last Updated: 2026-02-07*
*Ready for Linear Import*

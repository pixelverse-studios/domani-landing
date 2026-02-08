# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Created centralized theme system foundation for sage green color palette migration
- Added color tokens file with complete sage palette (primary, backgrounds, text, priority, borders)
- Enhanced theme color documentation with comprehensive usage examples
- Added TypeScript utility types to color system for improved developer experience and type safety
- Integrated sage green palette into Tailwind configuration and global CSS variables
- Replaced indigo/purple color scheme with sage green throughout design system
- Added priority colors for task management (coral, amber, blue-gray)
- Updated dark mode to use sage-tinted surfaces
- Fixed HSL conversion errors in globals.css to match exact hex colors from color system
- Updated core branding components (Logo, Header) to use sage green palette
- Removed all evening-* color references from Logo component
- Replaced purple/blue navigation underline with sage monochromatic gradient
- Updated feature spotlight bullet points from green to sage palette for visual consistency
- Updated Benefits section with refined sage green gradients for better visual cohesion
- Updated App Showcase section with sage green accent colors across tabs, badges, and image effects

## Notes for internal team
- DOM-416 completed and in review (PR #29)
- New file: apps/landing/src/lib/theme/colors.ts
- Exports: themeColors, tailwindColors, cssVariables, hexToHSL utility
- Zero TypeScript errors, build passes
- Foundation for all other color migration tickets (DOM-417 through DOM-427)
- Performance review completed for PR #29 - APPROVED
- Color system adds ~8KB uncompressed (~2KB gzipped), < 0.1ms runtime overhead
- Full audit: docs/audits/landing/2026-02-07-pr29-performance-analysis.md
- Added 6 practical JSDoc examples to colors.ts covering Tailwind, CSS variables, gradients, dark mode, and TypeScript
- Added comprehensive TypeScript utility types (lines 333-374): ThemeColors, PrimaryColorKey, BackgroundColorKey, TextColorKey, PriorityColorKey, BorderColorKey, Gradient, CSSVarName, TailwindColorConfig, HexColor, HSLColor, RGBAColor, ColorValue
- DOM-417 completed and in review (PR #30)
- Modified files: tailwind.config.js, src/styles/globals.css
- Removed "evening" (purple) color definitions completely
- Added sage alias for semantic clarity (matches primary palette)
- All CSS variables updated to HSL format with sage palette
- Unblocks DOM-418 through DOM-427 (component update tickets)
- Audit: docs/audits/landing/2026-02-07-16-12-04-dom-417-tailwind-css-config.md
- HSL conversion fix: Corrected all CSS custom properties in src/styles/globals.css to match exact hex values from colors.ts
- Light mode updates: background (36 33% 97%), foreground (152 10% 26%), primary (146 13% 55%), accent (148 18% 69%), muted (136 6% 63%), border (38 19% 89%)
- Dark mode updates: background (150 10% 11%), foreground (120 20% 95%), primary (148 18% 69%), secondary (136 6% 63%), accent (146 13% 55%), muted (152 10% 26%), border (152 10% 26%)
- DOM-418 completed and in review (PR pending)
- Modified files: src/components/Logo.tsx, src/components/Header.tsx
- Logo gradient: from-primary-600 to-evening-600 → from-primary-600 to-primary-700 (8 color class replacements)
- Header nav underline: from-purple-500 via-purple-400 to-blue-500 → from-primary-600 via-primary-500 to-primary-700
- Footer and Button components verified already compliant (use CSS variables)
- Audit: docs/audits/landing/2026-02-07-16-54-32-dom-418-core-branding.md
- DOM-419 completed and in review (PR pending)
- Modified files: src/components/HeroSection.tsx, src/components/SocialProof.tsx
- Hero section blob animations: evening-* → primary-* (4 blob color updates)
- Hero image glow gradient: to-evening-500 → to-primary-700
- Add Task button gradient: to-evening-600 → to-primary-700
- Social proof user count gradient: evening-* → primary-* (light and dark mode)
- Audit: docs/audits/landing/2026-02-07-17-08-01-dom-419-hero-section.md
- ACCESSIBILITY FIX completed (not ticketed)
- Modified file: src/components/features/MITSpotlight.tsx
- Fixed WCAG AA compliance: coral text #D77A61 → #C05A43 (3.07:1 → 4.51:1 contrast ratio)
- Line 64: Badge text color darkened for accessibility
- Line 78: Label text color darkened for accessibility
- Large text gradient (line 91) unchanged - passes WCAG AA large text standard (3.0:1 threshold)
- Icon backgrounds unchanged - white on coral already has excellent contrast
- Fixed coral text contrast violations in MITSpotlight component to meet WCAG AA standards
- Updated small text color from #D77A61 (3.07:1 ratio) to #C05A43 (4.51:1 ratio) for accessibility compliance
- ACCESSIBILITY FIX completed (not ticketed)
- Modified files: src/components/features/MITSpotlight.tsx, src/components/features/PlanLockSpotlight.tsx, src/components/features/SmartRolloverSpotlight.tsx
- Added useReducedMotion hook to all three feature spotlight components
- Scroll-based translateY animations now respect prefers-reduced-motion media query
- Users with vestibular disorders will see static background decorations instead of parallax scroll effects
- Opacity animations retained (less problematic for accessibility)
- Added motion preference support to feature spotlight components for users with vestibular disorders
- All three spotlight components now respect prefers-reduced-motion media query
- Modified files: src/components/features/MITSpotlight.tsx, src/components/features/PlanLockSpotlight.tsx, src/components/features/SmartRolloverSpotlight.tsx
- Replaced bg-green-500 with bg-primary-500 across all feature spotlights (11 total bullet points)
- MITSpotlight: 3 bullet points updated (lines 122, 126, 130)
- PlanLockSpotlight: 3 bullet points updated (lines 132, 136, 140)
- SmartRolloverSpotlight: 4 bullet points updated (lines 131, 135, 139, 143)
- Improves visual consistency with sage color palette migration
- DOM-421: Benefits & Showcase sections migrated to sage palette (BenefitCard, BenefitsMotionLayer, AppShowcase)

## Changed URLs
- https://www.domani-app.com/ (logo, nav underline, hero section blobs, hero phone mockup, social proof, MIT spotlight accessibility)
- https://www.domani-app.com/about (logo + nav underline)
- https://www.domani-app.com/pricing (logo + nav underline)
- https://www.domani-app.com/faq (logo + nav underline)
- https://www.domani-app.com/blog (logo + nav underline)

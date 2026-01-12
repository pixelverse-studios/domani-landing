# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour analytics not tracking - script now loads automatically for all visitors
- Removed analytics consent banner popup
- Updated messaging across site to remove 3-6 task rule references
- FAQ now explains how Domani helps build evening planning habits with proactive nudges
- Pricing page highlights smart reminders instead of task limits
- About page emphasizes habit-building support over task constraints
- Updated Terms of Service for new pricing model (lifetime only, no subscriptions)
- Updated Privacy Policy payment description for lifetime purchases
- Fixed pricing page SEO titles (changed "Start Free" to "Lifetime Access")

## Notes for internal team
- Simplified SiteBehaviourConsentGate component to load script directly
- Removed consent state management and localStorage checks
- Component name unchanged to avoid breaking imports
- Messaging update: Removed all references to "3-6 task rule" enforcement
- New focus: proactive nudges, habit building, anti-clutter, minimal design
- Files changed: faq/page.tsx, pricing/page.tsx, PricingContent.tsx, about/page.tsx, AboutContent.tsx
- Pricing model cleanup: Removed all free tier and subscription references
- ToS sections 4, 5, 8 rewritten for lifetime model
- Files changed: terms/page.tsx, privacy/page.tsx, metadata.ts, AppPreviewSection.tsx

## Changed URLs
- https://www.domani-app.com/
- https://www.domani-app.com/faq
- https://www.domani-app.com/pricing
- https://www.domani-app.com/about
- https://www.domani-app.com/terms
- https://www.domani-app.com/privacy

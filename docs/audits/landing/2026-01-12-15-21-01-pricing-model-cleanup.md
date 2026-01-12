# Audit Log - Landing Page - 2026-01-12 15:21:01

## Prompt Summary
User requested removing all references to the old pricing model (free tier, subscriptions, Premium tier) and ensuring consistency with the new model: lifetime purchase only with 14-day trial, no subscriptions, no free tier.

## Actions Taken
1. Updated Terms of Service metadata description (removed "subscriptions")
2. Rewrote ToS Section 4 from "Free & Premium tiers" to "Trial & lifetime access"
3. Rewrote ToS Section 5 from "Subscriptions & billing" to "Purchases & billing"
4. Rewrote ToS Section 8 from "Cancellation & deletion" to "Account deletion"
5. Updated Privacy Policy payment info (removed "Premium or" reference)
6. Updated SEO metadata for pricing page (changed "Start Free" to "Lifetime Access")
7. Updated AppPreviewSection mockup (changed "3 tasks" to "Plan ready")
8. Reviewed PricingContent comparison section - kept as-is (intentionally hypothetical)

## Files Changed
- `src/app/terms/page.tsx` - Complete overhaul of sections 4, 5, 8 for new pricing model
- `src/app/privacy/page.tsx` - Updated payment info description
- `src/lib/seo/metadata.ts` - Changed pricing page OG/Twitter titles
- `src/components/preview/AppPreviewSection.tsx` - Updated mockup badge text

## Components/Features Affected
- Terms of Service page
- Privacy Policy page
- Pricing page SEO metadata
- App Preview mockup component

## Testing Considerations
- Verify Terms of Service renders correctly with new section titles
- Check Privacy Policy payment description
- Validate OG meta tags for pricing page sharing
- Verify app preview mockup displays correctly

## Performance Impact
- No bundle size changes (text-only updates)
- No loading time impact
- SEO: Updated pricing page titles may affect search appearance

## Next Steps
- Review any email templates for old pricing references
- Check app store listings match new messaging
- Update any external marketing materials

## Notes
New pricing model:
- 14-day free trial with full access (no payment required upfront)
- Lifetime purchase only (one-time payment)
- No subscriptions, no recurring fees
- No free tier, no Premium tier
- All future updates included

The PricingContent comparison section ("If we offered monthly") was intentionally kept as it reinforces the value of lifetime pricing without claiming subscriptions exist.

## Timestamp
Created: 2026-01-12 15:21:01
Page Sections: terms, privacy, pricing (seo), preview

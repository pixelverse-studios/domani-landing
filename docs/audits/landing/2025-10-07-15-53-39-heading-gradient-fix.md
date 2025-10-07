# Audit Log - Landing Page - 2025-10-07 15:53:39

## Prompt Summary
Resolved gradient heading text clipping on About, Pricing, and FAQ pages.

## Actions Taken
1. Wrapped gradient headlines in spans and applied `leading-tight` to parent `<h1>` tags.
2. Updated all three marketing components to prevent glyph clipping while retaining gradient styling.

## Files Changed
- `src/components/about/AboutContent.tsx` - Adjusted hero heading wrapper.
- `src/components/pricing/PricingContent.tsx` - Wrapped pricing heading text span.
- `src/components/faq/FAQContent.tsx` - Same span and line-height fix.

## Components/Features Affected
- About, Pricing, and FAQ hero headings

## Testing Considerations
- Verify gradient text no longer appears cut off at the top across breakpoints.

## Performance Impact
- None

## Next Steps
- None

## Notes
- Approach keeps gradient styling while ensuring browser line boxes have breathing room.

## Timestamp
Created: 2025-10-07 15:53:39
Page Section: documentation

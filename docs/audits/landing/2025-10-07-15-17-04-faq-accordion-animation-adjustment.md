# Audit Log - Landing Page - 2025-10-07 15:17:04

## Prompt Summary
Scaled back FAQ accordion animations so only category sections animate rather than each individual question.

## Actions Taken
1. Removed per-item motion variants from `FAQItem` and kept a single fade/slide animation per category container.
2. Ensured accordion items retain hover/toggle transitions without additional scroll-triggered animations.

## Files Changed
- `src/components/faq/FAQAccordion.tsx` - Simplified motion usage to category-level.

## Components/Features Affected
- FAQ accordion appearance

## Testing Considerations
- Verify `/faq` plays a single animation as each category comes into view while individual expand/collapse remains smooth.

## Performance Impact
- Reduced slightly by removing per-item animation overhead.

## Next Steps
- None

## Notes
- Keeps page cadence calmer while maintaining visibility transitions for each section.

## Timestamp
Created: 2025-10-07 15:17:04
Page Section: faq

## Timestamp
Created: 2025-10-07 15:17:04
Page Section: faq

# Audit Log - Landing Page - 2025-10-07 16:16:23

## Prompt Summary
Fixed the FAQ page contact CTA so it renders without requiring a hard refresh.

## Actions Taken
1. Restored `animate="visible"` on the final FAQ CTA motion wrapper to ensure it animates on mount.

## Files Changed
- `src/components/faq/FAQContent.tsx` - Added explicit animate prop to CTA section.

## Components/Features Affected
- FAQ contact CTA

## Testing Considerations
- Navigate to `/faq` via client routing and confirm the “Contact Support” button appears immediately.

## Performance Impact
- None

## Next Steps
- Monitor navigation for any other sections missing animation triggers.

## Notes
- Aligns behavior with other motion sections after prior refactor.

## Timestamp
Created: 2025-10-07 16:16:23
Page Section: faq

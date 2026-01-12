# Audit Log - Landing Page - 2026-01-12 14:04:22

## Prompt Summary
User reported SiteBehaviour analytics not tracking. Investigation revealed the consent gate was blocking tracking until users explicitly clicked "Allow". User confirmed they don't need consent since no cookies/PII are stored.

## Actions Taken
1. Investigated SiteBehaviour implementation in codebase
2. Found `SiteBehaviourConsentGate` component requiring explicit user consent
3. Identified that tracking only loaded after `consentState === 'granted'`
4. Simplified component to load tracking script immediately without consent flow
5. Removed consent banner UI entirely

## Files Changed
- `src/components/privacy/SiteBehaviourConsentGate.tsx` - Removed consent state management, localStorage checks, and consent banner UI. Script now loads directly via `afterInteractive` strategy.

## Components/Features Affected
- SiteBehaviourConsentGate component (simplified)
- Consent banner removed from all pages
- Analytics tracking now active for all visitors

## Testing Considerations
- Verify script loads in Network tab (request to `sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com`)
- Check SiteBehaviour dashboard for incoming data
- Test with ad blockers to understand potential blocking
- Verify no console errors related to SiteBehaviour

## Performance Impact
- Slightly faster initial load (no consent state check)
- Removed localStorage read operation
- No UI rendering for consent banner

## Next Steps
- Consider renaming component from `SiteBehaviourConsentGate` to `SiteBehaviourAnalytics`
- Monitor SiteBehaviour dashboard for data
- Verify tracking works across all pages

## Notes
- Site secret remains: `59dd84d0-342e-4caa-b723-040c094d92fa`
- Component export name unchanged to avoid breaking layout.tsx import
- If GDPR consent is needed in future, this change should be reverted

## Timestamp
Created: 2026-01-12 14:04:22
Page Section: global/analytics

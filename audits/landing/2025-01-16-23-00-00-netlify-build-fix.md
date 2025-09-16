# Audit Log - Landing Page - 2025-01-16 23:00:00

## Prompt Summary
User reported Netlify build failure with error "publish directory was not found at: /opt/build/repo/out" and a warning about missing metadataBase property.

## Actions Taken
1. Examined the Netlify configuration file (netlify.toml)
2. Fixed the publish directory from "out" to ".next" (Next.js default build output)
3. Removed the catch-all redirect that was breaking API routes
4. Added metadataBase property to the metadata export in layout.tsx
5. Verified the build works locally

## Files Changed
- `netlify.toml` - Changed publish directory from "out" to ".next", removed catch-all redirect
- `src/app/layout.tsx` - Added metadataBase property to metadata export

## Components/Features Affected
- Netlify deployment configuration
- Next.js build process
- Social media meta tags (Open Graph, Twitter cards)
- API routes functionality

## Testing Considerations
- Build tested locally and succeeds
- API routes now properly accessible
- Social meta tags will resolve correctly with absolute URLs

## Performance Impact
- No performance impact
- Proper caching headers remain in place
- Build size unchanged

## Next Steps
- Push changes to trigger new Netlify build
- Verify deployment succeeds on Netlify
- Test API routes on production
- Verify social media previews work correctly

## Notes
The issue was caused by incorrect Netlify configuration for a Next.js app with API routes:
1. The publish directory was set to "out" (for static export) instead of ".next" (for server-side rendering)
2. The catch-all redirect was breaking API routes by redirecting them to index.html
3. Missing metadataBase was causing Next.js to use localhost URLs for social media images

This configuration now properly supports:
- Server-side rendering
- API routes at /api/*
- Proper social media meta tags with absolute URLs

## Timestamp
Created: 2025-01-16 23:00:00
Page Section: Infrastructure/Deployment
# Audit Log - Landing Page - 2025-01-16 17:07:00

## Prompt Summary
User reported errors on the `/api/users/count` endpoint for social proof component showing "ERR_TOO_MANY_REDIRECTS" errors.

## Actions Taken
1. Investigated the middleware configuration and identified the issue
2. Fixed the middleware matcher pattern to explicitly exclude API routes
3. Tested the API endpoint to confirm it's accessible and returning correct responses
4. Verified the endpoint works correctly with multiple requests (no redirect loops)

## Files Changed
- `src/middleware.ts` - Updated matcher pattern to exclude API routes from middleware processing

## Components/Features Affected
- SocialProof component (consumer of the API endpoint)
- API route `/api/users/count`
- Middleware routing configuration

## Testing Considerations
- API endpoint should return JSON response with user count
- No redirect errors should occur when accessing `/api/users/count`
- SocialProof component should fetch and display user count without errors
- API should handle edge runtime correctly
- Caching headers should be properly set (60-second cache)

## Performance Impact
- No negative performance impact
- Actually improves performance by preventing unnecessary middleware processing for API routes
- Eliminates redirect loops that were causing multiple failed requests

## Next Steps
- Monitor the API endpoint in production for stability
- Consider implementing better error handling in SocialProof component for network failures
- Could add retry logic with exponential backoff in the frontend
- Consider increasing the polling interval from 60 seconds to reduce server load

## Notes
The issue was caused by the middleware matcher pattern `'/((?!_next/static|_next/image|favicon.ico).*)'` which was matching all routes except Next.js static files, including API routes. Even though the middleware had internal logic to skip API routes, the matcher itself was causing the middleware to run for API routes, creating redirect loops.

The fix was to explicitly exclude API routes in the matcher pattern: `'/((?!api|_next/static|_next/image|favicon.ico).*)'`

This ensures the middleware doesn't run at all for API routes, preventing any potential redirect issues.

## Timestamp
Created: 2025-01-16 17:07:00
Page Section: API/middleware configuration
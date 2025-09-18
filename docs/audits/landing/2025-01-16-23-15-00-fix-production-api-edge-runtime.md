# Audit Log - Landing Page - 2025-01-16 23:15:00

## Prompt Summary
User reported that the `/api/users/count` endpoint returns mock data (`mock: true`) in production on Netlify, despite environment variables being set.

## Root Cause Analysis
The issue was caused by using Edge Runtime (`export const runtime = 'edge'`) in the API route. Edge Runtime has restricted access to environment variables - it can only access `NEXT_PUBLIC_*` prefixed variables. Since `SUPABASE_SERVICE_ROLE_KEY` is a private server-side variable, it was undefined in Edge Runtime, causing `supabaseAdmin` to be null.

## Actions Taken
1. Identified that Edge Runtime cannot access non-public environment variables
2. Removed the `export const runtime = 'edge'` declaration from the API route
3. Cleaned up debug console.log statements
4. Verified the fix works locally with the standard Node.js runtime

## Files Changed
- `src/app/api/users/count/route.ts` - Removed Edge Runtime constraint, cleaned up debug logs

## Components/Features Affected
- User count API endpoint
- API route runtime environment
- Production deployment on Netlify

## Testing Considerations
- API tested locally and returns correct count: 1
- Standard Node.js runtime allows access to all environment variables
- Cache headers remain in place for performance

## Performance Impact
- Slight performance difference: Edge Runtime is faster but Node.js runtime is still performant
- Caching still enabled (60-second cache) to minimize performance impact
- Trade-off: Slightly slower cold starts for accurate data access

## Next Steps
1. Push changes to trigger new Netlify deployment
2. Verify production API returns actual count (not mock)
3. Monitor performance metrics after switching from Edge to Node.js runtime
4. Consider alternative solutions if performance becomes an issue:
   - Create a public Supabase RPC function for counting
   - Use a database view with RLS policies for public access
   - Implement a webhook to update a cached count

## Notes
### Edge Runtime Limitations
Edge Runtime provides better performance but has restrictions:
- Only `NEXT_PUBLIC_*` environment variables are accessible
- Limited Node.js API availability
- Runs at the edge for lower latency

### Node.js Runtime Benefits
- Full access to all environment variables (including private ones)
- Complete Node.js API availability
- Required for accessing `SUPABASE_SERVICE_ROLE_KEY`

This is a common issue when migrating from Node.js runtime to Edge Runtime without considering environment variable restrictions.

## Timestamp
Created: 2025-01-16 23:15:00
Page Section: API/Runtime Configuration
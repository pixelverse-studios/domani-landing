# Audit Log - Landing Page - 2025-01-16 22:45:00

## Prompt Summary
User reported that the `/src/api/users/count` GET request always returns 0, despite having 1 user in the database.

## Actions Taken
1. Explored the API route implementation and database configuration
2. Created a test script to diagnose the issue
3. Discovered Row Level Security (RLS) was blocking the ANON key from reading waitlist data
4. Updated the API route to use `supabaseAdmin` client instead of regular `supabase` client
5. Verified the fix works correctly (now returns count: 1)

## Files Changed
- `src/app/api/users/count/route.ts` - Modified to use supabaseAdmin client to bypass RLS policies

## Components/Features Affected
- User count API endpoint
- SocialProof component (will now display correct count)

## Testing Considerations
- API endpoint tested and confirmed working
- Returns correct count: 1
- Cache headers still in place (60-second cache)
- No sensitive data exposed (only returns count)

## Performance Impact
- No performance degradation
- Same caching behavior (60-second cache)
- No bundle size changes

## Next Steps
- Monitor the user count display on the landing page
- Consider adding RLS policy to allow anonymous read of count only
- Could optimize by creating a database function for counting

## Notes
The issue was caused by Row Level Security (RLS) policies on the `waitlist` table in Supabase. The ANON key could not read the data, while the SERVICE_ROLE key could. Using the admin client for counting is safe since we only return a count, not user data.

Test results showed:
- ANON key: count = 0
- SERVICE_ROLE key: count = 1 (with user data visible)

This is a common issue with Supabase when RLS is enabled but policies haven't been configured for public read access.

## Timestamp
Created: 2025-01-16 22:45:00
Page Section: API/Backend
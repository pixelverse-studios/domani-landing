# Audit Log - Landing Page - 2025-01-19 10:05:00

## Prompt Summary
Fixed UUID error where the string "anonymous" was being inserted into a UUID field during failed authentication attempts.

## Actions Taken
1. Identified the root cause in `src/lib/admin/audit.ts` line 33
2. Changed `userId: entry.adminId || 'anonymous'` to `userId: entry.adminId || null`
3. Updated the AuditLogEntry interface to allow `userId: string | null`
4. Verified database schema allows NULL values for user_id column
5. Tested the fix

## Files Changed
- `src/lib/admin/audit.ts` - Fixed anonymous UUID error (lines 8, 33)

## Components/Features Affected
- Admin authentication audit logging
- Failed login attempt tracking
- Google OAuth callback error handling
- All admin audit log creation

## Testing Considerations
- Test failed login attempts (should create audit logs with null user_id)
- Test successful login attempts (should create audit logs with actual user_id)
- Test Google OAuth failures (should not error on audit log creation)
- Verify no more PostgreSQL UUID errors

## Performance Impact
- None - Simple change from string to null
- No database schema changes required
- No migration needed

## Next Steps
- Monitor audit logs to ensure they're being created properly
- Consider adding a specific "anonymous" user UUID if tracking is needed
- Update any audit log queries that might expect non-null user_id

## Notes
**Issue:** The audit logging system was trying to insert the string "anonymous" into the `user_id` UUID field when authentication failed (no valid user). PostgreSQL rejected this with error code 22P02: "invalid input syntax for type uuid".

**Solution:** Changed the default value from "anonymous" to null. The database schema already allows NULL values for the user_id column since it's a foreign key reference without a NOT NULL constraint.

**Why This Works:** NULL is valid for UUID columns that don't have NOT NULL constraints. This properly represents "no authenticated user" in audit logs for failed authentication attempts.

## Timestamp
Created: 2025-01-19 10:05:00
Page Section: admin/authentication/audit-logging
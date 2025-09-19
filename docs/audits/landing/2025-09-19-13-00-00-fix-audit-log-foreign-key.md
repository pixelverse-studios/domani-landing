# Audit Log - Landing Page - 2025-09-19 13:00:00

## Prompt Summary
Fix audit log errors related to foreign key constraint violation when creating audit logs during admin authentication.

## Actions Taken
1. Identified root cause: audit_log table was expecting user_id from auth.users, but code was passing adminId from admin_users
2. Created database migration to fix schema:
   - Fixed user_id column type from TEXT to UUID
   - Made user_id nullable for system actions
   - Added proper foreign key constraint to auth.users
   - Added performance indexes
3. Updated audit log interface to separate userId and adminId fields
4. Fixed all authentication routes to pass correct user IDs:
   - Google OAuth callback route
   - Login route
   - Logout route
   - Refresh route
   - Verify route
5. Updated AdminLoginResponse type to include auth_user_id for proper audit logging

## Files Changed
- `supabase/migrations/20250119_fix_admin_audit_log_foreign_key.sql` - New migration to fix schema
- `src/lib/admin/audit.ts` - Updated interface to separate userId and adminId
- `src/app/api/admin/auth/google/callback/route.ts` - Fixed all audit log calls
- `src/app/api/admin/auth/login/route.ts` - Fixed authentication flow and audit logging
- `src/app/api/admin/auth/logout/route.ts` - Fixed logout audit logging
- `src/app/api/admin/auth/refresh/route.ts` - Fixed refresh audit logging
- `src/app/api/admin/auth/verify/route.ts` - Fixed verify audit logging
- `src/types/admin.ts` - Updated AdminLoginResponse type
- `src/lib/admin/auth.ts` - Updated authenticateAdmin to return auth_user_id

## Components/Features Affected
- Admin authentication system
- Audit logging system
- All admin auth API routes
- Database schema for audit logs

## Testing Considerations
- Test successful admin login flow
- Test failed login attempts with non-admin users
- Test OAuth errors and edge cases
- Verify audit logs are created with correct user IDs
- Check foreign key constraints are enforced

## Performance Impact
- Added indexes on audit_log table for better query performance
- No significant impact on authentication flow
- Improved data integrity with proper foreign key constraints

## Next Steps
- Apply migration to production database via Supabase SQL Editor
- Monitor audit logs to ensure they're recording correctly
- Consider adding more detailed audit tracking for sensitive operations
- Test complete authentication flow end-to-end

## Notes
- The issue was caused by confusion between auth.users.id (Supabase auth) and admin_users.id (internal admin table)
- Both IDs are now properly tracked: userId for auth user, adminId for admin profile
- Migration includes safety checks to handle existing TEXT data conversion
- Foreign key constraint ensures referential integrity

## Timestamp
Created: 2025-09-19 13:00:00
Page Section: admin/authentication
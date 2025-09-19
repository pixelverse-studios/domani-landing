# Fix Audit Log Enum Error

## The Error
When accessing admin endpoints like `/admin/waitlist`, you see this error:
```
Failed to create audit log: {
  code: '22P02',
  message: 'invalid input value for enum audit_action: "read"'
}
```

## The Cause
The admin middleware tries to log 'read' actions when data is accessed, but the database enum `audit_action` doesn't include 'read' as a valid value.

## The Fix

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query
5. Paste this SQL:

```sql
-- Add 'read' to audit_action enum
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'read';
```

6. Click **Run**

### Option 2: Apply via Supabase CLI

If you have Supabase CLI configured with your project:

```bash
# Apply the migration
supabase db push --db-url "your-database-url"

# Or run the SQL directly
supabase db execute --sql "ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'read';"
```

### Option 3: Use the Provided SQL Script

We've created a complete fix script at `apply_read_enum_fix.sql` that:
- Checks if 'read' already exists (idempotent)
- Adds it if missing
- Verifies the enum values

Apply it via Supabase Dashboard SQL Editor.

## Verification

After applying the fix:

1. Navigate to `/admin/waitlist`
2. Open browser console
3. Verify no "Failed to create audit log" errors appear
4. Check the audit logs table - you should see entries with action='read'

## Why This Happened

The TypeScript types included 'read' as a valid action, but the database enum wasn't updated to match. This fix ensures consistency between the application code and database schema.

## Related Files

- `src/lib/admin/middleware.ts` - Where 'read' is logged (line 281)
- `src/types/admin.ts` - TypeScript enums (already fixed)
- `supabase/migrations/20250119_add_read_audit_action.sql` - Migration file
# 🚨 URGENT: Fix Admin Login Issue

The admin login is failing because the database is missing two enum values. Here's how to fix it:

## Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your project (exxnnlhxcjujxnnwwrxv)
3. Click **SQL Editor** in the left sidebar

### Step 2: Run These Commands
**IMPORTANT: Run each command SEPARATELY (one at a time)**

```sql
-- Command 1: Add login_attempt
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt';
```

Click "Run" and wait for it to complete.

```sql
-- Command 2: Add login_error
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error';
```

Click "Run" and wait for it to complete.

### Step 3: Verify the Fix
Run this query to confirm both values were added:

```sql
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'audit_action'::regtype
ORDER BY enumsortorder;
```

You should see 12 values including:
- `login_attempt`
- `login_error`

## That's it!
Your admin login should now work. Try logging in again at `/admin/login`.

---

## Why This Happened
The application code was trying to log audit events with action types (`login_attempt` and `login_error`) that weren't defined in the database enum. This caused PostgreSQL to reject the audit log inserts with error code 22P02.

## What We Fixed
- Added `login_attempt` to track failed login attempts
- Added `login_error` to track system errors during authentication

These values are now properly defined in both:
- Database: `audit_action` enum type
- TypeScript: `AuditAction` enum in `src/types/admin.ts`
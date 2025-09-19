# Debug Guide: Admin Login Authentication

## Current Setup

**Dev server running on:** http://localhost:3001

**Allowed admin emails (from .env.local):**
- phil@pixelversestudios.io
- sami@pixelversestudios.io

## Debug Logging Added

I've added comprehensive debug logging to trace the authentication flow:

### 1. Google OAuth Callback (`/api/admin/auth/google/callback`)
- Logs when OAuth callback starts
- Shows the email returned by Google
- Shows if email is in the allowlist
- Shows admin_users table check results
- Shows final success/failure status

### 2. Email Allowlist Check (`/lib/admin/config.ts`)
- Logs the email being checked
- Shows all allowed emails from environment
- Shows all allowed domains
- Indicates if email matches allowlist

### 3. Middleware Fix (`/lib/admin/middleware.ts`)
- Fixed redirect loop by excluding `/admin/unauthorized` from auth checks

## To Test the Debug Process

1. **Open browser console** (F12 or Cmd+Option+I)

2. **Navigate to:** http://localhost:3001/admin/login

3. **Click "Sign in with Google"**

4. **Watch the terminal** where `npm run dev` is running

You should see debug output like:
```
🔍 DEBUG: Starting Google OAuth callback
🔍 DEBUG: Exchanging code for session...
🔍 DEBUG: User email from Google: [your-email@domain.com]
🔍 DEBUG: User ID: [uuid]
🔍 DEBUG: Checking email: [your-email@domain.com]
🔍 DEBUG: Allowed emails: ['phil@pixelversestudios.io', 'sami@pixelversestudios.io']
🔍 DEBUG: Allowed domains: []
🔍 DEBUG: Email allowed? [true/false]
🔍 DEBUG: Checking admin_users table for user_id: [uuid]
🔍 DEBUG: Admin check result: { adminCheck: [data], adminCheckError: [error] }
🔍 DEBUG: Is admin? [true/false]
```

## Potential Issues to Look For

### Issue 1: Email Mismatch
**Look for:** Email from Google doesn't match allowed emails
**Fix:** Add the exact email to ADMIN_ALLOWED_EMAILS in .env.local

### Issue 2: No Admin User Record
**Look for:** `Admin check result: { adminCheck: null, adminCheckError: ... }`
**Fix:** Create admin user in database (see below)

### Issue 3: User Not Active
**Look for:** `adminCheck.is_active: false`
**Fix:** Update user to active in database

## Quick Fixes

### Add Admin User to Database
Run this SQL in Supabase Dashboard:
```sql
-- First, get the user ID for an email
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then create admin user (replace USER_ID with actual UUID from above)
INSERT INTO admin_users (user_id, role, is_active, permissions, metadata)
VALUES (
  'USER_ID_HERE',
  'super_admin',
  true,
  '{}',
  '{"created_via": "manual"}'
);
```

### Check Existing Admin Users
```sql
-- See all admin users
SELECT
  au.id,
  au.user_id,
  au.role,
  au.is_active,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id;
```

### Update Environment Variables
In `.env.local`, ensure emails match exactly:
```
ADMIN_ALLOWED_EMAILS=email1@domain.com,email2@domain.com
```

## What's Next?

1. **Try logging in** and watch the debug output
2. **Share the debug logs** from your terminal
3. **Tell me which step fails** based on the debug output

The debug logs will tell us exactly:
- What email Google is returning
- Whether it's in the allowlist
- Whether the user exists in admin_users table
- Why authentication is failing

Once we see the debug output, we can fix the specific issue!
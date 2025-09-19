# Admin Dashboard Setup Guide

## Prerequisites

1. Supabase project setup
2. Google Cloud Console access
3. Environment variables configured

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure OAuth consent screen if not done:
   - Choose "External" user type
   - Add app name: "Domani Admin"
   - Add support email
   - Add authorized domains: your-domain.com (and localhost for testing)
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Domani Admin OAuth"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local dev)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/admin/auth/google/callback`
     - `https://your-domain.com/api/admin/auth/google/callback`
     - `https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback`
7. Save the Client ID and Client Secret

## Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list and click "Enable"
5. Add your Google OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
6. Authorized Client IDs: (same as Client ID)
7. Save the configuration

## Step 3: Fix Database Schema Issues

Run this SQL in your Supabase SQL Editor to fix the confirmation_token issue:

```sql
-- Check if confirmation_token column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'auth'
AND table_name = 'users'
AND column_name = 'confirmation_token';

-- If it doesn't exist, you may need to update your Supabase Auth version
-- Or create it (ONLY if missing):
-- ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS confirmation_token text;
```

## Step 4: Set Up Admin Users Table

Run this SQL in Supabase to ensure the admin_users table exists:

```sql
-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'success',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on audit logs
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- Ensure the audit_action enum includes our values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
    CREATE TYPE audit_action AS ENUM (
      'login',
      'logout',
      'login_attempt',
      'create',
      'update',
      'delete',
      'view',
      'export',
      'import'
    );
  END IF;
END$$;
```

## Step 5: Add Your Admin User

1. First, sign in with Google using your admin email through the regular Supabase auth flow
2. Get your user ID from the auth.users table:

```sql
-- Find your user ID
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@domain.com';
```

3. Add yourself as an admin:

```sql
-- Insert admin user (replace with your actual values)
INSERT INTO admin_users (
  user_id,
  email,
  name,
  role,
  permissions,
  is_active
) VALUES (
  'YOUR-USER-ID-FROM-ABOVE',
  'your-email@domain.com',
  'Your Name',
  'super_admin',
  '{"*": ["*"]}',
  true
);
```

## Step 6: Configure Environment Variables

Ensure your `.env.local` file has:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Configuration
JWT_SECRET=your-jwt-secret-key
ADMIN_ALLOWED_EMAILS=email1@domain.com,email2@domain.com
```

## Step 7: Test the Login Flow

1. Clear your browser cookies for localhost:3000
2. Navigate to http://localhost:3000/admin/login
3. Click "Sign in with Google"
4. You should be redirected to Google
5. Sign in with an email listed in ADMIN_ALLOWED_EMAILS
6. You should be redirected back to /admin

## Troubleshooting

### "confirmation_token" Error

This is a Supabase database issue. The auth.users table is missing a column that the auth system expects.

**Solution**: Update your Supabase project or contact Supabase support.

### "Not Admin" Error

Your Google account email is not in the admin_users table.

**Solution**: Follow Step 5 to add your user to the admin_users table.

### "Email Not Allowed" Error

Your email is not in the ADMIN_ALLOWED_EMAILS environment variable.

**Solution**: Add your email to the ADMIN_ALLOWED_EMAILS in .env.local

### Cookie Errors

If you see Next.js cookie warnings, ensure all API routes use `await createClient()`.

### OAuth Redirect Error

Ensure the redirect URLs in Google Cloud Console match exactly:
- Include the protocol (http/https)
- Include the port for localhost (:3000)
- No trailing slashes

## Security Notes

1. **Never expose admin emails client-side** - All validation happens server-side
2. **Use environment variables** - Keep ADMIN_ALLOWED_EMAILS in .env.local
3. **Enable 2FA** - Encourage all admins to enable 2FA on their Google accounts
4. **Audit everything** - All admin actions are logged to admin_audit_logs
5. **Regular reviews** - Periodically review admin_users and remove inactive accounts

## Next Steps

Once authentication is working:

1. Customize admin roles and permissions
2. Set up additional security measures (IP allowlisting, etc.)
3. Configure session timeout policies
4. Set up monitoring and alerts for admin actions
5. Create admin onboarding documentation
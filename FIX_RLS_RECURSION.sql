-- =====================================================
-- FIX: RLS Infinite Recursion on admin_users table
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Drop the problematic RLS policies
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "System can authenticate admin users" ON admin_users;

-- Step 2: Temporarily disable RLS to insert data
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 3: Create your admin user (using your actual user ID from the logs)
-- First, check if the user already exists
SELECT * FROM admin_users WHERE user_id = '234dbcfa-1f7c-48b3-bd4a-7bb1c481d3bd';

-- If no results, insert the admin user
INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    created_at,
    updated_at,
    metadata
) VALUES (
    '234dbcfa-1f7c-48b3-bd4a-7bb1c481d3bd',  -- Your user ID from Google auth
    'super_admin',                             -- Give yourself super admin role
    true,                                       -- Active user
    '{}',                                       -- Empty permissions (super_admin has all)
    NOW(),
    NOW(),
    '{"created_via": "manual_fix", "email": "phil@pixelversestudios.io"}'
) ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = NOW();

-- Step 4: Create simpler, non-recursive RLS policies
-- Allow authenticated users to read admin_users without recursion
CREATE POLICY "Allow authenticated to read admin_users"
    ON admin_users FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Allow service role to do everything
CREATE POLICY "Service role full access"
    ON admin_users FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Step 5: Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 6: Verify the fix
SELECT
    au.id,
    au.user_id,
    au.role,
    au.is_active,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'phil@pixelversestudios.io';

-- Expected result: Should show your admin user with super_admin role and is_active = true
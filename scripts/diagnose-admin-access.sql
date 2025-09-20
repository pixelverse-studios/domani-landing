-- Diagnostic script to troubleshoot admin access issues
-- Run each query separately to identify the problem

-- 1. Check if the user exists in auth.users
SELECT
    id,
    email,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users
WHERE email = 'sami@pixelversestudios.io';

-- 2. Check if they have an admin_users record
SELECT
    au.*,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'sami@pixelversestudios.io';

-- 3. Check ALL admin users to see the structure
SELECT
    au.id,
    au.user_id,
    au.role,
    au.is_active,
    au.permissions,
    au.last_login_at,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- 4. Check if the role type exists (in case of enum issues)
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'admin_role'
);

-- 5. Create a simple test admin (replace USER_ID with actual ID)
-- This is a minimal insert to test
/*
INSERT INTO admin_users (user_id, role, is_active)
VALUES ('USER_ID_HERE', 'admin'::admin_role, true);
*/

-- 6. If admin_role enum is the issue, try this alternative:
-- First check what roles are available
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'admin_users' AND column_name = 'role';

-- 7. Check for any RLS policies that might be blocking
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'admin_users';
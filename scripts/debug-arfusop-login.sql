-- Debug script for arfusop@gmail.com login issues
-- Run these queries in order to identify the problem

-- 1. CHECK IF USER EXISTS IN AUTH.USERS
-- This user should exist after attempting Google login once
SELECT
    id as user_id,
    email,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users
WHERE email = 'arfusop@gmail.com';
-- Copy the user_id from above for next steps!

-- 2. CHECK IF ADMIN_USERS RECORD EXISTS
-- This determines if they're recognized as an admin
SELECT
    au.*,
    u.email
FROM admin_users au
RIGHT JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'arfusop@gmail.com';

-- 3. IF NO ADMIN RECORD EXISTS, CREATE ONE
-- Replace 'USER_ID_HERE' with the actual ID from query #1
/*
INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    created_at,
    updated_at
) VALUES (
    'USER_ID_HERE',  -- Replace with actual user_id from query #1
    'admin',         -- or 'super_admin'
    true,
    '{"dashboard": true, "users": true, "settings": true}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (user_id)
DO UPDATE SET
    is_active = true,
    role = 'admin',
    updated_at = NOW();
*/

-- 4. VERIFY THE ADMIN WAS CREATED/UPDATED
SELECT
    au.id as admin_id,
    au.user_id,
    au.role,
    au.is_active,
    au.permissions,
    u.email,
    u.last_sign_in_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'arfusop@gmail.com';

-- 5. CHECK ALL ADMIN USERS TO COMPARE
SELECT
    u.email,
    au.role,
    au.is_active,
    au.created_at,
    au.last_login_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- 6. CHECK AUDIT LOGS FOR THIS USER'S LOGIN ATTEMPTS
SELECT
    action,
    status,
    details,
    created_at
FROM admin_audit_logs
WHERE details::text LIKE '%arfusop@gmail.com%'
ORDER BY created_at DESC
LIMIT 10;
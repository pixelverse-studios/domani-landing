-- Fixed SQL script to create admin user in Supabase
-- The admin_users table doesn't have an email column, only user_id

-- Step 1: First get the user ID for your partner
-- They must have logged in with Google at least once
SELECT id, email
FROM auth.users
WHERE email = 'sami@pixelversestudios.io';

-- Step 2: Copy the ID from above, then run this query
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from step 1
INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    created_at,
    updated_at
) VALUES (
    'YOUR_USER_ID_HERE',  -- Replace with actual user ID from step 1
    'admin',              -- or 'super_admin' for full access
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

-- Step 3: Verify the admin was created
SELECT
    au.id,
    au.user_id,
    au.role,
    au.is_active,
    au.permissions,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'sami@pixelversestudios.io';
-- The admin record EXISTS but might be inactive or have wrong role
-- Let's check and fix it

-- 1. CHECK THE CURRENT STATE of arfusop's admin record
SELECT
    au.*,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'arfusop@gmail.com';

-- 2. FIX THE EXISTING RECORD
-- This updates the existing record to ensure it's active with correct role
UPDATE admin_users
SET
    is_active = true,
    role = 'admin',
    permissions = '{"dashboard": true, "users": true, "settings": true}'::jsonb,
    updated_at = NOW()
WHERE user_id = 'f48d81d9-ab36-430b-b6bd-2e5f21e276a4';

-- 3. VERIFY THE FIX
SELECT
    au.id,
    au.user_id,
    au.role,
    au.is_active,
    au.permissions,
    u.email,
    au.updated_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'arfusop@gmail.com';

-- 4. CHECK IF THERE'S AN ISSUE WITH THE ROLE ENUM
-- Sometimes the role might be set to an invalid value
SELECT
    au.role::text as role_text,
    au.is_active,
    u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email = 'arfusop@gmail.com';

-- 5. IF THE ROLE IS THE ISSUE, TRY CASTING EXPLICITLY
UPDATE admin_users
SET
    role = 'admin'::admin_role,
    is_active = true
WHERE user_id = 'f48d81d9-ab36-430b-b6bd-2e5f21e276a4';
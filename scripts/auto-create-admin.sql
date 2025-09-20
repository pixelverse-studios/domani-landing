-- Automated script to create admin users for all allowed emails
-- This ensures anyone in ADMIN_ALLOWED_EMAILS can actually log in

-- List of emails that should be admins
-- Update this list to match your ADMIN_ALLOWED_EMAILS env var
WITH allowed_emails AS (
    SELECT unnest(ARRAY[
        'phil@pixelversestudios.io',
        'sami@pixelversestudios.io',
        'arfusop@gmail.com'
    ]) AS email
)
-- Create admin records for users who exist but aren't admins yet
INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    created_at,
    updated_at
)
SELECT
    u.id,
    'admin'::admin_role,
    true,
    '{"dashboard": true, "users": true, "settings": true}'::jsonb,
    NOW(),
    NOW()
FROM auth.users u
INNER JOIN allowed_emails ae ON u.email = ae.email
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = u.id
)
ON CONFLICT (user_id)
DO UPDATE SET
    is_active = true,
    role = 'admin',
    updated_at = NOW();

-- Show results
SELECT
    u.email,
    au.role,
    au.is_active,
    CASE
        WHEN au.created_at = au.updated_at THEN 'Just created'
        ELSE 'Updated'
    END as status
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE u.email IN (
    'phil@pixelversestudios.io',
    'sami@pixelversestudios.io',
    'arfusop@gmail.com'
);
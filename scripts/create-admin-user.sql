-- Script to create an admin user in Supabase
-- Run this in your Supabase SQL Editor

-- First, the user needs to authenticate with Google at least once
-- Then run this to make them an admin:

-- Replace with your partner's email
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID from auth.users table (they must have logged in once)
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = 'sami@pixelversestudios.io'
    LIMIT 1;

    IF user_id IS NOT NULL THEN
        -- Create or update the admin user record
        INSERT INTO admin_users (
            user_id,
            email,
            role,
            is_active,
            permissions,
            created_at,
            updated_at
        ) VALUES (
            user_id,
            'sami@pixelversestudios.io',
            'admin',  -- or 'super_admin' for full access
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

        RAISE NOTICE 'Admin user created/updated successfully for sami@pixelversestudios.io';
    ELSE
        RAISE NOTICE 'User not found. They need to sign in with Google first.';
    END IF;
END $$;
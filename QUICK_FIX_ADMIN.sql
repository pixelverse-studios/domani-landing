-- =====================================================
-- QUICK FIX: Get Admin Login Working NOW
-- Run these commands one at a time in Supabase SQL Editor
-- =====================================================

-- COMMAND 1: Temporarily disable RLS (this allows queries to work)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- COMMAND 2: Create your admin user
INSERT INTO admin_users (
    user_id,
    role,
    is_active
) VALUES (
    '234dbcfa-1f7c-48b3-bd4a-7bb1c481d3bd',  -- Your user ID
    'super_admin',
    true
) ON CONFLICT (user_id) DO UPDATE SET
    role = 'super_admin',
    is_active = true;

-- COMMAND 3: Verify it worked
SELECT * FROM admin_users WHERE user_id = '234dbcfa-1f7c-48b3-bd4a-7bb1c481d3bd';

-- After running these, try logging in again!
-- The RLS being disabled will allow the authentication to work.
-- We can fix the RLS policies properly later.
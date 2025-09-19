-- Verify admin setup is complete

-- 1. Check all tables exist
SELECT 'Tables Check:' as section;
SELECT table_name,
       CASE WHEN table_name IS NOT NULL THEN '✅' ELSE '❌' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_users', 'admin_permissions', 'admin_audit_log', 'admin_sessions')
ORDER BY table_name;

-- 2. Check if you have a super admin user
SELECT 'Super Admin Check:' as section;
SELECT
    au.id,
    u.email,
    au.role,
    au.is_active,
    au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.role = 'super_admin'
  AND u.email = 'phil@pixelversestudios.io';

-- 3. Check permissions are set up
SELECT 'Permissions Check:' as section;
SELECT role, COUNT(*) as permission_count
FROM admin_permissions
GROUP BY role
ORDER BY role;

-- 4. Verify admin_sessions is ready
SELECT 'Sessions Table Structure:' as section;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'admin_sessions'
ORDER BY ordinal_position;
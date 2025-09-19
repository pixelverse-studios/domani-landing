-- Check if admin_users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'admin_users'
) as admin_users_exists;

-- Check if admin_sessions table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'admin_sessions'
) as admin_sessions_exists;

-- If admin_users exists, show its structure
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;
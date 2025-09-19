-- Simple check of what admin-related objects exist

-- 1. Check existing enums
SELECT 'ENUMS CHECK:' as section;
SELECT
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('admin_role', 'admin_action', 'audit_action')
GROUP BY typname;

-- 2. Check which tables exist
SELECT 'TABLES CHECK:' as section;
SELECT
    required.table_name,
    CASE
        WHEN ist.table_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM (
    VALUES
        ('admin_users'),
        ('admin_permissions'),
        ('admin_audit_log'),
        ('admin_sessions')
) AS required(table_name)
LEFT JOIN information_schema.tables ist
    ON ist.table_name = required.table_name
    AND ist.table_schema = 'public'
ORDER BY required.table_name;

-- 3. If admin_users exists, show its columns
SELECT 'ADMIN_USERS COLUMNS:' as section;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- 4. Check for existing indexes on admin tables
SELECT 'INDEXES CHECK:' as section;
SELECT
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN ('admin_users', 'admin_permissions', 'admin_audit_log', 'admin_sessions')
ORDER BY tablename, indexname;
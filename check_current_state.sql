-- Check what admin-related objects already exist

-- Check existing enums
SELECT
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('admin_role', 'admin_action', 'audit_action')
GROUP BY typname;

-- Check existing tables
SELECT
    table_name,
    CASE
        WHEN table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'DOES NOT EXIST'
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

-- Show admin_users structure if it exists
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;
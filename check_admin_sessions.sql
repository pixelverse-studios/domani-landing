-- Check if admin_sessions table exists and its structure
SELECT
    'Table exists' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_sessions'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'admin_sessions'::regclass;

-- Check existing indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'admin_sessions';

-- Check existing policies
SELECT
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'admin_sessions';
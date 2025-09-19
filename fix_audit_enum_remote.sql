-- =====================================================
-- FIX: Add missing audit_action enum values
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Check current enum values (for verification)
SELECT
    enumlabel as value,
    enumsortorder as sort_order
FROM pg_enum
WHERE enumtypid = 'audit_action'::regtype
ORDER BY enumsortorder;

-- Step 2: Add missing values (safe - won't error if they exist)
DO $$
BEGIN
    -- Check if 'login_attempt' exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumtypid = 'audit_action'::regtype
        AND enumlabel = 'login_attempt'
    ) THEN
        ALTER TYPE audit_action ADD VALUE 'login_attempt';
        RAISE NOTICE 'Added login_attempt to audit_action enum';
    ELSE
        RAISE NOTICE 'login_attempt already exists in audit_action enum';
    END IF;

    -- Check if 'login_error' exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumtypid = 'audit_action'::regtype
        AND enumlabel = 'login_error'
    ) THEN
        ALTER TYPE audit_action ADD VALUE 'login_error';
        RAISE NOTICE 'Added login_error to audit_action enum';
    ELSE
        RAISE NOTICE 'login_error already exists in audit_action enum';
    END IF;
END $$;

-- Step 3: Verify the values were added
SELECT
    enumlabel as value,
    CASE enumlabel
        WHEN 'login_attempt' THEN '✅ NEW - Failed login tracking'
        WHEN 'login_error' THEN '✅ NEW - System error tracking'
        ELSE '✓ Existing'
    END as status
FROM pg_enum
WHERE enumtypid = 'audit_action'::regtype
ORDER BY enumsortorder;

-- Step 4: Test that we can now insert audit logs with these values
-- (This is just a test - it will rollback)
BEGIN;
    INSERT INTO admin_audit_log (
        user_id,
        action,
        resource_type,
        description,
        metadata
    ) VALUES (
        NULL,
        'login_attempt'::audit_action,
        'auth',
        'TEST: Verifying login_attempt enum value works',
        '{"test": true}'::jsonb
    );

    -- If we get here, it worked!
    SELECT 'SUCCESS: login_attempt enum value is working correctly' as result;

    -- Rollback the test insert
    ROLLBACK;

BEGIN;
    INSERT INTO admin_audit_log (
        user_id,
        action,
        resource_type,
        description,
        metadata
    ) VALUES (
        NULL,
        'login_error'::audit_action,
        'auth',
        'TEST: Verifying login_error enum value works',
        '{"test": true}'::jsonb
    );

    -- If we get here, it worked!
    SELECT 'SUCCESS: login_error enum value is working correctly' as result;

    -- Rollback the test insert
    ROLLBACK;

-- Step 5: Final confirmation
SELECT
    'Audit enum fix complete! You should now be able to log in without errors.' as message,
    COUNT(*) as total_enum_values
FROM pg_enum
WHERE enumtypid = 'audit_action'::regtype;
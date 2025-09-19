-- =====================================================
-- URGENT FIX: Admin Login Audit Enum
--
-- Run these commands in Supabase Dashboard:
-- 1. Go to: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor (left sidebar)
-- 4. Run EACH command separately (one at a time)
-- =====================================================

-- COMMAND 1: Check current values
SELECT enumlabel as current_values FROM pg_enum WHERE enumtypid = 'audit_action'::regtype ORDER BY enumsortorder;

-- COMMAND 2: Add login_attempt (run this separately)
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt';

-- COMMAND 3: Add login_error (run this separately)
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error';

-- COMMAND 4: Verify the fix (run this to confirm)
SELECT enumlabel as all_values FROM pg_enum WHERE enumtypid = 'audit_action'::regtype ORDER BY enumsortorder;

-- You should see 12 values including:
-- 'login_attempt' and 'login_error'

-- After running these commands, your admin login should work!
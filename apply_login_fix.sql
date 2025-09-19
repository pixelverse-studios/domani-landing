-- Apply the login audit action fix directly to the remote database
-- Run this through Supabase SQL Editor

-- Add new enum values to audit_action
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error';

-- Verify the enum values were added
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'audit_action'::regtype
ORDER BY enumsortorder;
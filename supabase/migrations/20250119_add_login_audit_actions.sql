-- Add missing audit action enum values for login tracking
-- This migration adds 'login_attempt' and 'login_error' to the audit_action enum
-- to properly track failed login attempts and system errors during authentication

-- Add new enum values to audit_action
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error';

-- Note: ALTER TYPE ... ADD VALUE cannot run inside a transaction block
-- This is why we use IF NOT EXISTS to make it idempotent
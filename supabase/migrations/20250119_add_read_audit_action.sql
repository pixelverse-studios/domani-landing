-- Add 'read' to audit_action enum for tracking data access
-- This is needed for logging when admin users view/read data

ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'read';

-- Note: ALTER TYPE ADD VALUE cannot be executed inside a transaction block,
-- so this migration may need special handling depending on your deployment process
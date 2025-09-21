-- Migration: Add status column to waitlist table
-- Purpose: Replace confirmed boolean with status enum to support workflow states
-- Date: 2025-01-21

-- Add the status column with default 'confirmed' for new signups
ALTER TABLE waitlist
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'confirmed';

-- Add invited_at timestamp for tracking when invitations are sent
ALTER TABLE waitlist
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE;

-- Update existing records:
-- - If confirmed=true, set status='confirmed'
-- - If confirmed=false, set status='pending' (existing behavior)
UPDATE waitlist
SET status = CASE
  WHEN confirmed = true THEN 'confirmed'
  WHEN confirmed = false THEN 'pending'
  ELSE 'confirmed'
END
WHERE status IS NULL;

-- Add constraint to ensure valid status values
ALTER TABLE waitlist
DROP CONSTRAINT IF EXISTS waitlist_status_check;

ALTER TABLE waitlist
ADD CONSTRAINT waitlist_status_check
CHECK (status IN ('pending', 'invited', 'confirmed', 'registered'));

-- Create index for efficient status filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

-- Create index for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_waitlist_invited_at ON waitlist(invited_at)
WHERE invited_at IS NOT NULL;

-- Update the default for new records to 'confirmed' instead of 'pending'
-- This ensures new waitlist signups are immediately confirmed
ALTER TABLE waitlist ALTER COLUMN status SET DEFAULT 'confirmed';

-- Optional: Drop the old confirmed column after verification
-- Uncomment these lines after verifying the migration works correctly
-- ALTER TABLE waitlist DROP COLUMN IF EXISTS confirmed;
-- ALTER TABLE waitlist DROP COLUMN IF EXISTS confirmed_at;

-- Add comment for documentation
COMMENT ON COLUMN waitlist.status IS 'Waitlist entry status: pending (awaiting confirmation), invited (invitation sent), confirmed (email confirmed), registered (account created)';
COMMENT ON COLUMN waitlist.invited_at IS 'Timestamp when invitation email was sent';
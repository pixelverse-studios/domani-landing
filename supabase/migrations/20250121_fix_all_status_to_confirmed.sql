-- Migration: Update all existing waitlist entries to confirmed status
-- Purpose: Ensure all current waitlist entries have status='confirmed' as intended
-- Date: 2025-01-21

-- Update all existing records to have status='confirmed'
-- This fixes any records that still have 'pending' status
UPDATE waitlist
SET status = 'confirmed'
WHERE status = 'pending' OR status IS NULL;

-- Also update the confirmed boolean column if it still exists
UPDATE waitlist
SET confirmed = true
WHERE confirmed = false OR confirmed IS NULL;

-- Ensure the default for new records is 'confirmed'
ALTER TABLE waitlist
ALTER COLUMN status SET DEFAULT 'confirmed';

-- Add comment for documentation
COMMENT ON COLUMN waitlist.status IS 'Waitlist entry status - defaults to confirmed for all new signups';
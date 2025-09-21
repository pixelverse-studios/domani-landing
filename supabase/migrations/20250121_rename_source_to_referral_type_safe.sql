-- Migration: Safely rename source column to referral_type (checks if column exists)
-- Purpose: Better describe the purpose of this field which tracks referral/invitation types
-- Date: 2025-01-21

-- Check if source column exists and rename it, or add referral_type if it doesn't exist
DO $$
BEGIN
  -- Check if 'source' column exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'waitlist'
    AND column_name = 'source'
  ) THEN
    -- Rename the column from 'source' to 'referral_type'
    ALTER TABLE waitlist RENAME COLUMN source TO referral_type;
  -- Check if 'referral_type' column already exists
  ELSIF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'waitlist'
    AND column_name = 'referral_type'
  ) THEN
    -- Add referral_type column if neither source nor referral_type exists
    ALTER TABLE waitlist ADD COLUMN referral_type VARCHAR(50) DEFAULT 'website';
  END IF;
END $$;

-- Update the default value to be more descriptive (safe to run even if already set)
ALTER TABLE waitlist
ALTER COLUMN referral_type SET DEFAULT 'website';

-- Drop existing constraint if it exists, then add the new one
ALTER TABLE waitlist
DROP CONSTRAINT IF EXISTS waitlist_referral_type_check;

ALTER TABLE waitlist
ADD CONSTRAINT waitlist_referral_type_check
CHECK (referral_type IN (
  'website',           -- Default: organic website signup
  'early_adopter',     -- Early adopter program
  'friends_family',    -- Friends and family invitations
  'beta_tester',       -- Beta testing program
  'vip',              -- VIP access
  'partner',          -- Partner referrals
  'influencer',       -- Influencer partnerships
  'employee',         -- Internal employee access
  'investor',         -- Investor access
  'press',            -- Press/media access
  'other'             -- Other special access
));

-- Update existing 'Early Adopter' values to match new naming convention (if any exist)
UPDATE waitlist
SET referral_type = 'early_adopter'
WHERE referral_type = 'Early Adopter';

-- Create index for efficient filtering by referral type (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_type ON waitlist(referral_type);

-- Add helpful comment
COMMENT ON COLUMN waitlist.referral_type IS 'Type of referral or invitation channel: website (organic), early_adopter, friends_family, beta_tester, vip, partner, influencer, employee, investor, press, other';
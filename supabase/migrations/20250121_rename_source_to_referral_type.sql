-- Migration: Rename source column to referral_type for clarity
-- Purpose: Better describe the purpose of this field which tracks referral/invitation types
-- Date: 2025-01-21

-- Rename the column from 'source' to 'referral_type'
ALTER TABLE waitlist
RENAME COLUMN source TO referral_type;

-- Update the default value to be more descriptive
ALTER TABLE waitlist
ALTER COLUMN referral_type SET DEFAULT 'website';

-- Add a check constraint to ensure valid referral types (optional, can be expanded)
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

-- Update existing 'Early Adopter' values to match new naming convention
UPDATE waitlist
SET referral_type = 'early_adopter'
WHERE referral_type = 'Early Adopter';

-- Add index for efficient filtering by referral type
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_type ON waitlist(referral_type);

-- Add helpful comment
COMMENT ON COLUMN waitlist.referral_type IS 'Type of referral or invitation channel: website (organic), early_adopter, friends_family, beta_tester, vip, partner, influencer, employee, investor, press, other';
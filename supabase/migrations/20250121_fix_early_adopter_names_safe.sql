-- Migration: Fix incorrectly imported Early Adopter data (safe version)
-- Purpose: Move "Early Adopter" from name field to referral_type without violating NOT NULL constraint
-- Date: 2025-01-21

-- First, update records where name is "Early Adopter" to have the correct referral_type
-- Since name cannot be NULL, we'll set it to a placeholder or empty string
UPDATE waitlist
SET
  referral_type = 'early_adopter',
  name = 'Unknown'  -- Use 'Unknown' as placeholder since name cannot be NULL
WHERE
  name = 'Early Adopter'
  AND (referral_type = 'website' OR referral_type IS NULL);

-- Also handle any other potential mis-imported data patterns
UPDATE waitlist
SET
  referral_type = 'friends_family',
  name = 'Unknown'
WHERE
  name = 'Friends & Family'
  AND (referral_type = 'website' OR referral_type IS NULL);

UPDATE waitlist
SET
  referral_type = 'beta_tester',
  name = 'Unknown'
WHERE
  name = 'Beta Tester'
  AND (referral_type = 'website' OR referral_type IS NULL);

UPDATE waitlist
SET
  referral_type = 'vip',
  name = 'Unknown'
WHERE
  name = 'VIP'
  AND (referral_type = 'website' OR referral_type IS NULL);

-- Alternatively, if you want to remove the NOT NULL constraint to allow NULL names:
-- ALTER TABLE waitlist ALTER COLUMN name DROP NOT NULL;
-- Then you could update the names to NULL as originally intended

-- Add a comment for documentation
COMMENT ON TABLE waitlist IS 'Waitlist entries for Domani app. Fixed data import issue where referral types were incorrectly stored in name field (2025-01-21).';
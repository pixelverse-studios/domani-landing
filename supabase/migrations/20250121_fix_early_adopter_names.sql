-- Migration: Fix incorrectly imported Early Adopter data
-- Purpose: Move "Early Adopter" from name field to referral_type and clear the name
-- Date: 2025-01-21

-- First, update records where name is "Early Adopter" to have the correct referral_type
UPDATE waitlist
SET
  referral_type = 'early_adopter',
  name = NULL  -- Clear the name field since "Early Adopter" is not a real name
WHERE
  name = 'Early Adopter'
  AND (referral_type = 'website' OR referral_type IS NULL);

-- Also handle any other potential mis-imported data patterns
UPDATE waitlist
SET
  referral_type = 'friends_family',
  name = NULL
WHERE
  name = 'Friends & Family'
  AND (referral_type = 'website' OR referral_type IS NULL);

UPDATE waitlist
SET
  referral_type = 'beta_tester',
  name = NULL
WHERE
  name = 'Beta Tester'
  AND (referral_type = 'website' OR referral_type IS NULL);

UPDATE waitlist
SET
  referral_type = 'vip',
  name = NULL
WHERE
  name = 'VIP'
  AND (referral_type = 'website' OR referral_type IS NULL);

-- Add a comment for documentation
COMMENT ON TABLE waitlist IS 'Waitlist entries for Domani app. Fixed data import issue where referral types were incorrectly stored in name field (2025-01-21).';
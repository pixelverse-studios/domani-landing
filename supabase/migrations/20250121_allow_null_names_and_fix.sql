-- Migration: Allow NULL names and fix Early Adopter data
-- Purpose: Remove NOT NULL constraint from name column and fix incorrectly imported data
-- Date: 2025-01-21

-- First, remove the NOT NULL constraint from the name column
ALTER TABLE waitlist ALTER COLUMN name DROP NOT NULL;

-- Now update records where name is actually a referral type
UPDATE waitlist
SET
  referral_type = 'early_adopter',
  name = NULL
WHERE
  name = 'Early Adopter'
  AND (referral_type = 'website' OR referral_type IS NULL);

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
COMMENT ON COLUMN waitlist.name IS 'User name (optional - can be NULL for imported or special access records)';
COMMENT ON TABLE waitlist IS 'Waitlist entries for Domani app. Fixed data import issue where referral types were incorrectly stored in name field (2025-01-21).';
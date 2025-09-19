-- Fix admin_audit_log table foreign key constraint issue
-- The user_id should reference auth.users(id) and be nullable for system actions

-- First, drop the existing constraint if it exists
ALTER TABLE admin_audit_log
DROP CONSTRAINT IF EXISTS admin_audit_log_user_id_fkey;

-- Change user_id to UUID type if it's currently TEXT
DO $$
BEGIN
  -- Check if user_id is TEXT and convert to UUID if needed
  IF (SELECT data_type FROM information_schema.columns
      WHERE table_name = 'admin_audit_log' AND column_name = 'user_id') = 'text' THEN
    -- First, update any existing text values to null if they can't be converted
    UPDATE admin_audit_log
    SET user_id = NULL
    WHERE user_id IS NOT NULL
      AND user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    -- Now alter the column type
    ALTER TABLE admin_audit_log
    ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
  END IF;
END $$;

-- Make user_id nullable (for system actions or when user doesn't exist in auth.users)
ALTER TABLE admin_audit_log
ALTER COLUMN user_id DROP NOT NULL;

-- Add the foreign key constraint to auth.users
ALTER TABLE admin_audit_log
ADD CONSTRAINT admin_audit_log_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Also ensure admin_user_id is properly linked and nullable
ALTER TABLE admin_audit_log
ALTER COLUMN admin_user_id DROP NOT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);

-- Add comment explaining the columns
COMMENT ON COLUMN admin_audit_log.user_id IS 'References auth.users(id) - the Supabase auth user who performed the action';
COMMENT ON COLUMN admin_audit_log.admin_user_id IS 'References admin_users(id) - the admin profile if the user is an admin';
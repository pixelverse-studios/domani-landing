-- =============================================
-- Admin User Seed Script
-- Version: 1.0.0
-- Date: 2025-01-18
-- Description: Seeds initial super admin user
-- =============================================

-- IMPORTANT: Update these values before running!
-- Replace with your actual admin user's auth.users ID

DO $$
DECLARE
  v_user_id UUID;
  v_admin_email TEXT := 'phil@pixelversestudios.io'; -- Change this to your admin email
BEGIN
  -- Get the user ID from auth.users by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_admin_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users. Please create the user first.', v_admin_email;
  END IF;

  -- Insert or update the admin user
  INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    metadata
  ) VALUES (
    v_user_id,
    'super_admin',
    true,
    '{"all": true}',
    jsonb_build_object(
      'created_via', 'seed_script',
      'created_at', NOW()
    )
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    role = 'super_admin',
    is_active = true,
    updated_at = NOW();

  -- Log the admin creation
  PERFORM log_audit_event(
    v_user_id,
    'create'::audit_action,
    'admin_user',
    v_user_id::TEXT,
    'Initial super admin created via seed script',
    NULL,
    jsonb_build_object('role', 'super_admin'),
    jsonb_build_object('source', 'seed_script')
  );

  RAISE NOTICE 'Super admin user created/updated successfully for %', v_admin_email;
END;
$$;

-- Optional: Create additional admin users
-- Uncomment and modify as needed

/*
-- Create a standard admin
DO $$
DECLARE
  v_user_id UUID;
  v_admin_email TEXT := 'admin2@domani.app';
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_admin_email;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, role, is_active)
    VALUES (v_user_id, 'admin', true)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END;
$$;

-- Create an editor
DO $$
DECLARE
  v_user_id UUID;
  v_editor_email TEXT := 'editor@domani.app';
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_editor_email;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, role, is_active)
    VALUES (v_user_id, 'editor', true)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END;
$$;
*/

-- Verify the setup
SELECT
  au.id,
  au.role,
  au.is_active,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at;
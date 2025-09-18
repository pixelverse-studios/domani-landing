-- =============================================
-- Admin Dashboard Schema Migration
-- Version: 1.0.0
-- Date: 2025-01-18
-- Description: Creates admin tables, roles, permissions, and audit logging
-- =============================================

-- =============================================
-- 1. CREATE CUSTOM TYPES
-- =============================================

-- Admin role levels
CREATE TYPE admin_role AS ENUM (
  'super_admin',  -- Full system access
  'admin',        -- Standard admin access
  'editor',       -- Can edit content
  'viewer'        -- Read-only access
);

-- Action types for permissions
CREATE TYPE admin_action AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'export',
  'import',
  'execute'
);

-- Audit log action types
CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'login',
  'logout',
  'export',
  'import',
  'permission_change',
  'role_change',
  'settings_change'
);

-- =============================================
-- 2. CREATE TABLES
-- =============================================

-- ---------------------------------------------
-- Admin Users Table
-- Links auth.users to admin roles and permissions
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'viewer',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for admin_users
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_created_by ON admin_users(created_by);

-- ---------------------------------------------
-- Admin Roles Table
-- Defines role hierarchy and metadata
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL, -- Higher number = higher privilege
  parent_role_id UUID REFERENCES admin_roles(id),
  is_system_role BOOLEAN DEFAULT false, -- System roles can't be deleted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for admin_roles
CREATE INDEX idx_admin_roles_name ON admin_roles(name);
CREATE INDEX idx_admin_roles_level ON admin_roles(level);
CREATE INDEX idx_admin_roles_parent_role_id ON admin_roles(parent_role_id);

-- ---------------------------------------------
-- Admin Permissions Table
-- Granular permissions for role-based access
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role admin_role NOT NULL,
  resource TEXT NOT NULL, -- e.g., 'waitlist', 'campaigns', 'users'
  action admin_action NOT NULL,
  conditions JSONB DEFAULT '{}', -- For conditional permissions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, resource, action) -- Prevent duplicate permissions
);

-- Create indexes for admin_permissions
CREATE INDEX idx_admin_permissions_role ON admin_permissions(role);
CREATE INDEX idx_admin_permissions_resource ON admin_permissions(resource);
CREATE INDEX idx_admin_permissions_action ON admin_permissions(action);

-- ---------------------------------------------
-- Admin Audit Log Table
-- Comprehensive logging of all admin actions
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  admin_user_id UUID REFERENCES admin_users(id),
  action audit_action NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for admin_audit_log
CREATE INDEX idx_admin_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_resource_type ON admin_audit_log(resource_type);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_session_id ON admin_audit_log(session_id);

-- =============================================
-- 3. INSERT DEFAULT ROLES
-- =============================================

INSERT INTO admin_roles (name, display_name, description, level, is_system_role) VALUES
  ('super_admin', 'Super Admin', 'Full system access with all privileges', 100, true),
  ('admin', 'Admin', 'Standard admin access with most privileges', 75, true),
  ('editor', 'Editor', 'Can create and edit content', 50, true),
  ('viewer', 'Viewer', 'Read-only access to admin panel', 25, true)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 4. INSERT DEFAULT PERMISSIONS
-- =============================================

-- Super Admin - Full access to everything
INSERT INTO admin_permissions (role, resource, action) VALUES
  ('super_admin', '*', 'create'),
  ('super_admin', '*', 'read'),
  ('super_admin', '*', 'update'),
  ('super_admin', '*', 'delete'),
  ('super_admin', '*', 'export'),
  ('super_admin', '*', 'import'),
  ('super_admin', '*', 'execute');

-- Admin - Most privileges except system management
INSERT INTO admin_permissions (role, resource, action) VALUES
  ('admin', 'waitlist', 'create'),
  ('admin', 'waitlist', 'read'),
  ('admin', 'waitlist', 'update'),
  ('admin', 'waitlist', 'delete'),
  ('admin', 'waitlist', 'export'),
  ('admin', 'campaigns', 'create'),
  ('admin', 'campaigns', 'read'),
  ('admin', 'campaigns', 'update'),
  ('admin', 'campaigns', 'delete'),
  ('admin', 'campaigns', 'execute'),
  ('admin', 'users', 'read'),
  ('admin', 'users', 'update'),
  ('admin', 'analytics', 'read'),
  ('admin', 'analytics', 'export');

-- Editor - Can manage content
INSERT INTO admin_permissions (role, resource, action) VALUES
  ('editor', 'waitlist', 'read'),
  ('editor', 'waitlist', 'update'),
  ('editor', 'campaigns', 'create'),
  ('editor', 'campaigns', 'read'),
  ('editor', 'campaigns', 'update'),
  ('editor', 'analytics', 'read');

-- Viewer - Read-only access
INSERT INTO admin_permissions (role, resource, action) VALUES
  ('viewer', 'waitlist', 'read'),
  ('viewer', 'campaigns', 'read'),
  ('viewer', 'analytics', 'read'),
  ('viewer', 'users', 'read');

-- =============================================
-- 5. CREATE HELPER FUNCTIONS
-- =============================================

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_resource TEXT,
  p_action admin_action
) RETURNS BOOLEAN AS $$
DECLARE
  v_role admin_role;
  v_has_permission BOOLEAN;
BEGIN
  -- Get user's role
  SELECT role INTO v_role
  FROM admin_users
  WHERE user_id = p_user_id AND is_active = true;

  -- Check if user has permission
  SELECT EXISTS (
    SELECT 1
    FROM admin_permissions
    WHERE role = v_role
      AND (resource = p_resource OR resource = '*')
      AND action = p_action
  ) INTO v_has_permission;

  RETURN COALESCE(v_has_permission, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action audit_action,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_admin_user_id UUID;
  v_audit_id UUID;
BEGIN
  -- Get admin user id
  SELECT id INTO v_admin_user_id
  FROM admin_users
  WHERE user_id = p_user_id;

  -- Insert audit log entry
  INSERT INTO admin_audit_log (
    user_id,
    admin_user_id,
    action,
    resource_type,
    resource_id,
    description,
    old_values,
    new_values,
    metadata
  ) VALUES (
    p_user_id,
    v_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_description,
    p_old_values,
    p_new_values,
    p_metadata
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role level
CREATE OR REPLACE FUNCTION get_user_role_level(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_role admin_role;
  v_level INTEGER;
BEGIN
  -- Get user's role
  SELECT role INTO v_role
  FROM admin_users
  WHERE user_id = p_user_id AND is_active = true;

  -- Get role level
  SELECT level INTO v_level
  FROM admin_roles
  WHERE name = v_role::TEXT;

  RETURN COALESCE(v_level, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. CREATE UPDATE TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_permissions_updated_at
  BEFORE UPDATE ON admin_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 8. CREATE RLS POLICIES
-- =============================================

-- Admin Users Policies
CREATE POLICY "Admin users can view all admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Only super admins can insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can update admin users"
  ON admin_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can delete admin users"
  ON admin_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role = 'super_admin'
    )
  );

-- Admin Roles Policies (read-only for most)
CREATE POLICY "All admins can view roles"
  ON admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
    )
  );

CREATE POLICY "Only super admins can manage roles"
  ON admin_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role = 'super_admin'
    )
  );

-- Admin Permissions Policies
CREATE POLICY "All admins can view permissions"
  ON admin_permissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
    )
  );

CREATE POLICY "Only super admins can manage permissions"
  ON admin_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role = 'super_admin'
    )
  );

-- Audit Log Policies (append-only, no updates or deletes)
CREATE POLICY "Admins can view audit logs based on role level"
  ON admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND (
          au.role = 'super_admin'  -- Super admins see everything
          OR (
            au.role = 'admin'  -- Admins see non-sensitive logs
            AND admin_audit_log.action NOT IN ('permission_change', 'role_change')
          )
          OR (
            au.role IN ('editor', 'viewer')  -- Others see only their own logs
            AND admin_audit_log.user_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "System can insert audit logs"
  ON admin_audit_log FOR INSERT
  WITH CHECK (true);  -- Allow inserts from functions

-- No UPDATE or DELETE policies for audit_log (immutable)

-- =============================================
-- 9. GRANT PERMISSIONS TO FUNCTIONS
-- =============================================

GRANT EXECUTE ON FUNCTION has_permission TO authenticated;
GRANT EXECUTE ON FUNCTION log_audit_event TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role_level TO authenticated;

-- =============================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Composite indexes for common queries
CREATE INDEX idx_admin_users_active_role ON admin_users(is_active, role) WHERE is_active = true;
CREATE INDEX idx_admin_permissions_role_resource ON admin_permissions(role, resource);
CREATE INDEX idx_audit_log_user_created ON admin_audit_log(user_id, created_at DESC);

-- =============================================
-- Migration Complete
-- =============================================

COMMENT ON TABLE admin_users IS 'Stores admin user profiles linked to auth.users';
COMMENT ON TABLE admin_roles IS 'Defines available admin roles and their hierarchy';
COMMENT ON TABLE admin_permissions IS 'Maps roles to specific permissions on resources';
COMMENT ON TABLE admin_audit_log IS 'Immutable audit trail of all admin actions';

COMMENT ON FUNCTION has_permission IS 'Checks if a user has a specific permission on a resource';
COMMENT ON FUNCTION log_audit_event IS 'Creates an audit log entry for admin actions';
COMMENT ON FUNCTION get_user_role_level IS 'Returns the privilege level of a user based on their role';
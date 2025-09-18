-- =============================================
-- Admin Dashboard Schema Rollback Migration
-- Version: 1.0.0
-- Date: 2025-01-18
-- Description: Rollback script for admin schema migration
-- =============================================

-- WARNING: This will delete all admin data!
-- Make sure to backup any important data before running this rollback

-- =============================================
-- 1. DROP POLICIES
-- =============================================

-- Drop all RLS policies
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can delete admin users" ON admin_users;

DROP POLICY IF EXISTS "All admins can view roles" ON admin_roles;
DROP POLICY IF EXISTS "Only super admins can manage roles" ON admin_roles;

DROP POLICY IF EXISTS "All admins can view permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Only super admins can manage permissions" ON admin_permissions;

DROP POLICY IF EXISTS "Admins can view audit logs based on role level" ON admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON admin_audit_log;

-- =============================================
-- 2. DROP TRIGGERS
-- =============================================

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
DROP TRIGGER IF EXISTS update_admin_roles_updated_at ON admin_roles;
DROP TRIGGER IF EXISTS update_admin_permissions_updated_at ON admin_permissions;

-- =============================================
-- 3. DROP FUNCTIONS
-- =============================================

DROP FUNCTION IF EXISTS has_permission(UUID, TEXT, admin_action);
DROP FUNCTION IF EXISTS log_audit_event(UUID, audit_action, TEXT, TEXT, TEXT, JSONB, JSONB, JSONB);
DROP FUNCTION IF EXISTS get_user_role_level(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- =============================================
-- 4. DROP INDEXES
-- =============================================

-- Drop composite indexes
DROP INDEX IF EXISTS idx_admin_users_active_role;
DROP INDEX IF EXISTS idx_admin_permissions_role_resource;
DROP INDEX IF EXISTS idx_audit_log_user_created;

-- Drop individual indexes
DROP INDEX IF EXISTS idx_admin_users_user_id;
DROP INDEX IF EXISTS idx_admin_users_role;
DROP INDEX IF EXISTS idx_admin_users_is_active;
DROP INDEX IF EXISTS idx_admin_users_created_by;

DROP INDEX IF EXISTS idx_admin_roles_name;
DROP INDEX IF EXISTS idx_admin_roles_level;
DROP INDEX IF EXISTS idx_admin_roles_parent_role_id;

DROP INDEX IF EXISTS idx_admin_permissions_role;
DROP INDEX IF EXISTS idx_admin_permissions_resource;
DROP INDEX IF EXISTS idx_admin_permissions_action;

DROP INDEX IF EXISTS idx_admin_audit_log_user_id;
DROP INDEX IF EXISTS idx_admin_audit_log_action;
DROP INDEX IF EXISTS idx_admin_audit_log_resource_type;
DROP INDEX IF EXISTS idx_admin_audit_log_created_at;
DROP INDEX IF EXISTS idx_admin_audit_log_session_id;

-- =============================================
-- 5. DROP TABLES
-- =============================================

DROP TABLE IF EXISTS admin_audit_log CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- =============================================
-- 6. DROP CUSTOM TYPES
-- =============================================

DROP TYPE IF EXISTS audit_action CASCADE;
DROP TYPE IF EXISTS admin_action CASCADE;
DROP TYPE IF EXISTS admin_role CASCADE;

-- =============================================
-- Rollback Complete
-- =============================================
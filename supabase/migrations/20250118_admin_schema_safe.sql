-- Safe admin schema migration that checks for existing objects
-- This handles partial migrations and only creates what's missing

-- Check and create enums only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_action') THEN
        CREATE TYPE admin_action AS ENUM ('create', 'read', 'update', 'delete', 'export', 'import', 'execute');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
        CREATE TYPE audit_action AS ENUM (
            'create', 'update', 'delete', 'login', 'logout',
            'export', 'import', 'permission_change', 'role_change', 'settings_change'
        );
    END IF;
END$$;

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role admin_role NOT NULL DEFAULT 'viewer',
    permissions JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create admin_permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role admin_role NOT NULL,
    resource TEXT NOT NULL,
    action admin_action NOT NULL,
    conditions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, resource, action)
);

-- Create admin_audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    admin_user_id UUID REFERENCES admin_users(id),
    action audit_action NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes only if they don't exist
DO $$
BEGIN
    -- admin_users indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_user_id') THEN
        CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_role') THEN
        CREATE INDEX idx_admin_users_role ON admin_users(role);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_users_is_active') THEN
        CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
    END IF;

    -- admin_permissions indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_permissions_role') THEN
        CREATE INDEX idx_admin_permissions_role ON admin_permissions(role);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_permissions_resource') THEN
        CREATE INDEX idx_admin_permissions_resource ON admin_permissions(resource);
    END IF;

    -- admin_audit_log indexes
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_audit_log_user_id') THEN
        CREATE INDEX idx_admin_audit_log_user_id ON admin_audit_log(user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_audit_log_admin_user_id') THEN
        CREATE INDEX idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_audit_log_action') THEN
        CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_audit_log_resource_type') THEN
        CREATE INDEX idx_admin_audit_log_resource_type ON admin_audit_log(resource_type);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_audit_log_created_at') THEN
        CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
    END IF;
END$$;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can view themselves" ON admin_users;
DROP POLICY IF EXISTS "Admins can view other admin users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Admin users can view permissions" ON admin_permissions;
DROP POLICY IF EXISTS "Super admins can view all audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "Admin users can view own audit logs" ON admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON admin_audit_log;

-- Create RLS policies
-- Admin users policies
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.user_id = auth.uid()
            AND au.role = 'super_admin'
            AND au.is_active = true
        )
    );

CREATE POLICY "Admin users can view themselves" ON admin_users
    FOR SELECT
    USING (user_id = auth.uid() AND is_active = true);

CREATE POLICY "Admins can view other admin users" ON admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.user_id = auth.uid()
            AND au.role IN ('super_admin', 'admin')
            AND au.is_active = true
        )
    );

-- Admin permissions policies
CREATE POLICY "Super admins can manage permissions" ON admin_permissions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

CREATE POLICY "Admin users can view permissions" ON admin_permissions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

-- Audit log policies
CREATE POLICY "Super admins can view all audit logs" ON admin_audit_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

CREATE POLICY "Admin users can view own audit logs" ON admin_audit_log
    FOR SELECT
    USING (
        admin_user_id IN (
            SELECT id FROM admin_users
            WHERE user_id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "System can insert audit logs" ON admin_audit_log
    FOR INSERT
    WITH CHECK (true);

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'update_admin_users_updated_at'
    ) THEN
        CREATE TRIGGER update_admin_users_updated_at
        BEFORE UPDATE ON admin_users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'update_admin_permissions_updated_at'
    ) THEN
        CREATE TRIGGER update_admin_permissions_updated_at
        BEFORE UPDATE ON admin_permissions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    END IF;
END$$;

-- Insert default permissions only if they don't exist
INSERT INTO admin_permissions (role, resource, action)
SELECT * FROM (VALUES
    ('super_admin'::admin_role, '*', 'create'::admin_action),
    ('super_admin'::admin_role, '*', 'read'::admin_action),
    ('super_admin'::admin_role, '*', 'update'::admin_action),
    ('super_admin'::admin_role, '*', 'delete'::admin_action),
    ('super_admin'::admin_role, '*', 'export'::admin_action),
    ('super_admin'::admin_role, '*', 'import'::admin_action),
    ('super_admin'::admin_role, '*', 'execute'::admin_action),

    ('admin'::admin_role, 'waitlist', 'create'::admin_action),
    ('admin'::admin_role, 'waitlist', 'read'::admin_action),
    ('admin'::admin_role, 'waitlist', 'update'::admin_action),
    ('admin'::admin_role, 'waitlist', 'delete'::admin_action),
    ('admin'::admin_role, 'waitlist', 'export'::admin_action),

    ('editor'::admin_role, 'waitlist', 'create'::admin_action),
    ('editor'::admin_role, 'waitlist', 'read'::admin_action),
    ('editor'::admin_role, 'waitlist', 'update'::admin_action),
    ('editor'::admin_role, 'waitlist', 'export'::admin_action),

    ('viewer'::admin_role, 'waitlist', 'read'::admin_action),
    ('viewer'::admin_role, 'waitlist', 'export'::admin_action)
) AS v(role, resource, action)
ON CONFLICT (role, resource, action) DO NOTHING;

-- Check if your user exists and make them super admin (only if not exists)
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get your user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'phil@pixelversestudios.io'
    LIMIT 1;

    -- Insert admin user if found and doesn't exist
    IF v_user_id IS NOT NULL THEN
        INSERT INTO admin_users (user_id, role, is_active)
        VALUES (v_user_id, 'super_admin', true)
        ON CONFLICT (user_id)
        DO UPDATE SET
            role = 'super_admin',
            is_active = true
        WHERE admin_users.user_id = v_user_id;
    END IF;
END$$;
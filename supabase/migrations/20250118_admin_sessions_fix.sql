-- Fix admin_sessions table migration
-- This handles the case where the table or constraints may already exist

-- Drop the duplicate constraint if it exists
ALTER TABLE admin_sessions
DROP CONSTRAINT IF EXISTS admin_sessions_admin_user_id_fkey;

-- Create the table only if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    refresh_token_hash TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    invalidated_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_sessions_admin_user_id') THEN
        CREATE INDEX idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_sessions_expires_at') THEN
        CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_sessions_invalidated_at') THEN
        CREATE INDEX idx_admin_sessions_invalidated_at ON admin_sessions(invalidated_at);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_sessions_token_hash') THEN
        CREATE INDEX idx_admin_sessions_token_hash ON admin_sessions(token_hash);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Super admins can view all sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON admin_sessions;
DROP POLICY IF EXISTS "System can manage sessions" ON admin_sessions;

-- RLS Policies for admin_sessions
-- Only super admins can view all sessions
CREATE POLICY "Super admins can view all sessions" ON admin_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.role = 'super_admin'
            AND admin_users.is_active = true
        )
    );

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON admin_sessions
    FOR SELECT
    USING (
        admin_user_id IN (
            SELECT id FROM admin_users
            WHERE admin_users.user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- Only system can insert sessions (through service role)
CREATE POLICY "System can manage sessions" ON admin_sessions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Function to clean up expired sessions (replace if exists)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM admin_sessions
    WHERE expires_at < NOW()
    OR invalidated_at IS NOT NULL AND invalidated_at < NOW() - INTERVAL '7 days';
END;
$$;

-- Add comments for documentation
COMMENT ON TABLE admin_sessions IS 'Stores admin user sessions for authentication and session management';
COMMENT ON COLUMN admin_sessions.id IS 'Unique session ID (nanoid)';
COMMENT ON COLUMN admin_sessions.admin_user_id IS 'Reference to the admin user';
COMMENT ON COLUMN admin_sessions.token_hash IS 'SHA-256 hash of the access token';
COMMENT ON COLUMN admin_sessions.refresh_token_hash IS 'SHA-256 hash of the refresh token';
COMMENT ON COLUMN admin_sessions.expires_at IS 'When the session expires';
COMMENT ON COLUMN admin_sessions.invalidated_at IS 'When the session was invalidated (logout)';
COMMENT ON COLUMN admin_sessions.last_activity_at IS 'Last activity timestamp';
COMMENT ON COLUMN admin_sessions.ip_address IS 'IP address of the session';
COMMENT ON COLUMN admin_sessions.user_agent IS 'User agent string of the session';
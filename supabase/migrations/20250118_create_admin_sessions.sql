-- Create admin_sessions table from scratch
-- This migration creates the admin_sessions table for session management

-- Create the admin_sessions table
CREATE TABLE admin_sessions (
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

-- Create indexes for better query performance
CREATE INDEX idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_invalidated_at ON admin_sessions(invalidated_at);
CREATE INDEX idx_admin_sessions_token_hash ON admin_sessions(token_hash);

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

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

-- Function to clean up expired sessions
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
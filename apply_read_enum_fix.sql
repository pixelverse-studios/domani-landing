-- Fix for audit_action enum to include 'read'
-- This fixes the error: invalid input value for enum audit_action: "read"

-- First check if 'read' already exists (to make this idempotent)
DO $$
BEGIN
    -- Check if 'read' value exists in audit_action enum
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'read'
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'audit_action'
        )
    ) THEN
        -- Add 'read' to the enum
        ALTER TYPE audit_action ADD VALUE 'read' AFTER 'create';
    END IF;
END
$$;

-- Verify the enum values
SELECT unnest(enum_range(NULL::audit_action)) as audit_actions;
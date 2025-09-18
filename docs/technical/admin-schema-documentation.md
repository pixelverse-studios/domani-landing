# Admin Dashboard Database Schema Documentation

## Overview

This document describes the database schema for the Domani admin dashboard, implementing a Role-Based Access Control (RBAC) system with comprehensive audit logging.

## Architecture

The admin system uses a hybrid RBAC approach with:
- **Role-based primary access control** (super_admin, admin, editor, viewer)
- **Granular permissions** for specific resource actions
- **Comprehensive audit logging** for accountability
- **Row Level Security (RLS)** for automatic enforcement

## Database Tables

### 1. `admin_users`
Links Supabase auth users to admin roles with metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| role | ENUM | User's admin role |
| permissions | JSONB | Custom permissions override |
| is_active | BOOLEAN | Account status |
| last_login_at | TIMESTAMPTZ | Last login timestamp |
| created_by | UUID | Admin who created this user |
| metadata | JSONB | Additional user data |

### 2. `admin_roles`
Defines available roles and their hierarchical structure.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Unique role identifier |
| display_name | TEXT | Human-readable name |
| level | INTEGER | Privilege level (higher = more access) |
| parent_role_id | UUID | For role inheritance |
| is_system_role | BOOLEAN | Prevents deletion of core roles |

### 3. `admin_permissions`
Maps roles to specific permissions on resources.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| role | ENUM | Admin role |
| resource | TEXT | Resource name (e.g., 'waitlist') |
| action | ENUM | Allowed action |
| conditions | JSONB | Conditional permission rules |

### 4. `admin_audit_log`
Immutable log of all admin actions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User who performed action |
| action | ENUM | Type of action performed |
| resource_type | TEXT | Type of resource affected |
| resource_id | TEXT | ID of affected resource |
| old_values | JSONB | State before change |
| new_values | JSONB | State after change |
| ip_address | INET | Client IP address |
| created_at | TIMESTAMPTZ | When action occurred |

## Role Hierarchy

```
super_admin (level: 100)
    ├── admin (level: 75)
    ├── editor (level: 50)
    └── viewer (level: 25)
```

### Role Capabilities

#### Super Admin
- Full system access
- Can manage other admins
- Can modify system settings
- Access to all resources and actions

#### Admin
- Standard administrative access
- Can manage content and users
- Cannot modify system settings
- Cannot manage other admins

#### Editor
- Can create and edit content
- Can view analytics
- Cannot delete users
- Cannot export data

#### Viewer
- Read-only access
- Can view dashboards and reports
- Cannot make any changes

## Row Level Security (RLS) Policies

### Policy Overview

1. **admin_users**
   - SELECT: Admins can view all admin users
   - INSERT/UPDATE/DELETE: Only super_admins

2. **admin_roles**
   - SELECT: All admins can view
   - INSERT/UPDATE/DELETE: Only super_admins

3. **admin_permissions**
   - SELECT: All admins can view
   - INSERT/UPDATE/DELETE: Only super_admins

4. **admin_audit_log**
   - SELECT: Based on role level
   - INSERT: System only (via functions)
   - UPDATE/DELETE: Not allowed (immutable)

## Helper Functions

### `has_permission(user_id, resource, action)`
Checks if a user has a specific permission.

```sql
SELECT has_permission(
  auth.uid(),
  'waitlist',
  'delete'::admin_action
);
```

### `log_audit_event(...)`
Creates an audit log entry.

```sql
SELECT log_audit_event(
  auth.uid(),
  'update'::audit_action,
  'waitlist',
  '123',
  'Updated user email',
  '{"email": "old@example.com"}'::jsonb,
  '{"email": "new@example.com"}'::jsonb
);
```

### `get_user_role_level(user_id)`
Returns the privilege level of a user.

```sql
SELECT get_user_role_level(auth.uid());
```

## Setup Instructions

### 1. Run the Migration

```bash
# Using Supabase CLI
supabase db push

# Or manually in SQL editor
-- Copy contents of 20250118_admin_schema.sql
```

### 2. Create Initial Admin

1. First, create a user in Supabase Auth
2. Update `seed_admin.sql` with the user's email
3. Run the seed script:

```bash
supabase db seed -f supabase/seed_admin.sql
```

### 3. Verify Setup

```sql
-- Check admin users
SELECT au.*, u.email
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id;

-- Check permissions
SELECT * FROM admin_permissions
WHERE role = 'admin';

-- Test permission check
SELECT has_permission(auth.uid(), 'waitlist', 'read'::admin_action);
```

## Common Queries

### Get User's Permissions
```sql
SELECT DISTINCT p.*
FROM admin_permissions p
JOIN admin_users u ON u.role = p.role
WHERE u.user_id = auth.uid()
  AND u.is_active = true;
```

### Get Recent Audit Logs
```sql
SELECT
  al.*,
  u.email as user_email
FROM admin_audit_log al
JOIN auth.users u ON al.user_id = u.id
WHERE al.created_at > NOW() - INTERVAL '7 days'
ORDER BY al.created_at DESC
LIMIT 100;
```

### Check Active Admins
```sql
SELECT
  au.role,
  COUNT(*) as count
FROM admin_users au
WHERE au.is_active = true
GROUP BY au.role
ORDER BY
  CASE au.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'editor' THEN 3
    WHEN 'viewer' THEN 4
  END;
```

## Security Considerations

1. **Principle of Least Privilege**: Users get minimum necessary permissions
2. **Audit Everything**: All admin actions are logged
3. **RLS Enforcement**: Database-level security, not just application-level
4. **Immutable Audit Logs**: Cannot be modified or deleted
5. **Password Security**: Handled by Supabase Auth
6. **Session Management**: Use Supabase's built-in session handling

## Rollback Instructions

If you need to rollback the migration:

```bash
# Run the rollback script
supabase db push -f supabase/migrations/20250118_admin_schema_rollback.sql
```

⚠️ **Warning**: This will delete all admin data. Backup first!

## Next Steps

After setting up the database schema:

1. Implement admin authentication middleware
2. Create admin UI components
3. Set up API routes with permission checks
4. Add audit logging to all admin actions
5. Create admin dashboard pages

## Troubleshooting

### Permission Denied Errors
- Check if RLS is enabled on the table
- Verify the user has an active admin_users record
- Check the role has necessary permissions

### Audit Logs Not Recording
- Ensure the log_audit_event function is called
- Check that the user_id exists in auth.users
- Verify RLS policies allow INSERT on audit_log

### Role Not Working
- Check admin_permissions table for the role
- Verify the user's is_active status
- Ensure role enum value matches exactly
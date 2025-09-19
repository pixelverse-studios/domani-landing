# Admin Dashboard Setup Guide

## Overview

This guide documents the complete setup process for the Domani admin dashboard, including database schema, authentication, and user management.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Authentication Setup](#authentication-setup)
4. [Admin User Creation](#admin-user-creation)
5. [Google OAuth Integration](#google-oauth-integration)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

---

## Prerequisites

### Required Tools
- Supabase CLI installed
- Access to Supabase Dashboard
- Project repository cloned locally

### Project Structure
```
domani-landing/
├── supabase/
│   ├── migrations/
│   │   ├── 20250118_admin_schema.sql         # Admin tables & RLS
│   │   └── 20250118_admin_schema_rollback.sql # Rollback script
│   └── seed_admin.sql                        # Admin user setup
├── src/
│   └── types/
│       └── admin.ts                          # TypeScript definitions
└── docs/
    └── technical/
        └── admin-schema-documentation.md     # Schema details
```

---

## Database Setup

### Step 1: Connect Supabase CLI

```bash
# Login to Supabase
supabase login

# List your projects to find project ID
supabase projects list

# Link to your project
supabase link --project-ref <your-project-id>
# Enter database password when prompted
```

**Can't remember database password?**
1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database Password"
3. Set new password and save it securely

### Step 2: Run Migration

```bash
# Push the admin schema migration
supabase db push
```

**Alternative: Use SQL Editor**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250118_admin_schema.sql`
3. Paste and run

### What This Creates

The migration creates 4 tables:

#### `admin_users`
- Links auth.users to admin roles
- Tracks active status, permissions, metadata

#### `admin_roles`
- Defines role hierarchy (super_admin > admin > editor > viewer)
- System roles that cannot be deleted

#### `admin_permissions`
- Granular permissions per role
- Resource-based access control

#### `admin_audit_log`
- Immutable audit trail
- Tracks all admin actions

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- **admin_users**: Only super_admins can modify
- **admin_roles**: Read-only for most, super_admin can modify
- **admin_permissions**: Same as roles
- **admin_audit_log**: Append-only, no updates/deletes

---

## Authentication Setup

### Current Setup: Google OAuth (Recommended)

We're using Google OAuth for passwordless admin access.

### Email Used
- **Admin Email**: `phil@pixelversestudios.io`
- **Role**: `super_admin`

---

## Admin User Creation

### Quick Setup Script (Run This First!)

```sql
-- Run this in Supabase SQL Editor
-- Creates user and makes them super_admin in one command

WITH new_user AS (
  INSERT INTO auth.users (
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role
  ) VALUES (
    gen_random_uuid(),
    'phil@pixelversestudios.io',  -- Your admin email
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  )
  ON CONFLICT (email)
  DO UPDATE SET email_confirmed_at = now()
  RETURNING id
)
INSERT INTO admin_users (
  user_id,
  role,
  is_active,
  permissions
)
SELECT id, 'super_admin', true, '{"all": true}'
FROM new_user
ON CONFLICT (user_id)
DO UPDATE SET role = 'super_admin', is_active = true;

-- Verify it worked
SELECT
  au.role,
  u.email,
  au.is_active
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id;
```

### Alternative: Using Seed Script

If you prefer using the CLI:

```bash
# First ensure user exists in auth.users (run SQL above)
# Then run seed
supabase db seed -f supabase/seed_admin.sql
```

---

## Google OAuth Integration

### Phase 3 Implementation (Coming Next)

When we build the admin UI, we'll add Google OAuth:

#### 1. Enable Google Provider in Supabase

1. Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add Client ID and Secret (from Google Cloud Console)

#### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add redirect URI:
   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

#### 3. Implement in App

```typescript
// src/lib/auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function signInWithGoogle() {
  const supabase = createClientComponentClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/admin`,
    }
  })

  if (error) throw error
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "User not found in auth.users"
**Problem**: Trying to seed admin before creating user
**Solution**: Run the quick setup script above first

#### 2. "Relation already exists"
**Problem**: Migration already ran partially
**Solution**: Use SQL Editor to run migration manually

#### 3. "Cannot connect to Docker daemon"
**Problem**: CLI trying to use local Docker
**Solution**: Use `supabase link` to connect to remote project

#### 4. Email invite goes to localhost
**Problem**: Site URL not configured
**Solution**:
1. Authentication → URL Configuration
2. Update Site URL to your actual domain
3. Or just create user directly (skip email)

#### 5. Forgot database password
**Solution**: Reset in Dashboard → Settings → Database

---

## Verification Queries

Run these in SQL Editor to verify setup:

```sql
-- Check admin tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('admin_users', 'admin_roles', 'admin_permissions', 'admin_audit_log');

-- Check your admin user
SELECT
  au.id,
  au.role,
  au.is_active,
  u.email,
  au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'phil@pixelversestudios.io';

-- Check permissions
SELECT * FROM admin_permissions
WHERE role = 'super_admin';

-- Test permission function
SELECT has_permission(
  (SELECT id FROM auth.users WHERE email = 'phil@pixelversestudios.io'),
  'waitlist',
  'delete'::admin_action
);
```

---

## Next Steps

### Phase 3: Admin Authentication System
- [ ] Create admin auth middleware
- [ ] Build admin login page with Google OAuth
- [ ] Implement protected routes
- [ ] Add session management

### Phase 4: Admin UI
- [ ] Build admin dashboard layout
- [ ] Create sidebar navigation
- [ ] Implement role-based UI elements

### Current Progress
- ✅ Phase 1: React Query Setup (Complete)
- ✅ Phase 2: Database Schema (Complete)
- ⏳ Phase 3-12: Remaining implementation

---

## Important Notes

### Security Considerations
1. **Never commit credentials** - Use environment variables
2. **Google OAuth is preferred** - No passwords to manage
3. **RLS is enforced** - Database-level security
4. **Audit everything** - All actions are logged

### Development Workflow
1. Make database changes in migrations
2. Test in SQL Editor first
3. Document all changes
4. Create PR after each phase

### Role Hierarchy
```
super_admin (100) - Full system access
    ├── admin (75) - Standard admin access
    ├── editor (50) - Content management
    └── viewer (25) - Read-only access
```

---

## Quick Reference

### Key Commands
```bash
# Connect to project
supabase link --project-ref <id>

# Run migrations
supabase db push

# Run seed
supabase db seed -f supabase/seed_admin.sql

# Check status
supabase status
```

### Key Files
- Migration: `supabase/migrations/20250118_admin_schema.sql`
- Rollback: `supabase/migrations/20250118_admin_schema_rollback.sql`
- Seed: `supabase/seed_admin.sql`
- Types: `src/types/admin.ts`
- Docs: `docs/technical/admin-schema-documentation.md`

### Support Email
- Admin: `phil@pixelversestudios.io`

---

## Changelog

### 2025-01-18
- Initial admin schema implementation
- Created 4 admin tables with RLS
- Set up super_admin user
- Documented setup process

---

*This document is part of the Domani Admin Dashboard implementation.*
# How to Invite a Partner as Admin

## Quick Steps

### Step 1: Add Their Email to Environment Variables

1. **Locally** - Update `.env.local`:
```bash
ADMIN_ALLOWED_EMAILS=phil@pixelversestudios.io,sami@pixelversestudios.io,new@email.com
```

2. **In Netlify** - Add the same variable:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Site configuration → Environment variables
   - Add/Update `ADMIN_ALLOWED_EMAILS` with all allowed emails

### Step 2: Have Them Sign In Once

Send them this link: `https://www.domani-app.com/admin/login`

They should:
1. Click "Sign in with Google"
2. Use their Google account
3. They'll see "Unauthorized" (this is expected!)

### Step 3: Make Them an Admin in Database

After they've signed in once, go to Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Run this query (replace email):

```sql
-- Step 1: Get the user ID
SELECT id, email FROM auth.users WHERE email = 'sami@pixelversestudios.io';

-- Step 2: Copy the ID from above result, then run:
INSERT INTO admin_users (
    user_id,
    role,
    is_active,
    permissions,
    created_at,
    updated_at
) VALUES (
    'PASTE_USER_ID_HERE',  -- From step 1
    'admin',
    true,
    '{"dashboard": true, "users": true, "settings": true}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (user_id)
DO UPDATE SET
    is_active = true,
    role = 'admin',
    updated_at = NOW();
```

### Step 4: They Can Now Login!

Have them:
1. Go back to `https://www.domani-app.com/admin/login`
2. Sign in with Google again
3. They should now access the admin panel!

## Role Types

When creating the admin user, you can set different roles:

- `'super_admin'` - Full access to everything
- `'admin'` - Standard admin access
- `'editor'` - Can edit content but not settings
- `'viewer'` - Read-only access

## Permissions Object

Customize what they can access:

```json
{
  "dashboard": true,    // View dashboard
  "users": true,        // Manage users
  "settings": true,     // Change settings
  "content": true,      // Edit content
  "analytics": true,    // View analytics
  "billing": false      // Manage billing
}
```

## Troubleshooting

### "Email not allowed" error
- Check `ADMIN_ALLOWED_EMAILS` in Netlify
- Make sure there are no spaces in the email list
- Trigger a new deployment after updating

### "Not admin" error after adding to database
- Verify `is_active` is `true` in admin_users table
- Check that `user_id` matches the auth.users table
- Clear browser cookies and try again

### Can't find user in auth.users
- They need to sign in with Google at least once
- Even if they get "unauthorized", their account is created
- Then you can make them admin

## Security Notes

- Only add trusted partners as admins
- Use specific permissions, not blanket access
- Regularly audit admin users
- Remove access when no longer needed

## Quick SQL to Check Admin Status

```sql
-- See all admin users
SELECT
    au.email,
    au.role,
    au.is_active,
    au.last_login_at,
    u.last_sign_in_at
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- Check specific user
SELECT * FROM admin_users WHERE email = 'sami@pixelversestudios.io';
```
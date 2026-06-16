# Netlify Environment Variables Setup

## Required Environment Variables

Copy these environment variables to your Netlify dashboard:
**Site Settings -> Environment variables -> Add a variable**

### 1. Core Configuration

```bash
NEXT_PUBLIC_SITE_URL=https://www.domani-app.com
```

Use the canonical production domain. Configure preview domains separately only when OAuth redirects need preview support.

### 2. Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-exposed public configuration. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be committed to git.

### 3. Authentication Configuration

```bash
JWT_SECRET=your-secure-random-jwt-secret
ADMIN_ALLOWED_EMAILS=admin@example.com
```

`JWT_SECRET` is server-only. Generate it with a password manager or secret generator and store it only in Netlify environment variables.

### 4. Email Service (Resend)

```bash
RESEND_API_KEY=re_your_resend_api_key
```

`RESEND_API_KEY` is server-only and must never be committed to git.

### 5. Optional: Google Analytics

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Only set this when Google Analytics should run in that Netlify context.

## How to Add in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `domani-landing`
3. Navigate to **Site configuration** -> **Environment variables**
4. Click **Add a variable**
5. For each variable above:
   - Key: The variable name, such as `ADMIN_ALLOWED_EMAILS`
   - Values: The value from the secure source of truth
   - Scopes: Select the appropriate Netlify contexts
6. Click **Save variable**

## Important Notes

- **ADMIN_ALLOWED_EMAILS**: This is a comma-separated list of emails that can access the admin panel.
- **NEXT_PUBLIC_SITE_URL**: Must match your actual domain without a trailing slash.
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser.
- Other variables are server-side only and must not be committed to git.
- Never paste live secrets into tracked files. Store production values in Netlify and local values in `.env.local`, which is gitignored.

## Secret Rotation Checklist

If a live secret was ever committed or copied into a tracked document:

1. Rotate the secret in its source system, such as Supabase, Resend, or the admin auth configuration.
2. Update the corresponding Netlify environment variable.
3. Trigger a fresh deploy so the app uses the rotated value.
4. Revoke or delete the old value after confirming the deploy is healthy.

## Verification Steps

After adding or rotating variables:

1. Trigger a new deploy in Netlify.
2. Check deploy logs for missing environment variable warnings.
3. Try logging in with an email from the allowed list.
4. Submit a waitlist test in the intended environment if Supabase or Resend values changed.

## Supabase OAuth Configuration

Also verify in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** -> **Providers** -> **Google**
4. Ensure these redirect URLs are added:
   - `https://www.domani-app.com/api/admin/auth/google/callback` for production
   - `https://your-netlify-preview-domain.netlify.app/api/admin/auth/google/callback` only if preview OAuth is required
   - `http://localhost:3000/api/admin/auth/google/callback` for local development

## Troubleshooting

If you still see `email_not_allowed`:

- Double-check the `ADMIN_ALLOWED_EMAILS` variable is set correctly.
- Make sure there are no spaces around the commas.
- Verify you're logging in with the exact email.
- Check Netlify deploy logs for environment variable warnings.

If you see 403 errors:

- Ensure all Supabase variables are set in the active Netlify context.
- Verify `JWT_SECRET` is set.
- Check that the latest deploy completed successfully.

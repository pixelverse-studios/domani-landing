# Netlify Environment Variables Setup

## Required Environment Variables

Copy these environment variables to your Netlify dashboard:
**Site Settings → Environment variables → Add a variable**

### 1. Core Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://main--domani-landing.netlify.app
```
*Note: Update this to your custom domain when configured*

### 2. Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://exxnnlhxcjujxnnwwrxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4eG5ubGh4Y2p1anhubnd3cnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDA5MjMsImV4cCI6MjA3MzE3NjkyM30.6JMQ5WtHCtDbn1vkhEKZBqOjS-ScnRvjOHQefm7-eyY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4eG5ubGh4Y2p1anhubnd3cnh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYwMDkyMywiZXhwIjoyMDczMTc2OTIzfQ.1itDGUJ0_8peGLeTv2bGAsEo_KjjnlfgEwIcuaGRFSY
```

### 3. Authentication Configuration
```bash
JWT_SECRET=6WzTAJL07RIlGlk328v1mmVF5yba8nrYpNPOEV5bT6I=
ADMIN_ALLOWED_EMAILS=phil@pixelversestudios.io,sami@pixelversestudios.io
```
*Add your email here if you want admin access!*

### 4. Email Service (Resend)
```bash
RESEND_API_KEY=re_D8W4auyv_3npzE7wUQE9dd8m56HioF3HU
```

### 5. Optional: Google Analytics
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
*Only if you have Google Analytics set up*

## How to Add in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `domani-landing`
3. Navigate to **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. For each variable above:
   - Key: The variable name (e.g., `ADMIN_ALLOWED_EMAILS`)
   - Values: The value after the `=` sign
   - Scopes: Select all (Production, Preview, Local development)
6. Click **Save variable**

## Important Notes

- **ADMIN_ALLOWED_EMAILS**: This is a comma-separated list of emails that can access the admin panel
- **NEXT_PUBLIC_SITE_URL**: Must match your actual domain (without trailing slash)
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only (more secure)

## Verification Steps

After adding all variables:

1. **Trigger a new deploy** in Netlify (or push any change to Git)
2. **Clear your browser cache** completely
3. **Try logging in** with an email from the allowed list
4. Check the deploy logs for any errors

## Supabase OAuth Configuration

Also verify in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Google**
4. Ensure these redirect URLs are added:
   - `https://main--domani-landing.netlify.app/api/admin/auth/google/callback`
   - `https://www.domani-app.com/api/admin/auth/google/callback` (for custom domain)
   - `http://localhost:3000/api/admin/auth/google/callback` (for local development)

## Troubleshooting

If you still see "email_not_allowed":
- Double-check the `ADMIN_ALLOWED_EMAILS` variable is set correctly
- Make sure there are no spaces around the commas
- Verify you're logging in with the exact email (case-sensitive)
- Check Netlify deploy logs for any environment variable warnings

If you see 403 errors:
- Ensure all Supabase variables are set
- Verify the JWT_SECRET is set
- Check that the latest deploy completed successfully
# Supabase Authentication Setup Guide

## Overview
This guide covers the configuration needed in Supabase Dashboard to properly handle authentication flows including:
- Google OAuth login
- Email invites
- Magic links
- Password recovery

## Required Redirect URLs

### 1. In Supabase Dashboard

Go to **Authentication → URL Configuration** and set:

#### Site URL
```
https://www.domani-app.com
```
Or for Netlify subdomain:
```
https://main--domani-landing.netlify.app
```

#### Redirect URLs (Add ALL of these)
```
# Production URLs
https://www.domani-app.com
https://www.domani-app.com/auth/callback
https://www.domani-app.com/api/admin/auth/google/callback
https://main--domani-landing.netlify.app
https://main--domani-landing.netlify.app/auth/callback
https://main--domani-landing.netlify.app/api/admin/auth/google/callback

# Local Development
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/api/admin/auth/google/callback
```

### 2. Email Templates Configuration

Go to **Authentication → Email Templates** and update:

#### Invite User Template
Update the "Confirm your email" template action URL to:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&next=/welcome
```

#### Magic Link Template
Update the action URL to:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard
```

#### Reset Password Template
Update the action URL to:
```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
```

### 3. Google OAuth Provider Settings

Go to **Authentication → Providers → Google**:

1. Enable Google provider
2. Add your Google OAuth Client ID and Secret
3. Ensure "Skip nonce check" is disabled (for security)

## Authentication Flows

### 1. Google OAuth Flow (Admin)
- User clicks "Sign in with Google"
- Redirected to Google for authentication
- Returns to `/api/admin/auth/google/callback`
- Server validates admin status
- Redirects to `/admin` or `/admin/unauthorized`

### 2. Email Invite Flow
- Admin invites user from Supabase dashboard
- User receives email with invite link
- Clicks link and lands on site with tokens in URL hash
- `AuthHandler` component processes tokens
- User redirected to `/welcome` page

### 3. Magic Link Flow
- User requests magic link
- Receives email with link
- Clicks link and lands on site with tokens
- `AuthHandler` processes and redirects to `/dashboard`

### 4. Password Recovery Flow
- User requests password reset
- Receives email with recovery link
- Clicks link and lands on site
- Redirected to password reset page

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # Server-side auth callback handler
│   ├── api/
│   │   └── admin/
│   │       └── auth/
│   │           └── google/
│   │               └── callback/
│   │                   └── route.ts  # Google OAuth callback
│   ├── dashboard/
│   │   └── page.tsx              # User dashboard
│   └── welcome/
│       └── page.tsx              # Welcome page for new users
└── components/
    └── auth/
        └── AuthHandler.tsx       # Client-side token processor
```

## Testing the Flows

### Test Email Invite:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Invite user"
3. Enter test email
4. Check email and click invite link
5. Should land on welcome page

### Test Google OAuth:
1. Go to `/admin/login`
2. Click "Sign in with Google"
3. Authenticate with Google
4. Should redirect to admin panel (if allowed email)

### Test Magic Link:
1. Request magic link via Supabase Auth UI
2. Check email and click link
3. Should redirect to dashboard

## Troubleshooting

### "Invalid Redirect URL" Error
- Ensure ALL redirect URLs are added in Supabase
- Check for trailing slashes (remove them)
- Verify protocol (https vs http)

### Tokens Not Being Processed
- Check browser console for errors
- Verify `AuthHandler` component is mounted
- Clear browser cache and cookies

### Email Not Arriving
- Check Supabase email logs
- Verify email templates are configured
- Check spam folder

### User Stuck on Home Page
- Tokens might be in URL but not processed
- Check if `AuthHandler` is included in layout
- Verify client-side Supabase client is configured

## Security Notes

1. **Never expose** service role key to client
2. **Always validate** user permissions server-side
3. **Use HTTPS** in production
4. **Limit redirect URLs** to your domains only
5. **Enable RLS** on all database tables
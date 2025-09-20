# Google OAuth Configuration for Local Development

## Issue
When logging in with Google OAuth, the redirect URL is still using the Supabase project URL instead of localhost.

## Solution
You need to update your Google Cloud Console OAuth settings to include localhost redirect URIs.

### Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth Settings**
   - Go to "APIs & Services" → "Credentials"
   - Find your OAuth 2.0 Client ID (Web application)
   - Click on it to edit

3. **Add Authorized Redirect URIs**
   Add these URIs to the "Authorized redirect URIs" section:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/admin/login
   ```

4. **Update Authorized JavaScript Origins** (if needed)
   Add:
   ```
   http://localhost:3000
   ```

5. **Save Changes**
   - Click "Save" at the bottom
   - Changes may take a few minutes to propagate

## Important Notes

- Google OAuth requires exact URL matches, including protocol (http/https)
- For local development, use `http://localhost:3000`
- For production, update to use `https://www.domani-app.com`
- The Supabase project URL redirect is configured in Supabase Auth settings, not in your code

## Testing

After updating Google Cloud Console:
1. Clear your browser cookies/cache for localhost
2. Try logging in again at http://localhost:3000/admin/login
3. You should be redirected back to localhost after Google authentication

## Production Configuration

When deploying to production, remember to:
1. Add production URLs to Google OAuth settings
2. Update `.env.local` to use production URLs
3. Ensure Supabase Auth settings include production redirect URLs
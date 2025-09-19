// Server-side only configuration for admin access
// This file should ONLY be imported in server-side code (API routes, server components)

// Admin email whitelist - kept server-side for security
const ALLOWED_ADMIN_EMAILS = process.env.ADMIN_ALLOWED_EMAILS
  ? process.env.ADMIN_ALLOWED_EMAILS.split(',').map(email => email.trim())
  : [];

// Allowed domains for admin access
const ALLOWED_ADMIN_DOMAINS = process.env.ADMIN_ALLOWED_DOMAINS
  ? process.env.ADMIN_ALLOWED_DOMAINS.split(',').map(domain => domain.trim())
  : [];

/**
 * Check if an email is allowed admin access
 * This should ONLY be called server-side
 */
export function isEmailAllowedAdmin(email: string): boolean {
  if (!email) return false;

  // Check if email is in the whitelist
  if (ALLOWED_ADMIN_EMAILS.includes(email)) {
    return true;
  }

  // Check if email domain is allowed
  const domain = email.split('@')[1];
  if (domain && ALLOWED_ADMIN_DOMAINS.includes(domain)) {
    return true;
  }

  // In development, log warning if no restrictions are set
  if (process.env.NODE_ENV === 'development') {
    if (ALLOWED_ADMIN_EMAILS.length === 0 && ALLOWED_ADMIN_DOMAINS.length === 0) {
      console.warn(
        '⚠️ No admin email restrictions configured. Set ADMIN_ALLOWED_EMAILS or ADMIN_ALLOWED_DOMAINS in .env.local'
      );
      // In development only, you might want to allow all for testing
      // return true; // Uncomment this line to allow all emails in development
    }
  }

  return false;
}

/**
 * Get admin configuration (safe to expose to client)
 */
export function getAdminConfig() {
  return {
    hasRestrictions: ALLOWED_ADMIN_EMAILS.length > 0 || ALLOWED_ADMIN_DOMAINS.length > 0,
    // Don't expose the actual emails or domains
  };
}
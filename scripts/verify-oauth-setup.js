#!/usr/bin/env node

/**
 * Script to verify OAuth setup for production deployment
 */

console.log('=== OAuth Setup Verification ===\n');

// Check environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_ALLOWED_EMAILS',
  'JWT_SECRET'
];

console.log('1. Checking environment variables:');
const missingVars = [];
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✓ ${varName} is set`);
  } else {
    console.log(`   ✗ ${varName} is missing`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing environment variables:', missingVars.join(', '));
  console.log('   Make sure these are set in your Netlify dashboard under Site Settings > Environment Variables');
}

console.log('\n2. OAuth Redirect URLs to configure in Supabase:');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.domani-app.com';
console.log(`   Production: ${siteUrl}/api/admin/auth/google/callback`);
console.log(`   Local: http://localhost:3000/api/admin/auth/google/callback`);

console.log('\n3. Steps to configure in Supabase Dashboard:');
console.log('   a. Go to https://supabase.com/dashboard');
console.log('   b. Select your project');
console.log('   c. Navigate to Authentication > Providers');
console.log('   d. Click on Google provider');
console.log('   e. Add the redirect URLs above to "Authorized redirect URIs"');
console.log('   f. Save the configuration');

console.log('\n4. Google OAuth Configuration:');
console.log('   Make sure your Google OAuth app includes these redirect URIs:');
console.log(`   - ${siteUrl}/api/admin/auth/google/callback`);
console.log('   - http://localhost:3000/api/admin/auth/google/callback');

console.log('\n5. Netlify Configuration:');
console.log('   ✓ @netlify/plugin-nextjs installed');
console.log('   ✓ netlify.toml configured with Next.js plugin');

console.log('\n6. Allowed Admin Emails:');
const allowedEmails = process.env.ADMIN_ALLOWED_EMAILS;
if (allowedEmails) {
  const emails = allowedEmails.split(',').map(e => e.trim());
  emails.forEach(email => {
    console.log(`   - ${email}`);
  });
} else {
  console.log('   ⚠️  No admin emails configured');
}

console.log('\n=== Verification Complete ===');
console.log('\nIf you continue to see 403 errors:');
console.log('1. Check that ALL redirect URLs are added in Supabase');
console.log('2. Verify environment variables are set in Netlify');
console.log('3. Clear your browser cache and cookies');
console.log('4. Try an incognito/private browser window');
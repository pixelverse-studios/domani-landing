#!/usr/bin/env node

/**
 * Script to verify what environment variables are available in production
 * Deploy this and check the Netlify function logs
 */

console.log('=== Environment Variables Check ===\n');

// Check critical admin variables
const adminEmails = process.env.ADMIN_ALLOWED_EMAILS;
const jwtSecret = process.env.JWT_SECRET;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

console.log('1. Admin Configuration:');
console.log(`   ADMIN_ALLOWED_EMAILS: ${adminEmails ? `Set (${adminEmails})` : '❌ NOT SET - THIS IS YOUR PROBLEM!'}`);
console.log(`   JWT_SECRET: ${jwtSecret ? 'Set' : '❌ NOT SET'}`);

console.log('\n2. Site Configuration:');
console.log(`   NEXT_PUBLIC_SITE_URL: ${siteUrl || 'Not set (using default)'}`);

console.log('\n3. Supabase Configuration:');
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}`);
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'}`);

if (!adminEmails) {
  console.log('\n❌ CRITICAL ERROR: ADMIN_ALLOWED_EMAILS is not set!');
  console.log('This is why you\'re getting "email_not_allowed" error.');
  console.log('\nTO FIX:');
  console.log('1. Go to Netlify Dashboard → Site configuration → Environment variables');
  console.log('2. Add variable: ADMIN_ALLOWED_EMAILS = phil@pixelversestudios.io,sami@pixelversestudios.io');
  console.log('3. Deploy again');
}

console.log('\n=== End Environment Check ===');
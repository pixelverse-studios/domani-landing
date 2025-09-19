/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script to fix audit_action enum in Supabase database
 * Run with: node scripts/fix-audit-enum.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function fixAuditEnum() {
  console.log('🔧 Fixing audit_action enum in Supabase database...\n');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Step 1: Check current enum values
    console.log('📋 Checking current enum values...');
    const { data: _currentValues, error: checkError } = await supabase
      .rpc('get_enum_values', { enum_type: 'audit_action' })
      .single();

    if (checkError) {
      // Create a helper function if it doesn't exist
      console.log('Creating helper function...');
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE OR REPLACE FUNCTION get_enum_values(enum_type text)
          RETURNS json AS $$
          BEGIN
            RETURN (
              SELECT json_agg(enumlabel ORDER BY enumsortorder)
              FROM pg_enum
              WHERE enumtypid = enum_type::regtype
            );
          END;
          $$ LANGUAGE plpgsql;
        `
      });
    }

    // Step 2: Add missing values
    console.log('\n✨ Adding missing enum values...');

    // Note: We need to run these as raw SQL
    // Since ALTER TYPE ADD VALUE can't run in a transaction, we'll use pg_enum directly

    console.log('  → Adding login_attempt...');
    const { error: addError1 } = await supabase.rpc('exec_sql', {
      sql: "ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt'"
    });

    if (addError1) {
      console.log('  ⚠️  login_attempt might already exist or needs manual addition');
    } else {
      console.log('  ✅ login_attempt added successfully');
    }

    console.log('  → Adding login_error...');
    const { error: addError2 } = await supabase.rpc('exec_sql', {
      sql: "ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error'"
    });

    if (addError2) {
      console.log('  ⚠️  login_error might already exist or needs manual addition');
    } else {
      console.log('  ✅ login_error added successfully');
    }

    // Step 3: Verify the values were added
    console.log('\n🔍 Verifying enum values...');
    const { data: finalValues, error: verifyError } = await supabase
      .rpc('get_enum_values', { enum_type: 'audit_action' })
      .single();

    if (!verifyError && finalValues) {
      console.log('  Current values:', finalValues);

      if (finalValues.includes('login_attempt') && finalValues.includes('login_error')) {
        console.log('\n✅ SUCCESS! Both enum values are now in the database.');
        console.log('You should be able to log in without errors now.\n');
      } else {
        console.log('\n⚠️  Values might not have been added. Please add them manually.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Please run the SQL commands manually in Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project: exxnnlhxcjujxnnwwrxv');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Run these commands (one at a time):');
    console.log("      ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_attempt';");
    console.log("      ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'login_error';");
  }
}

// Handle direct execution
if (require.main === module) {
  fixAuditEnum()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { fixAuditEnum };
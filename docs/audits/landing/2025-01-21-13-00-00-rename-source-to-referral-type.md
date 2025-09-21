# Audit Log - Landing Page - 2025-01-21 13:00:00

## Prompt Summary
User wanted to rename the "source" column in the waitlist table to something more descriptive, as it will hold values like "Early Adopter", "Friends & Family", and other referral types.

## Actions Taken
1. Created database migration to rename column from `source` to `referral_type`
2. Added check constraint for valid referral types
3. Updated all API endpoints to use new column name
4. Updated TypeScript interfaces to use `referralType` property
5. Updated admin dashboard to display formatted referral type labels
6. Fixed CSV export to use new column name

## Files Changed
- `supabase/migrations/20250121_rename_source_to_referral_type.sql` - Created migration to rename column and add constraints
- `src/app/api/waitlist/route.ts` - Changed from `source: 'website'` to `referral_type: 'website'`
- `src/app/api/admin/waitlist/route.ts` - Updated to use `referral_type` column
- `src/app/api/admin/waitlist/export/route.ts` - Updated CSV export headers and field mapping
- `src/hooks/useWaitlist.ts` - Changed TypeScript interface from `source?` to `referralType?`
- `src/app/admin/waitlist/page.tsx` - Updated table column to display formatted referral type labels

## Components/Features Affected
- Waitlist signup process
- Admin waitlist management
- Waitlist CSV export
- Admin dashboard table display

## Database Schema Changes
### Old Column:
- `source VARCHAR(50) DEFAULT 'website'`

### New Column:
- `referral_type VARCHAR(50) DEFAULT 'website'`

### Valid Values:
- `website` - Default organic website signup
- `early_adopter` - Early adopter program
- `friends_family` - Friends and family invitations
- `beta_tester` - Beta testing program
- `vip` - VIP access
- `partner` - Partner referrals
- `influencer` - Influencer partnerships
- `employee` - Internal employee access
- `investor` - Investor access
- `press` - Press/media access
- `other` - Other special access

## Testing Considerations
- Verify new signups get correct `referral_type` value
- Test admin filtering by referral type
- Verify CSV export shows correct column header
- Test that existing data migrates correctly

## Performance Impact
- Added index on `referral_type` column for efficient filtering
- No impact on bundle size
- No impact on page load performance

## Migration Instructions
### For Local Development:
```bash
npx supabase start  # Requires Docker
npx supabase migration up
```

### For Production:
```bash
npx supabase db push
```

### Direct SQL:
Run the migration in Supabase Dashboard SQL Editor

## Next Steps
- Deploy migration to production
- Update any marketing documentation referencing "source"
- Consider adding UI for admins to set custom referral types
- Add analytics tracking for referral type performance

## Notes
- Migration includes automatic update of existing "Early Adopter" values to snake_case format
- Admin dashboard shows human-readable labels (e.g., "Friends & Family" instead of "friends_family")
- Column rename maintains all existing data integrity

## Timestamp
Created: 2025-01-21 13:00:00
Page Section: waitlist/backend
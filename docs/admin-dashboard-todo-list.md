# Admin Dashboard Implementation TODO List

## Overview
This is a detailed, step-by-step TODO list for implementing the admin dashboard. Each task is small and focused, allowing for incremental progress and easy review.

## Current Status
- **Last Updated**: 2025-01-18
- **Phase 1**: ✅ COMPLETE (3/3 tasks)
- **Phase 2**: ✅ COMPLETE (4/4 tasks)
- **Phase 3**: ⏳ In Progress (2/5 tasks)
- **Phase 4-12**: ⏳ Not Started (0/35 tasks)
- **Overall Progress**: 19.1% (9/47 tasks)

---

## Phase 1: Foundation Setup (React Query & Dependencies) ✅ COMPLETE
- [x] **1. Install required npm dependencies for admin dashboard**
  - Add React Query, TanStack Table, auth helpers, form libraries
  - Command: `npm install @tanstack/react-query @tanstack/react-table @supabase/auth-helpers-nextjs react-hook-form @hookform/resolvers zod sonner @tiptap/react @tiptap/starter-kit date-fns cmdk`

- [x] **2. Create QueryProvider component for React Query**
  - Create `src/providers/QueryProvider.tsx`
  - Set up QueryClient with default options
  - Add React Query DevTools for development

- [x] **3. Add QueryProvider wrapper to root layout**
  - Modify `src/app/layout.tsx`
  - Wrap app with QueryProvider inside ThemeProvider
  - Maintain existing analytics and theme setup

---

## Phase 2: Database Schema Setup ✅ COMPLETE
- [x] **4. Create Supabase database schema for admin roles table**
  - Create `admin_roles` table with user_id, role, permissions
  - Add proper foreign keys and constraints
  - ✅ Created in `20250118_admin_schema.sql`

- [x] **5. Create Supabase database schema for admin permissions table**
  - Create `admin_permissions` table for RBAC
  - Define roles: super_admin, admin, editor, viewer
  - ✅ Implemented with granular permissions

- [x] **6. Create Supabase database schema for audit log table**
  - Create `admin_audit_log` for tracking admin actions
  - Include user_id, action, resource, timestamp
  - ✅ Created with immutable audit trail

- [x] **7. Set up Row Level Security policies for admin tables**
  - Enable RLS on admin tables
  - Create policies for admin access control
  - ✅ RLS policies active on all admin tables

**Completion Notes:**
- Migration deployed to Supabase
- Super admin user configured (phil@pixelversestudios.io)
- TypeScript types created (`src/types/admin.ts`)
- Full documentation in `docs/ADMIN_SETUP_GUIDE.md`

---

## Phase 3: Admin Authentication System
- [x] **8. Create admin auth middleware utility** ✅
  - Created `src/lib/admin/middleware.ts`
  - Built `withAdminAuth` wrapper for API routes
  - Added comprehensive permission checking logic
  - Implemented JWT token management
  - Added rate limiting and session management

- [x] **9. Create admin authentication hooks with React Query** ✅
  - Created `src/hooks/useAdminAuth.ts`
  - Implemented useAdminUser, useAdminLogin, useAdminLogout
  - Added comprehensive error handling and toast notifications
  - Included session management with auto-refresh
  - Built permission checking system

- [ ] **10. Build admin login page component**
  - Create `src/app/admin/login/page.tsx`
  - Reuse existing form patterns from WaitlistForm
  - Apply existing dark mode styles

- [ ] **11. Create admin login API route**
  - Create `src/app/api/admin/auth/login/route.ts`
  - Verify admin role after Supabase auth
  - Return appropriate error messages

- [ ] **12. Create admin verification API route**
  - Create `src/app/api/admin/auth/verify/route.ts`
  - Check if user has admin privileges
  - Return user role and permissions

---

## Phase 4: Admin Layout & Navigation
- [ ] **13. Build AdminSidebar component**
  - Create `src/components/admin/AdminSidebar.tsx`
  - Reuse existing Logo and ThemeToggle components
  - Add navigation items with active states

- [ ] **14. Create admin layout with sidebar integration**
  - Create `src/app/admin/layout.tsx`
  - Implement protected route logic
  - Add sidebar and main content area

- [ ] **15. Build admin dashboard home page**
  - Create `src/app/admin/page.tsx`
  - Add overview stats and quick actions
  - Display recent activity

---

## Phase 5: Data Table Component
- [ ] **16. Create DataTable component with TanStack Table**
  - Create `src/components/admin/DataTable.tsx`
  - Implement sorting, filtering, pagination
  - Use existing Tailwind classes for styling

---

## Phase 6: Waitlist Management
- [ ] **17. Create useWaitlist React Query hooks**
  - Create `src/hooks/useWaitlist.ts`
  - Implement data fetching, export, delete operations
  - Add proper caching and invalidation

- [ ] **18. Build waitlist management page**
  - Create `src/app/admin/waitlist/page.tsx`
  - Integrate DataTable with waitlist data
  - Add search and filter controls

- [ ] **19. Create admin waitlist API routes (GET, DELETE)**
  - Create `src/app/api/admin/waitlist/route.ts`
  - Implement pagination and filtering
  - Use admin middleware for protection

- [ ] **20. Add bulk selection functionality to DataTable**
  - Enhance DataTable with checkbox column
  - Implement select all/none functionality
  - Add bulk action dropdown

- [ ] **21. Create waitlist export API route**
  - Create `src/app/api/admin/waitlist/export/route.ts`
  - Generate CSV format
  - Handle large datasets efficiently

- [ ] **22. Add export functionality to waitlist page**
  - Add export button to waitlist page
  - Implement CSV download
  - Show progress for large exports

---

## Phase 7: Email Campaign Database
- [ ] **23. Create email templates database schema**
  - Create `email_templates` table
  - Add fields for HTML, text, variables

- [ ] **24. Create email campaigns database schema**
  - Create `email_campaigns` table
  - Track status, recipients, metrics

- [ ] **25. Create campaign recipients database schema**
  - Create `campaign_recipients` table
  - Link campaigns to waitlist users

---

## Phase 8: Email Campaign UI
- [ ] **26. Build EmailComposer component with rich text editor**
  - Create `src/components/admin/EmailComposer.tsx`
  - Integrate Tiptap editor
  - Add variable insertion support

- [ ] **27. Create useCampaigns React Query hooks**
  - Create `src/hooks/useCampaigns.ts`
  - Handle campaign CRUD operations
  - Add optimistic updates

- [ ] **28. Build campaigns list page**
  - Create `src/app/admin/campaigns/page.tsx`
  - Show campaign status and metrics
  - Add filtering and sorting

- [ ] **29. Build create campaign page**
  - Create `src/app/admin/campaigns/new/page.tsx`
  - Integrate EmailComposer
  - Add recipient selection from waitlist

- [ ] **30. Create campaigns API routes (GET, POST)**
  - Create `src/app/api/admin/campaigns/route.ts`
  - Handle campaign creation and listing
  - Validate campaign data

---

## Phase 9: Email Sending Integration
- [ ] **31. Create email sending service with Resend**
  - Create `src/lib/email/sender.ts`
  - Implement batch sending logic
  - Add rate limiting

- [ ] **32. Create campaign send API route**
  - Create `src/app/api/admin/campaigns/[id]/send/route.ts`
  - Process recipient list
  - Handle sending in batches

- [ ] **33. Add email template management page**
  - Create `src/app/admin/templates/page.tsx`
  - CRUD operations for templates
  - Preview functionality

- [ ] **34. Create template API routes**
  - Create `src/app/api/admin/templates/route.ts`
  - Handle template CRUD
  - Validate template variables

- [ ] **35. Add email preview functionality**
  - Add preview modal to EmailComposer
  - Show desktop and mobile views
  - Display with sample data

- [ ] **36. Implement email compliance footer**
  - Create compliance footer component
  - Add unsubscribe link
  - Include company details

---

## Phase 10: Polish & UX
- [ ] **37. Add loading states to all pages**
  - Create loading skeletons
  - Add to data fetching components
  - Maintain layout during loads

- [ ] **38. Add error boundaries for admin section**
  - Create error boundary component
  - Handle errors gracefully
  - Provide recovery options

- [ ] **39. Implement toast notifications with Sonner**
  - Add Toaster to admin layout
  - Configure toast styles
  - Use for all user feedback

---

## Phase 11: Testing
- [ ] **40. Test admin auth flow end-to-end**
  - Test login/logout
  - Verify role-based access
  - Check session persistence

- [ ] **41. Test waitlist management features**
  - Test search, filter, pagination
  - Verify bulk operations
  - Check export functionality

- [ ] **42. Test email campaign creation and sending**
  - Create test campaign
  - Verify recipient selection
  - Test actual email sending

- [ ] **43. Add responsive design for mobile admin**
  - Test on mobile devices
  - Add mobile-specific navigation
  - Ensure all features work on mobile

---

## Phase 12: Deployment Preparation
- [ ] **44. Create seed script for initial super admin**
  - Create `scripts/seed-admin.ts`
  - Add first admin user
  - Set up initial permissions

- [ ] **45. Document admin features in README**
  - Add admin section to docs
  - Include setup instructions
  - Document API endpoints

- [ ] **46. Set up environment variables for production**
  - Document all required env vars
  - Set up in Vercel/Netlify
  - Verify Supabase production setup

- [ ] **47. Final testing and deployment preparation**
  - Full end-to-end testing
  - Performance optimization
  - Security review

---

## Summary
- **Total Tasks**: 47
- **Completed Tasks**: 9 (Phase 1 ✅ + Phase 2 ✅ + Phase 3 partial)
- **Remaining Tasks**: 38
- **Progress**: 19.1% complete
- **Estimated Time**: 4-5 days remaining with focused work
- **Priority**: Complete in order for best results

## Notes
- Each task is designed to be completed in 30-90 minutes
- Tasks build on each other, so order matters
- Test after each phase before moving to the next
- Commit code after each completed task for easy rollback
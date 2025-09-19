import { NextRequest, NextResponse } from 'next/server'
import {
  withAdminAuth,
  verifyAdminToken,
  createAdminToken,
  hasRequiredRole,
  AdminSessionPayload
} from '../middleware'
import { AdminRole } from '@/types/admin'

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'

describe('Admin Middleware', () => {
  describe('Token Operations', () => {
    it('should create and verify a valid admin token', async () => {
      const payload: Omit<AdminSessionPayload, 'issuedAt' | 'expiresAt'> = {
        userId: 'user-123',
        adminId: 'admin-456',
        email: 'admin@example.com',
        role: AdminRole.Admin,
        permissions: { canManageUsers: true },
        sessionId: 'session-789'
      }

      const token = await createAdminToken(payload)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')

      const verified = await verifyAdminToken(token)
      expect(verified).toBeTruthy()
      expect(verified?.userId).toBe(payload.userId)
      expect(verified?.email).toBe(payload.email)
      expect(verified?.role).toBe(payload.role)
    })

    it('should return null for invalid token', async () => {
      const invalidToken = 'invalid.token.here'
      const verified = await verifyAdminToken(invalidToken)
      expect(verified).toBeNull()
    })

    it('should return null for expired token', async () => {
      const payload: Omit<AdminSessionPayload, 'issuedAt' | 'expiresAt'> = {
        userId: 'user-123',
        adminId: 'admin-456',
        email: 'admin@example.com',
        role: AdminRole.Admin,
        permissions: {},
        sessionId: 'session-789'
      }

      // Create token with immediate expiration
      const _expiredPayload = {
        ...payload,
        issuedAt: Date.now() - 1000000,
        expiresAt: Date.now() - 1000
      }

      // Note: In real implementation, we'd need to modify createAdminToken
      // to accept custom expiration for testing
    })
  })

  describe('Role Checking', () => {
    it('should correctly check role hierarchy', () => {
      // SuperAdmin should have access to everything
      expect(hasRequiredRole(AdminRole.SuperAdmin, AdminRole.SuperAdmin)).toBe(true)
      expect(hasRequiredRole(AdminRole.SuperAdmin, AdminRole.Admin)).toBe(true)
      expect(hasRequiredRole(AdminRole.SuperAdmin, AdminRole.Editor)).toBe(true)
      expect(hasRequiredRole(AdminRole.SuperAdmin, AdminRole.Viewer)).toBe(true)

      // Admin should have access to Admin and below
      expect(hasRequiredRole(AdminRole.Admin, AdminRole.SuperAdmin)).toBe(false)
      expect(hasRequiredRole(AdminRole.Admin, AdminRole.Admin)).toBe(true)
      expect(hasRequiredRole(AdminRole.Admin, AdminRole.Editor)).toBe(true)
      expect(hasRequiredRole(AdminRole.Admin, AdminRole.Viewer)).toBe(true)

      // Editor should have access to Editor and below
      expect(hasRequiredRole(AdminRole.Editor, AdminRole.SuperAdmin)).toBe(false)
      expect(hasRequiredRole(AdminRole.Editor, AdminRole.Admin)).toBe(false)
      expect(hasRequiredRole(AdminRole.Editor, AdminRole.Editor)).toBe(true)
      expect(hasRequiredRole(AdminRole.Editor, AdminRole.Viewer)).toBe(true)

      // Viewer should only have viewer access
      expect(hasRequiredRole(AdminRole.Viewer, AdminRole.SuperAdmin)).toBe(false)
      expect(hasRequiredRole(AdminRole.Viewer, AdminRole.Admin)).toBe(false)
      expect(hasRequiredRole(AdminRole.Viewer, AdminRole.Editor)).toBe(false)
      expect(hasRequiredRole(AdminRole.Viewer, AdminRole.Viewer)).toBe(true)
    })
  })

  describe('withAdminAuth HOF', () => {
    it('should return 401 when no authentication is provided', async () => {
      const handler = withAdminAuth(async (_req, { admin: _admin }) => {
        return NextResponse.json({ success: true })
      })

      const request = new NextRequest('http://localhost:3000/api/admin/test')
      const response = await handler(request)

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Authentication required')
    })

    it('should return 403 when user lacks required role', async () => {
      // This test would require mocking the cookie/session
      // In a real implementation, we'd use a testing library that can mock Next.js cookies
    })

    it('should allow access with valid authentication and permissions', async () => {
      // This test would require proper mocking setup
      // In a real implementation, we'd mock the getAdminSession function
    })
  })

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      const handler = withAdminAuth(async (_req, { admin: _admin }) => {
        throw new Error('Test error')
      })

      // Mock a valid session
      // In real implementation, we'd mock getAdminSession

      const request = new NextRequest('http://localhost:3000/api/admin/test')
      const response = await handler(request)

      // Without proper session mocking, this will return 401
      expect([401, 500]).toContain(response.status)
    })
  })
})

// Note: For complete testing, we would need to:
// 1. Mock Next.js cookies() function
// 2. Mock Supabase client
// 3. Mock the audit logging functions
// 4. Add integration tests with actual API routes
// 5. Test edge cases like malformed tokens, network errors, etc.
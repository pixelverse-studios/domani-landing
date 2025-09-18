import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAdminAuth, useAdminUser, useAdminLogin, useAdminLogout } from '../index'
import { ReactNode } from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Admin Authentication Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('useAdminUser', () => {
    it('should return unauthenticated state when no user is logged in', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Not authenticated' }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminUser(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isUnauthenticated).toBe(true)
      expect(result.current.user).toBe(null)
    })

    it('should return authenticated state when user is logged in', async () => {
      const mockUser = {
        id: 'admin-123',
        user_id: 'user-456',
        role: 'admin',
        permissions: {},
        user: {
          email: 'admin@example.com',
          created_at: new Date().toISOString(),
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminUser(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAdmin).toBe(true)
    })

    it('should correctly check role hierarchy', async () => {
      const mockUser = {
        id: 'admin-123',
        user_id: 'user-456',
        role: 'editor',
        permissions: {},
        user: {
          email: 'editor@example.com',
          created_at: new Date().toISOString(),
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminUser(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.hasRole('viewer')).toBe(true)
      expect(result.current.hasRole('editor')).toBe(true)
      expect(result.current.hasRole('admin')).toBe(false)
      expect(result.current.hasRole('super_admin')).toBe(false)
    })

    it('should check permissions correctly', async () => {
      const mockUser = {
        id: 'admin-123',
        user_id: 'user-456',
        role: 'editor',
        permissions: {
          posts: ['create', 'read', 'update'],
        },
        user: {
          email: 'editor@example.com',
          created_at: new Date().toISOString(),
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminUser(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.hasPermission('posts', 'create')).toBe(true)
      expect(result.current.hasPermission('posts', 'read')).toBe(true)
      expect(result.current.hasPermission('posts', 'delete')).toBe(false)
      expect(result.current.hasPermission('users', 'create')).toBe(false)
    })
  })

  describe('useAdminLogin', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: 'admin-123',
          user_id: 'user-456',
          role: 'admin',
          permissions: {},
          user: {
            email: 'admin@example.com',
          },
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() + 900000, // 15 minutes
        },
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminLogin(), { wrapper })

      expect(result.current.isLoading).toBe(false)

      await act(async () => {
        await result.current.login({
          email: 'admin@example.com',
          password: 'password123',
        })
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/auth/login',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            email: 'admin@example.com',
            password: 'password123',
          }),
        })
      )

      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should handle login errors correctly', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Invalid credentials',
          remainingAttempts: 3,
        }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminLogin(), { wrapper })

      await expect(
        act(async () => {
          await result.current.login({
            email: 'wrong@example.com',
            password: 'wrongpassword',
          })
        })
      ).rejects.toThrow('Invalid credentials. 3 attempts remaining.')

      expect(result.current.isError).toBe(true)
      expect(result.current.error?.message).toContain('3 attempts remaining')
    })

    it('should handle rate limiting', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: 'Too many requests',
          retryAfter: 5,
        }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminLogin(), { wrapper })

      await expect(
        act(async () => {
          await result.current.login({
            email: 'test@example.com',
            password: 'password',
          })
        })
      ).rejects.toThrow('Too many login attempts')

      expect(result.current.isError).toBe(true)
    })
  })

  describe('useAdminLogout', () => {
    it('should successfully logout', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminLogout(), { wrapper })

      await act(async () => {
        await result.current.logout({ skipConfirmation: true })
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/auth/logout',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      )

      expect(result.current.isSuccess).toBe(true)
    })

    it('should handle logout errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminLogout(), { wrapper })

      await expect(
        act(async () => {
          await result.current.logout({ skipConfirmation: true })
        })
      ).rejects.toThrow('Server error')

      expect(result.current.isError).toBe(true)
    })
  })

  describe('useAdminAuth', () => {
    it('should combine all authentication functionality', async () => {
      const mockUser = {
        id: 'admin-123',
        user_id: 'user-456',
        role: 'admin',
        permissions: {},
        user: {
          email: 'admin@example.com',
        },
      }

      // Mock initial user fetch
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ user: mockUser }),
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useAdminAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Check combined state
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.can('posts', 'create')).toBe(true)
      expect(result.current.cannot('users', 'delete')).toBe(true)

      // Test login function
      expect(typeof result.current.login).toBe('function')
      expect(typeof result.current.logout).toBe('function')
      expect(typeof result.current.extendSession).toBe('function')
    })
  })
})
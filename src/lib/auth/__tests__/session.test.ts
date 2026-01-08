/**
 * Tests unitarios para session helpers
 *
 * FASE 6: Testing y Hardening
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { getCurrentUser, getCurrentSession, requireAuth } from "../session"
import { getAuth0Client } from "../auth0-client"

// Mock de auth0-client
vi.mock("../auth0-client", () => ({
  getAuth0Client: vi.fn(),
}))

describe("getCurrentUser", () => {
  const mockGetSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getAuth0Client).mockReturnValue({
      getSession: mockGetSession,
    } as any)
  })

  it("should return user when session exists", async () => {
    const mockUser = {
      sub: "auth0|123",
      name: "Test User",
      email: "test@example.com",
    }

    mockGetSession.mockResolvedValue({
      user: mockUser,
    })

    const user = await getCurrentUser()

    expect(user).toEqual(mockUser)
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it("should return null when session does not exist", async () => {
    mockGetSession.mockResolvedValue(null)

    const user = await getCurrentUser()

    expect(user).toBeNull()
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it("should return null when session has no user", async () => {
    mockGetSession.mockResolvedValue({})

    const user = await getCurrentUser()

    expect(user).toBeNull()
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it("should return null when getSession throws error", async () => {
    mockGetSession.mockRejectedValue(new Error("Session error"))

    const user = await getCurrentUser()

    expect(user).toBeNull()
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })
})

describe("requireAuth", () => {
  const mockGetSession = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getAuth0Client).mockReturnValue({
      getSession: mockGetSession,
    } as any)
  })

  it("should return user when authenticated", async () => {
    const mockUser = {
      sub: "auth0|123",
      name: "Test User",
      email: "test@example.com",
    }

    mockGetSession.mockResolvedValue({
      user: mockUser,
    })

    const user = await requireAuth()

    expect(user).toEqual(mockUser)
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it("should throw error when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null)

    await expect(requireAuth()).rejects.toThrow("Authentication required")
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it("should throw error when session has no user", async () => {
    mockGetSession.mockResolvedValue({})

    await expect(requireAuth()).rejects.toThrow("Authentication required")
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })
})

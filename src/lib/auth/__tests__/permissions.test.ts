/**
 * Tests unitarios para el sistema de permisos
 *
 * FASE 6: Testing y Hardening
 *
 * EJECUTAR:
 * npm install -D vitest @testing-library/react @testing-library/jest-dom
 * npm run test
 */

import { describe, it, expect } from "vitest"
import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isSuperAdmin,
  requirePermission,
  requireRole,
  ROLES,
  PERMISSIONS,
} from "../permissions"
import type { ExtendedUser } from "../session"

// ============================================================================
// Mock Users
// ============================================================================

const mockSuperAdmin: ExtendedUser = {
  sub: "auth0|123",
  name: "Super Admin",
  email: "super@test.com",
  "https://fascinante.com/roles": ["super_admin"],
  "https://fascinante.com/permissions": [],
}

const mockAdmin: ExtendedUser = {
  sub: "auth0|456",
  name: "Admin",
  email: "admin@test.com",
  "https://fascinante.com/roles": ["admin"],
  "https://fascinante.com/permissions": [
    "users:read",
    "users:write",
    "users:delete",
    "projects:read",
    "projects:write",
  ],
}

const mockEditor: ExtendedUser = {
  sub: "auth0|789",
  name: "Editor",
  email: "editor@test.com",
  "https://fascinante.com/roles": ["editor"],
  "https://fascinante.com/permissions": ["users:read", "users:write", "projects:read"],
}

const mockViewer: ExtendedUser = {
  sub: "auth0|101",
  name: "Viewer",
  email: "viewer@test.com",
  "https://fascinante.com/roles": ["viewer"],
  "https://fascinante.com/permissions": ["users:read", "projects:read"],
}

// ============================================================================
// Tests: hasRole
// ============================================================================

describe("hasRole", () => {
  it("should return true when user has the role", () => {
    expect(hasRole(mockAdmin, ROLES.ADMIN)).toBe(true)
    expect(hasRole(mockEditor, ROLES.EDITOR)).toBe(true)
    expect(hasRole(mockViewer, ROLES.VIEWER)).toBe(true)
  })

  it("should return false when user does not have the role", () => {
    expect(hasRole(mockAdmin, ROLES.SUPER_ADMIN)).toBe(false)
    expect(hasRole(mockEditor, ROLES.ADMIN)).toBe(false)
    expect(hasRole(mockViewer, ROLES.ADMIN)).toBe(false)
  })

  it("should return false when user is null", () => {
    expect(hasRole(null, ROLES.ADMIN)).toBe(false)
  })
})

// ============================================================================
// Tests: hasAnyRole
// ============================================================================

describe("hasAnyRole", () => {
  it("should return true when user has any of the roles", () => {
    expect(hasAnyRole(mockAdmin, [ROLES.ADMIN, ROLES.EDITOR])).toBe(true)
    expect(hasAnyRole(mockEditor, [ROLES.EDITOR, ROLES.VIEWER])).toBe(true)
  })

  it("should return false when user has none of the roles", () => {
    expect(hasAnyRole(mockViewer, [ROLES.ADMIN, ROLES.EDITOR])).toBe(false)
  })

  it("should return false when user is null", () => {
    expect(hasAnyRole(null, [ROLES.ADMIN])).toBe(false)
  })
})

// ============================================================================
// Tests: hasPermission
// ============================================================================

describe("hasPermission", () => {
  it("should return true when user has the permission", () => {
    expect(hasPermission(mockAdmin, PERMISSIONS.USERS_READ)).toBe(true)
    expect(hasPermission(mockAdmin, PERMISSIONS.USERS_WRITE)).toBe(true)
    expect(hasPermission(mockEditor, PERMISSIONS.USERS_READ)).toBe(true)
  })

  it("should return false when user does not have the permission", () => {
    expect(hasPermission(mockViewer, PERMISSIONS.USERS_WRITE)).toBe(false)
    expect(hasPermission(mockViewer, PERMISSIONS.USERS_DELETE)).toBe(false)
  })

  it("should return true for super_admin even without explicit permission", () => {
    // Super admins have all permissions
    expect(hasPermission(mockSuperAdmin, PERMISSIONS.USERS_DELETE)).toBe(true)
    expect(hasPermission(mockSuperAdmin, PERMISSIONS.BILLING_WRITE)).toBe(true)
  })

  it("should return false when user is null", () => {
    expect(hasPermission(null, PERMISSIONS.USERS_READ)).toBe(false)
  })
})

// ============================================================================
// Tests: hasAnyPermission
// ============================================================================

describe("hasAnyPermission", () => {
  it("should return true when user has any of the permissions", () => {
    expect(
      hasAnyPermission(mockEditor, [PERMISSIONS.USERS_WRITE, PERMISSIONS.USERS_DELETE])
    ).toBe(true)
  })

  it("should return false when user has none of the permissions", () => {
    expect(
      hasAnyPermission(mockViewer, [PERMISSIONS.USERS_WRITE, PERMISSIONS.USERS_DELETE])
    ).toBe(false)
  })

  it("should return true for super_admin", () => {
    expect(
      hasAnyPermission(mockSuperAdmin, [PERMISSIONS.USERS_DELETE, PERMISSIONS.BILLING_WRITE])
    ).toBe(true)
  })
})

// ============================================================================
// Tests: hasAllPermissions
// ============================================================================

describe("hasAllPermissions", () => {
  it("should return true when user has all permissions", () => {
    expect(
      hasAllPermissions(mockAdmin, [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE])
    ).toBe(true)
  })

  it("should return false when user is missing any permission", () => {
    expect(
      hasAllPermissions(mockEditor, [
        PERMISSIONS.USERS_READ,
        PERMISSIONS.USERS_WRITE,
        PERMISSIONS.USERS_DELETE,
      ])
    ).toBe(false)
  })

  it("should return true for super_admin", () => {
    expect(
      hasAllPermissions(mockSuperAdmin, [
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.BILLING_WRITE,
        PERMISSIONS.ORGS_DELETE,
      ])
    ).toBe(true)
  })
})

// ============================================================================
// Tests: isAdmin / isSuperAdmin
// ============================================================================

describe("isAdmin", () => {
  it("should return true for admin and super_admin", () => {
    expect(isAdmin(mockAdmin)).toBe(true)
    expect(isAdmin(mockSuperAdmin)).toBe(true)
  })

  it("should return false for non-admin users", () => {
    expect(isAdmin(mockEditor)).toBe(false)
    expect(isAdmin(mockViewer)).toBe(false)
  })
})

describe("isSuperAdmin", () => {
  it("should return true only for super_admin", () => {
    expect(isSuperAdmin(mockSuperAdmin)).toBe(true)
  })

  it("should return false for non-super-admin users", () => {
    expect(isSuperAdmin(mockAdmin)).toBe(false)
    expect(isSuperAdmin(mockEditor)).toBe(false)
    expect(isSuperAdmin(mockViewer)).toBe(false)
  })
})

// ============================================================================
// Tests: requirePermission / requireRole
// ============================================================================

describe("requirePermission", () => {
  it("should not throw when user has permission", () => {
    expect(() => requirePermission(mockAdmin, PERMISSIONS.USERS_READ)).not.toThrow()
  })

  it("should throw when user does not have permission", () => {
    expect(() => requirePermission(mockViewer, PERMISSIONS.USERS_DELETE)).toThrow(
      "Missing required permission: users:delete"
    )
  })

  it("should not throw for super_admin", () => {
    expect(() => requirePermission(mockSuperAdmin, PERMISSIONS.BILLING_WRITE)).not.toThrow()
  })
})

describe("requireRole", () => {
  it("should not throw when user has role", () => {
    expect(() => requireRole(mockAdmin, ROLES.ADMIN)).not.toThrow()
  })

  it("should throw when user does not have role", () => {
    expect(() => requireRole(mockViewer, ROLES.ADMIN)).toThrow(
      "Missing required role: admin"
    )
  })
})

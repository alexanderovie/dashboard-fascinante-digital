import type { ExtendedUser } from "./session"

/**
 * Sistema de RBAC (Role-Based Access Control)
 *
 * FASE 2: Autorización y permisos
 *
 * ARQUITECTURA:
 * - Roles: Conjuntos predefinidos de permisos (admin, editor, viewer)
 * - Permisos: Acciones granulares (users:read, users:write, users:delete)
 * - Claims: Vienen en el JWT de Auth0
 */

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

/**
 * Roles disponibles en la aplicación
 */
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  MEMBER: "member",
  VIEWER: "viewer",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/**
 * Permisos granulares
 *
 * Formato: `resource:action`
 * Ejemplos: users:read, users:write, users:delete
 */
export const PERMISSIONS = {
  // Users
  USERS_READ: "users:read",
  USERS_WRITE: "users:write",
  USERS_DELETE: "users:delete",

  // Projects
  PROJECTS_READ: "projects:read",
  PROJECTS_WRITE: "projects:write",
  PROJECTS_DELETE: "projects:delete",

  // Settings
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",

  // Organizations
  ORGS_READ: "organizations:read",
  ORGS_WRITE: "organizations:write",
  ORGS_DELETE: "organizations:delete",
  ORGS_INVITE: "organizations:invite",

  // Billing
  BILLING_READ: "billing:read",
  BILLING_WRITE: "billing:write",

  // Developers
  API_KEYS_READ: "api_keys:read",
  API_KEYS_WRITE: "api_keys:write",
  WEBHOOKS_READ: "webhooks:read",
  WEBHOOKS_WRITE: "webhooks:write",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Mapeo de roles a permisos por defecto
 *
 * NOTA: Los permisos reales vienen de Auth0 (source of truth)
 * Este mapeo es solo para referencia/documentación
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_WRITE,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_WRITE,
    PERMISSIONS.ORGS_READ,
    PERMISSIONS.ORGS_INVITE,
    PERMISSIONS.BILLING_READ,
    PERMISSIONS.API_KEYS_READ,
    PERMISSIONS.WEBHOOKS_READ,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_WRITE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.ORGS_READ,
  ],

  [ROLES.MEMBER]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_WRITE,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.ORGS_READ,
  ],

  [ROLES.VIEWER]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.ORGS_READ,
  ],
}

// ============================================================================
// HELPERS DE VALIDACIÓN
// ============================================================================

/**
 * Extrae roles del usuario desde los claims de Auth0
 */
export function getUserRoles(user: ExtendedUser | null): Role[] {
  if (!user) return []
  const roles = user["https://fascinante.com/roles"] ?? []
  return roles as Role[]
}

/**
 * Extrae permisos del usuario desde los claims de Auth0
 */
export function getUserPermissions(user: ExtendedUser | null): Permission[] {
  if (!user) return []
  const permissions = user["https://fascinante.com/permissions"] ?? []
  return permissions as Permission[]
}

/**
 * Verifica si el usuario tiene un rol específico
 *
 * @param user Usuario actual
 * @param role Rol a verificar
 * @returns true si el usuario tiene el rol
 */
export function hasRole(user: ExtendedUser | null, role: Role): boolean {
  const roles = getUserRoles(user)
  return roles.includes(role)
}

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 *
 * @param user Usuario actual
 * @param roles Array de roles a verificar (OR logic)
 * @returns true si el usuario tiene al menos uno de los roles
 */
export function hasAnyRole(user: ExtendedUser | null, roles: Role[]): boolean {
  const userRoles = getUserRoles(user)
  return roles.some((role) => userRoles.includes(role))
}

/**
 * Verifica si el usuario tiene todos los roles especificados
 *
 * @param user Usuario actual
 * @param roles Array de roles a verificar (AND logic)
 * @returns true si el usuario tiene todos los roles
 */
export function hasAllRoles(user: ExtendedUser | null, roles: Role[]): boolean {
  const userRoles = getUserRoles(user)
  return roles.every((role) => userRoles.includes(role))
}

/**
 * Verifica si el usuario tiene un permiso específico
 *
 * @param user Usuario actual
 * @param permission Permiso a verificar
 * @returns true si el usuario tiene el permiso
 */
export function hasPermission(
  user: ExtendedUser | null,
  permission: Permission
): boolean {
  // Super admins tienen todos los permisos
  if (hasRole(user, ROLES.SUPER_ADMIN)) {
    return true
  }

  const permissions = getUserPermissions(user)
  return permissions.includes(permission)
}

/**
 * Verifica si el usuario tiene alguno de los permisos especificados
 *
 * @param user Usuario actual
 * @param permissions Array de permisos a verificar (OR logic)
 * @returns true si el usuario tiene al menos uno de los permisos
 */
export function hasAnyPermission(
  user: ExtendedUser | null,
  permissions: Permission[]
): boolean {
  // Super admins tienen todos los permisos
  if (hasRole(user, ROLES.SUPER_ADMIN)) {
    return true
  }

  const userPermissions = getUserPermissions(user)
  return permissions.some((permission) => userPermissions.includes(permission))
}

/**
 * Verifica si el usuario tiene todos los permisos especificados
 *
 * @param user Usuario actual
 * @param permissions Array de permisos a verificar (AND logic)
 * @returns true si el usuario tiene todos los permisos
 */
export function hasAllPermissions(
  user: ExtendedUser | null,
  permissions: Permission[]
): boolean {
  // Super admins tienen todos los permisos
  if (hasRole(user, ROLES.SUPER_ADMIN)) {
    return true
  }

  const userPermissions = getUserPermissions(user)
  return permissions.every((permission) => userPermissions.includes(permission))
}

/**
 * Verifica si el usuario es administrador (admin o super_admin)
 */
export function isAdmin(user: ExtendedUser | null): boolean {
  return hasAnyRole(user, [ROLES.ADMIN, ROLES.SUPER_ADMIN])
}

/**
 * Verifica si el usuario es super admin
 */
export function isSuperAdmin(user: ExtendedUser | null): boolean {
  return hasRole(user, ROLES.SUPER_ADMIN)
}

/**
 * Lanza error si el usuario no tiene el permiso requerido
 *
 * @param user Usuario actual
 * @param permission Permiso requerido
 * @throws Error si no tiene el permiso
 */
export function requirePermission(
  user: ExtendedUser | null,
  permission: Permission
): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Missing required permission: ${permission}`)
  }
}

/**
 * Lanza error si el usuario no tiene el rol requerido
 *
 * @param user Usuario actual
 * @param role Rol requerido
 * @throws Error si no tiene el rol
 */
export function requireRole(user: ExtendedUser | null, role: Role): void {
  if (!hasRole(user, role)) {
    throw new Error(`Missing required role: ${role}`)
  }
}

/**
 * Lanza error si el usuario no es administrador
 *
 * @param user Usuario actual
 * @throws Error si no es admin
 */
export function requireAdmin(user: ExtendedUser | null): void {
  if (!isAdmin(user)) {
    throw new Error("Administrator access required")
  }
}

/**
 * Componente para proteger secciones de UI por permisos
 *
 * FASE 2: RBAC y Autorización
 *
 * USO:
 *
 * ```tsx
 * // Ocultar botón si no tiene permiso
 * <PermissionGuard permission="users:delete" fallback={null}>
 *   <Button onClick={deleteUser}>Delete</Button>
 * </PermissionGuard>
 *
 * // Mostrar mensaje si no tiene permiso
 * <PermissionGuard permission="users:write" fallback={<p>No access</p>}>
 *   <UserForm />
 * </PermissionGuard>
 *
 * // Validar múltiples permisos (OR)
 * <PermissionGuard permissions={["users:write", "users:delete"]} requireAll={false}>
 *   <UserActions />
 * </PermissionGuard>
 *
 * // Validar múltiples permisos (AND)
 * <PermissionGuard permissions={["users:write", "users:delete"]} requireAll={true}>
 *   <DangerZone />
 * </PermissionGuard>
 *
 * // Validar por rol
 * <RoleGuard role="admin">
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */

"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import type { ExtendedUser } from "@/lib/auth/session"
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  type Permission,
  type Role,
} from "@/lib/auth/permissions"

// ============================================================================
// PermissionGuard - Protección por permisos
// ============================================================================

interface PermissionGuardProps {
  children: React.ReactNode
  /** Permiso único requerido */
  permission?: Permission
  /** Array de permisos (para validar múltiples) */
  permissions?: Permission[]
  /** Si true, requiere TODOS los permisos. Si false, requiere AL MENOS UNO */
  requireAll?: boolean
  /** Elemento a mostrar si no tiene permisos */
  fallback?: React.ReactNode
  /** Callback cuando no tiene permisos */
  onUnauthorized?: () => void
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  onUnauthorized,
}: PermissionGuardProps) {
  const { user, isLoading } = useUser()

  // Mientras carga, no mostrar nada (evitar flicker)
  if (isLoading) {
    return null
  }

  const extendedUser = user as ExtendedUser | undefined

  let hasAccess = false

  if (permission) {
    // Validar permiso único
    hasAccess = hasPermission(extendedUser ?? null, permission)
  } else if (permissions && permissions.length > 0) {
    // Validar múltiples permisos
    if (requireAll) {
      hasAccess = hasAllPermissions(extendedUser ?? null, permissions)
    } else {
      hasAccess = hasAnyPermission(extendedUser ?? null, permissions)
    }
  } else {
    // Sin permisos especificados, permitir por defecto
    hasAccess = true
  }

  if (!hasAccess) {
    onUnauthorized?.()
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// RoleGuard - Protección por roles
// ============================================================================

interface RoleGuardProps {
  children: React.ReactNode
  /** Rol único requerido */
  role?: Role
  /** Array de roles (para validar múltiples) */
  roles?: Role[]
  /** Si true, requiere TODOS los roles. Si false, requiere AL MENOS UNO */
  requireAll?: boolean
  /** Elemento a mostrar si no tiene roles */
  fallback?: React.ReactNode
  /** Callback cuando no tiene roles */
  onUnauthorized?: () => void
}

export function RoleGuard({
  children,
  role,
  roles,
  requireAll = false,
  fallback = null,
  onUnauthorized,
}: RoleGuardProps) {
  const { user, isLoading } = useUser()

  // Mientras carga, no mostrar nada
  if (isLoading) {
    return null
  }

  const extendedUser = user as ExtendedUser | undefined

  let hasAccess = false

  if (role) {
    // Validar rol único
    hasAccess = hasRole(extendedUser ?? null, role)
  } else if (roles && roles.length > 0) {
    // Validar múltiples roles
    if (requireAll) {
      hasAccess = roles.every((r) => hasRole(extendedUser ?? null, r))
    } else {
      hasAccess = roles.some((r) => hasRole(extendedUser ?? null, r))
    }
  } else {
    // Sin roles especificados, permitir por defecto
    hasAccess = true
  }

  if (!hasAccess) {
    onUnauthorized?.()
    return <>{fallback}</>
  }

  return <>{children}</>
}

// ============================================================================
// Hooks helpers
// ============================================================================

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
  const { user } = useUser()
  const extendedUser = user as ExtendedUser | undefined

  return {
    hasPermission: (permission: Permission) =>
      hasPermission(extendedUser ?? null, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(extendedUser ?? null, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(extendedUser ?? null, permissions),
  }
}

/**
 * Hook para verificar roles del usuario actual
 */
export function useRoles() {
  const { user } = useUser()
  const extendedUser = user as ExtendedUser | undefined

  return {
    hasRole: (role: Role) => hasRole(extendedUser ?? null, role),
    isAdmin: () => hasRole(extendedUser ?? null, "admin") || hasRole(extendedUser ?? null, "super_admin"),
    isSuperAdmin: () => hasRole(extendedUser ?? null, "super_admin"),
  }
}

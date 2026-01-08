import { getAuth0Client } from "./auth0-client"

/**
 * Extended User type con claims custom de Auth0
 */
export interface ExtendedUser {
  sub: string
  name: string
  email: string
  picture?: string
  email_verified?: boolean
  // Custom claims (namespaced)
  "https://fascinante.com/org_id"?: string
  "https://fascinante.com/org_name"?: string
  "https://fascinante.com/roles"?: string[]
  "https://fascinante.com/permissions"?: string[]
  "https://fascinante.com/metadata"?: Record<string, unknown>
}

export interface ExtendedSession {
  user: ExtendedUser
  accessToken?: string
  refreshToken?: string
  idToken?: string
}

/**
 * Obtiene el usuario actual de la sesión de Auth0
 *
 * USO:
 * - Server Components: `const user = await getCurrentUser()`
 * - Client Components: Usar `useUser()` hook
 *
 * SEGURIDAD:
 * - Solo funciona en Server Components/Actions
 * - Valida automáticamente la sesión
 * - Retorna null si no autenticado (en lugar de throw)
 *
 * @returns Usuario actual o null si no autenticado
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  try {
    const auth0 = getAuth0Client()
    const session = await auth0.getSession()
    if (!session?.user) {
      return null
    }
    return session.user as ExtendedUser
  } catch (error) {
    console.error("[Auth] Error getting current user:", error)
    return null
  }
}

/**
 * Obtiene la sesión completa (usuario + access token)
 *
 * @returns Sesión completa o null
 */
export async function getCurrentSession(): Promise<ExtendedSession | null> {
  try {
    const auth0 = getAuth0Client()
    const session = await auth0.getSession()
    if (!session?.user) {
      return null
    }
    return session as ExtendedSession
  } catch (error) {
    console.error("[Auth] Error getting session:", error)
    return null
  }
}

/**
 * Obtiene el organization ID del usuario actual
 *
 * @returns Organization ID o null
 */
export async function getCurrentOrgId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.["https://fascinante.com/org_id"] ?? null
}

/**
 * Obtiene los roles del usuario actual
 *
 * @returns Array de roles o array vacío
 */
export async function getCurrentUserRoles(): Promise<string[]> {
  const user = await getCurrentUser()
  return user?.["https://fascinante.com/roles"] ?? []
}

/**
 * Obtiene los permisos del usuario actual
 *
 * @returns Array de permisos o array vacío
 */
export async function getCurrentUserPermissions(): Promise<string[]> {
  const user = await getCurrentUser()
  return user?.["https://fascinante.com/permissions"] ?? []
}

/**
 * Valida que el usuario esté autenticado
 * Lanza error si no lo está
 *
 * @throws Error si no autenticado
 */
export async function requireAuth(): Promise<ExtendedUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Valida que el usuario pertenezca a una organización específica
 *
 * @param orgId Organization ID a validar
 * @throws Error si no pertenece
 */
export async function requireOrgMembership(orgId: string): Promise<void> {
  const user = await requireAuth()
  const userOrgId = user["https://fascinante.com/org_id"]

  if (userOrgId !== orgId) {
    throw new Error(`User does not belong to organization ${orgId}`)
  }
}

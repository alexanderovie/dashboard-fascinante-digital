import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"

// Forzar renderizado dinámico (necesario porque usamos cookies)
export const dynamic = "force-dynamic"

interface LoginPageProps {
  searchParams?: Promise<{ returnTo?: string }>
}

/**
 * Página de login que redirige automáticamente a Auth0 Universal Login.
 *
 * ✅ PATRÓN RECOMENDADO (Enterprise):
 * - No muestra UI propia
 * - Redirige inmediatamente a Auth0
 * - Auth0 maneja todo (email/password, MFA, reset, etc.)
 *
 * Flujo:
 * 1. Usuario visita /login
 * 2. Si ya está autenticado → redirect al dashboard
 * 3. Si no está autenticado → redirect a /api/auth/login (Auth0)
 * 4. Auth0 Universal Login aparece (sin mostrar nuestra UI)
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // ✅ Si el usuario ya está autenticado, redirigir al dashboard o ruta original
  const user = await getCurrentUser()
  const params = await searchParams
  const returnTo = params?.returnTo || "/"

  if (user) {
    // Usuario ya autenticado, redirigir al dashboard o ruta original
    redirect(returnTo)
  }

  // ✅ Redirigir automáticamente a Auth0 Universal Login
  // El endpoint /api/auth/login manejará:
  // - Construcción de URL de Auth0
  // - PKCE, state, etc.
  // - Redirect a Universal Login
  //
  // Respeta returnTo si existe (se pasa como query param)
  const loginPath = returnTo !== "/"
    ? `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`
    : "/api/auth/login"

  // Redirect automático (sin mostrar UI)
  redirect(loginPath)
}

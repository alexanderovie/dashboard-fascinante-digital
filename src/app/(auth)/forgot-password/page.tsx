import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"

// Forzar renderizado dinámico (necesario porque usamos cookies)
export const dynamic = "force-dynamic"

interface ForgotPasswordPageProps {
  searchParams?: Promise<{ returnTo?: string }>
}

/**
 * Página de recuperación que redirige a Auth0 Universal Login.
 */
export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const user = await getCurrentUser()
  const params = await searchParams
  const returnTo = params?.returnTo || "/"

  if (user) {
    redirect(returnTo)
  }

  const loginPath =
    returnTo !== "/"
      ? `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}&screen_hint=reset-password`
      : "/api/auth/login?screen_hint=reset-password"

  redirect(loginPath)
}

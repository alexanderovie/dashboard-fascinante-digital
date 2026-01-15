import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"

// Forzar renderizado dinámico (necesario porque usamos cookies)
export const dynamic = "force-dynamic"

interface RegisterPageProps {
  searchParams?: Promise<{ returnTo?: string }>
}

/**
 * Página de registro que redirige a Auth0 Universal Login (signup).
 */
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getCurrentUser()
  const params = await searchParams
  const returnTo = params?.returnTo || "/"

  if (user) {
    redirect(returnTo)
  }

  const loginPath =
    returnTo !== "/"
      ? `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}&screen_hint=signup`
      : "/api/auth/login?screen_hint=signup"

  redirect(loginPath)
}

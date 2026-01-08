import { NextRequest, NextResponse } from "next/server"

/**
 * Next.js 16 Proxy para protección de rutas
 *
 * CAMBIOS EN NEXT.JS 16:
 * - Archivo: middleware.ts → proxy.ts
 * - Export: export async function → export default async function
 * - Función: middleware() → proxy()
 *
 * SEGURIDAD:
 * - Valida cookie de sesión ANTES de renderizar (previene metadata leak)
 * - Redirect a /login si no autenticado
 * - Rutas públicas permitidas sin auth
 *
 * NOTA: Auth0 SDK no exporta getSession para Edge Runtime en v4.14.0
 * Validamos la cookie de sesión (appSession) de forma optimista
 * La validación real del JWT se hace en Server Components/Actions
 *
 * FASE 1: Implementación P0-1
 */

// Rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = [
  "/api/auth",
  "/login",
  "/register",
  "/forgot-password",
  "/401",
  "/403",
  "/404",
  "/503",
  "/error",
  "/_next",
  "/favicon.ico",
  "/health",
]

/**
 * Verifica si la ruta es pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * Proxy principal de autenticación (Next.js 16)
 *
 * Realiza validación OPTIMISTA de la sesión mediante cookie.
 * La validación SEGURA del JWT se hace en Server Components.
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Permitir rutas públicas sin validación
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  try {
    // Validación optimista: verificar que existe cookie de sesión
    // Auth0 SDK guarda la sesión en cookie 'appSession'
    const sessionCookie = req.cookies.get('appSession')

    // Si no hay cookie de sesión, redirect a login
    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("returnTo", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // TODO FASE 3: Validar organization membership
    // const orgId = req.cookies.get('current_org_id')?.value
    // Validación adicional se hará en Server Components con getSession()

    // Agregar headers de seguridad (2026 best practices)
    const response = NextResponse.next()

    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    )

    // HSTS solo en producción
    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      )
    }

    return response
  } catch (error) {
    console.error("[Proxy] Auth error:", error)

    // En caso de error, redirect a login por seguridad
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("returnTo", pathname)
    loginUrl.searchParams.set("error", "auth_error")
    return NextResponse.redirect(loginUrl)
  }
}

/**
 * Configuración de matcher
 *
 * IMPORTANTE: Excluir archivos estáticos para performance
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml (metadata)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg, *.ico (images)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|ico)).*)",
  ],
}

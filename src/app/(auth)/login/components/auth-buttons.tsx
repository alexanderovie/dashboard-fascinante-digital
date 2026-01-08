"use client"

import { useState } from "react"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AuthButtonsProps {
  returnTo?: string
  className?: string
}

/**
 * Construye la URL de login de Auth0 con los parámetros necesarios
 */
const buildAuthUrl = (connection?: string, returnTo?: string) => {
  if (typeof window === "undefined") {
    return "/api/auth/login"
  }

  const loginUrl = new URL("/api/auth/login", window.location.origin)

  // Usar returnTo del prop o del query param
  const targetUrl = returnTo || new URLSearchParams(window.location.search).get("returnTo") || "/"
  loginUrl.searchParams.set("returnTo", targetUrl)

  // Si hay una conexión específica (social login), agregarla
  if (connection) {
    loginUrl.searchParams.set("connection", connection)
  }

  return loginUrl.toString()
}

/**
 * Componente de botones de autenticación.
 * Redirige directamente a Auth0 Universal Login.
 * NO pide email/password aquí - Auth0 lo maneja todo.
 */
export function AuthButtons({ returnTo, className }: AuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleLogin = (connection?: string) => {
    const connectionType = connection || "universal"
    setIsLoading(connectionType)
    window.location.assign(buildAuthUrl(connection, returnTo))
  }

  return (
    <div className={cn("grid gap-4", className)}>
      {/* Botón principal: Iniciar sesión con Auth0 Universal Login */}
      <Button
        className="w-full"
        size="lg"
        disabled={!!isLoading}
        onClick={() => handleLogin()}
      >
        {isLoading === "universal" ? (
          <>
            <span className="mr-2">⏳</span>
            Redirigiendo...
          </>
        ) : (
          <>
            Iniciar sesión
          </>
        )}
      </Button>

      {/* Separador */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            O continuar con
          </span>
        </div>
      </div>

      {/* Botones sociales */}
      <div className="grid grid-cols-2 gap-3">
        {/* GitHub */}
        <Button
          variant="outline"
          className="w-full"
          disabled={!!isLoading}
          onClick={() => handleLogin("github")}
        >
          {isLoading === "github" ? (
            <span>⏳</span>
          ) : (
            <>
              <IconBrandGithub className="mr-2 h-4 w-4" />
              GitHub
            </>
          )}
        </Button>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full"
          disabled={!!isLoading}
          onClick={() => handleLogin("google-oauth2")}
        >
          {isLoading === "google-oauth2" ? (
            <span>⏳</span>
          ) : (
            <>
              <IconBrandGoogle className="mr-2 h-4 w-4" />
              Google
            </>
          )}
        </Button>
      </div>

      {/* Nota informativa */}
      <p className="text-muted-foreground mt-4 text-center text-xs">
        Serás redirigido a Auth0 para completar el inicio de sesión
      </p>
    </div>
  )
}

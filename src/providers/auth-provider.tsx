"use client"

import type { ReactNode } from "react"
import { Auth0Provider } from "@auth0/nextjs-auth0/client"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <Auth0Provider>{children}</Auth0Provider>
}

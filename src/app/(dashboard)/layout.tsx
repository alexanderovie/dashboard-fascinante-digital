import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { getCurrentUser } from "@/lib/auth/session"

interface Props {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies()
  const defaultClose = cookieStore.get("sidebar:state")?.value === "false"

  // ✅ FASE 1: Obtener usuario real de Auth0
  const user = await getCurrentUser()

  if (!user) {
    // Si no hay usuario, redirect a login
    // (aunque proxy.ts ya debería haber redirigido, esto es una doble validación)
    redirect("/login")
  }

  // Preparar datos del usuario para el sidebar
  const sidebarUser = {
    name: user.name || user.email?.split("@")[0] || "Usuario",
    email: user.email || "",
    avatar: user.picture || `/avatars/${user.email?.split("@")[0] || "user"}-avatar.png` || "/avatars/default-avatar.png",
  }

  // TODO FASE 1: Validar organization membership
  // TODO FASE 2: Llamar a /v1/me cuando el backend esté disponible:
  // try {
  //   await authenticatedFetch("/v1/me", {
  //     organizationId: process.env.DEFAULT_ORGANIZATION_ID,
  //   })
  // } catch (error) {
  //   if (error instanceof ApiClientError) {
  //     if (error.status === 401) {
  //       redirect("/login")
  //     }
  //     if (error.status === 403) {
  //       redirect("/403")
  //     }
  //   }
  //   throw error
  // }

  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={!defaultClose}>
        <AppSidebar user={sidebarUser} />
        <div
          id="content"
          className={cn(
            "flex h-full w-full flex-col",
            "has-[div[data-layout=fixed]]:h-svh",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[data-layout=fixed]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}

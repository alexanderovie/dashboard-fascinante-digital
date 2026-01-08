import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ApiClientError, authenticatedFetch } from "@/lib/api-client"

interface Props {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: Props) {
  const cookieStore = await cookies()
  const defaultClose = cookieStore.get("sidebar:state")?.value === "false"

  try {
    await authenticatedFetch("/v1/me", {
      organizationId: process.env.DEFAULT_ORGANIZATION_ID,
    })
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (error.status === 401) {
        redirect("/login")
      }
      if (error.status === 403) {
        redirect("/403")
      }
    }
    throw error
  }

  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={!defaultClose}>
        <AppSidebar />
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

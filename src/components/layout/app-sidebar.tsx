"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { sidebarData } from "./data/sidebar-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Usar usuario real si está disponible, sino usar datos hardcodeados como fallback
  const displayUser = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar || sidebarData.user.avatar
      }
    : sidebarData.user

  return (
    <div className="relative">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={displayUser} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}

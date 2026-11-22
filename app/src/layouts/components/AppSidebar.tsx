import { Link, useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { MENUS, isPathActive } from '@/config/menu'

export const AppSidebar = () => {
  const { pathname } = useLocation()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <p className="text-lg font-semibold tracking-tight">Haupcar</p>
          <p className="text-xs text-sidebar-foreground/60">Back Office</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {MENUS.map(({ label, path, icon: Icon }) => (
              <SidebarMenuItem key={path}>
                <SidebarMenuButton
                  asChild
                  isActive={isPathActive(pathname, path)}
                  tooltip={label}
                  className="min-h-9"
                >
                  <Link to={path}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

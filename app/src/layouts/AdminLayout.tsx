import type { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from './components/AppHeader'
import { AppSidebar } from './components/AppSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <main className="flex-1 space-y-5 p-4 md:p-6">{children}</main>
    </SidebarInset>
  </SidebarProvider>
)

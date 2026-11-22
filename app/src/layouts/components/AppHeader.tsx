import { SidebarTrigger } from '@/components/ui/sidebar'

export const AppHeader = () => (
  <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
    <SidebarTrigger />
  </header>
)

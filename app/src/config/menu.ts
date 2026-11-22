import { CarIcon, TagIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  label: string
  path: '/cars' | '/brands'
  icon: LucideIcon
}

export const MENUS: MenuItem[] = [
  { label: 'Cars', path: '/cars', icon: CarIcon },
  { label: 'Brands', path: '/brands', icon: TagIcon },
]

export const isPathActive = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`)

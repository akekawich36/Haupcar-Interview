import { createFileRoute } from '@tanstack/react-router'
import { BrandsPage } from '@/pages/brands'

export const Route = createFileRoute('/_auth/brands/')({ component: BrandsPage })

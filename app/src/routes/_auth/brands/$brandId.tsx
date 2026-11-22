import { createFileRoute } from '@tanstack/react-router'
import BrandDetail from '@/pages/brands/[id]'

export const Route = createFileRoute('/_auth/brands/$brandId')({
  component: BrandDetail,
})

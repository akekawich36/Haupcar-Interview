import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/layouts/AdminLayout'

export const Route = createFileRoute('/_auth')({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
})

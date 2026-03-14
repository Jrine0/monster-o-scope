import { AdminDashboard } from '@/features/app/admin/AdminDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminDashboard />
}

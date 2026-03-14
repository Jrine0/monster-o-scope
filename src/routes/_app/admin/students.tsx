import { StudentManagement } from '@/features/app/admin/StudentManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/students')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StudentManagement />
}

import { TeacherManagement } from '@/features/app/admin/TeacherManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/teachers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TeacherManagement />
}

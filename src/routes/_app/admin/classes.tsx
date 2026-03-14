import { ClassManagement } from '@/features/app/admin/ClassManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/classes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ClassManagement />
}

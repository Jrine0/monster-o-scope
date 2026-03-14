import { TeacherDashboard } from '@/features/app/teacher/TeacherDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/teacher/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TeacherDashboard />
}

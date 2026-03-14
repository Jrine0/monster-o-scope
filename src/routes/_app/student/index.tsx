import { StudentDashboard } from '@/features/app/student/StudentDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/student/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StudentDashboard />
}

import { AiTutor } from '@/features/app/student/AiTutor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/student/tutor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AiTutor />
}

import { GenerateContent } from '@/features/app/teacher/GenerateContent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/teacher/generate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GenerateContent />
}

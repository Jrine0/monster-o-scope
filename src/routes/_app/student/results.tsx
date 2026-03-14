import { MyResults } from '@/features/app/student/MyResults'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/student/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyResults />
}

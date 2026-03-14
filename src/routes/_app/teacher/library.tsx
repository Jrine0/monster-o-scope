import { ContentLibrary } from '@/features/app/teacher/ContentLibrary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/teacher/library')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContentLibrary />
}

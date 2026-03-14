import { StudyMaterials } from '@/features/app/student/StudyMaterials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/student/materials')({
  component: RouteComponent,
})

function RouteComponent() {
  return <StudyMaterials />
}

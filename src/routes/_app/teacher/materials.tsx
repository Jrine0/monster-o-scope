import { MyMaterials } from '@/features/app/teacher/MyMaterials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/teacher/materials')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyMaterials />
}

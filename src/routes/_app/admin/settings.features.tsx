import { FeatureTogglesPage } from '@/features/app/admin/FeaturesToggle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/settings/features')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FeatureTogglesPage />
}

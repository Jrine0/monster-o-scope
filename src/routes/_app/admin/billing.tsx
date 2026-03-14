import { BillingPage } from '@/features/app/admin/Billing'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/billing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BillingPage />
}

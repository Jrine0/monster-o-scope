import { RequestOTPPage } from '@/features/auth/RequestOtp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/request')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RequestOTPPage />
}

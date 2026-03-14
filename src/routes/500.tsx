import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/500')({
  component: ServerErrorPage,
})

function ServerErrorPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">500</h1>
      <p className="text-lg text-gray-600">Internal Server Error</p>
    </div>
  )
}

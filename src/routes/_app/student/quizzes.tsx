import { QuizList } from '@/features/app/student/QuizList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/student/quizzes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <QuizList />
}

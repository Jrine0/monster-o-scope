import { createFileRoute } from "@tanstack/react-router";
import AiTutor from "../../../features/app/student/AiTutor";

export const Route = createFileRoute("/_app/student/tutor")({
  component: TutorPage,
});

function TutorPage() {
  // Route search params — optional topic context and lesson ID
  // Usage: /student/tutor?lessonId=les_123&topic=Linear+Algebra
  const search = Route.useSearch() as { lessonId?: string; topic?: string };

  return (
    <div className="w-full h-full" style={{ height: "calc(100dvh - 56px)" }}>
      <AiTutor lessonId={search.lessonId} topicContext={search.topic} />
    </div>
  );
}

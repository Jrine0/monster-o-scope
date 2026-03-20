// src/routes/_app/student/profile.tsx
// Student profile page - accessible from sidebar dropdown

import { createFileRoute } from "@tanstack/react-router";
import { StudentProfile } from "@/features/app/student/StudentProfile";

export const Route = createFileRoute("/_app/student/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return <StudentProfile />;
}

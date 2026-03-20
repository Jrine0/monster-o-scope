// src/routes/_app/student/settings.tsx
// Student settings page - accessible from sidebar dropdown

import { createFileRoute } from "@tanstack/react-router";
import { StudentSettings } from "@/features/app/student/StudentSettings";

export const Route = createFileRoute("/_app/student/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return <StudentSettings />;
}

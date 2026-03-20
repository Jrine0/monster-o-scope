// src/routes/_app/teacher/settings.tsx
// Teacher settings page - accessible from sidebar dropdown

import { createFileRoute } from "@tanstack/react-router";
import { TeacherSettings } from "@/features/app/teacher/TeacherSettings";

export const Route = createFileRoute("/_app/teacher/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return <TeacherSettings />;
}

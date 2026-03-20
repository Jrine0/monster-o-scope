// src/routes/_app/route.tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/features/app/navbar";
import AppSidebar from "@/features/app/sidebar";
import { StudentSidebar } from "@/features/app/student/StudentSidebar";
import { SidebarProvider as StudentSidebarProvider, useSidebar } from "@/features/app/student/SidebarContext";
import { AuthHydrator } from "@/features/auth/useAuth";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function StudentLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div style={{ minHeight: "100vh" }}>
      <StudentSidebar />
      <main
        style={{
          marginLeft: isCollapsed ? 72 : 240,
          minHeight: "100vh",
          padding: "1.5rem 2rem 3rem",
          boxSizing: "border-box",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

function RouteComponent() {
  const location = useLocation();
  const pathname = location.pathname;

  const isStudentRoute =
    pathname.includes("/student") &&
    !pathname.includes("/admin") &&
    !pathname.includes("/teacher");

  if (isStudentRoute) {
    return (
      <AuthHydrator>
        {/*
          Lenis hijacks html/body overflow so height:100vh on flex containers
          breaks. Solution: sidebar is position:fixed (viewport-anchored,
          Lenis-immune). Main content just needs marginLeft: 240.
        */}
        <StudentSidebarProvider>
          <StudentLayout />
        </StudentSidebarProvider>
      </AuthHydrator>
    );
  }

  return (
    <SidebarProvider>
      <AuthHydrator>
        <AppSidebar />
        <SidebarInset>
          <main className="p-4">
            <AppNavbar />
            <Outlet />
          </main>
        </SidebarInset>
      </AuthHydrator>
    </SidebarProvider>
  );
}

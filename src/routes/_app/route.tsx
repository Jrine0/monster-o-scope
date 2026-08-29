// src/routes/_app/route.tsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/features/app/navbar";
import AppSidebar from "@/features/app/sidebar";
import { AuthHydrator } from "@/features/auth/useAuth";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const pathname = location.pathname;

  const isStudentRoute =
    pathname.includes("/student") &&
    !pathname.includes("/admin") &&
    !pathname.includes("/teacher");

  if (isStudentRoute) {
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

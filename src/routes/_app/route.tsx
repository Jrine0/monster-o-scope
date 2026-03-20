import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/features/app/navbar";
import AppSidebar from "@/features/app/sidebar";
import { StudentSidebar } from "@/features/app/student/StudentSidebar";
import { AuthHydrator } from "@/features/auth/useAuth";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const isStudentRoute = location.pathname.startsWith("/student");

  return (
    <>
      <SidebarProvider defaultOpen={!isStudentRoute}>
        <AuthHydrator>
          {isStudentRoute ? (
            // Use custom student sidebar with design system
            <div className="student-layout">
              <StudentSidebar />
              <main className="student-content">
                <Outlet />
              </main>
            </div>
          ) : (
            // Use Shadcn sidebar for admin/teacher
            <>
              <AppSidebar />
              <SidebarInset>
                <main className="p-4">
                  <AppNavbar />
                  <Outlet />
                </main>
              </SidebarInset>
            </>
          )}
        </AuthHydrator>
      </SidebarProvider>
    </>
  );
}

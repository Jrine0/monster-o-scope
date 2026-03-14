import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/features/app/navbar";
import AppSidebar from "@/features/app/sidebar";
import { AuthHydrator } from "@/features/auth/useAuth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
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
    </>
  );
}

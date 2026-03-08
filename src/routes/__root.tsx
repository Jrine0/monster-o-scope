import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useLenis } from "../hooks/useLenis";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  useLenis(); // boots Lenis once for the whole app

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      themes={["light", "dark"]}
      storageKey="schoolme-theme"
    >
      <Outlet />
    </ThemeProvider>
  );
}

import {
  RouterProvider,
  createRouter,
  createBrowserHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { StoreProvider, useStore } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in transit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This destination isn't on the map.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <h1 className="text-xl font-semibold">Something went off-route</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Traveloop — AI-powered multi-city trip planner" },
      { name: "description", content: "Design beautiful multi-city itineraries with budgets, day-by-day timelines and shareable trip pages." },
      { property: "og:title", content: "Traveloop — AI-powered multi-city trip planner" },
      { name: "twitter:title", content: "Traveloop — AI-powered multi-city trip planner" },
      { property: "og:description", content: "Design beautiful multi-city itineraries with budgets, day-by-day timelines and shareable trip pages." },
      { name: "twitter:description", content: "Design beautiful multi-city itineraries with budgets, day-by-day timelines and shareable trip pages." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/21d764f9-deeb-465a-a8e2-17edd73979e9/id-preview-3326a30e--8164caf4-a8ca-4aeb-a5b7-882d78c2dd08.lovable.app-1778396584600.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/21d764f9-deeb-465a-a8e2-17edd73979e9/id-preview-3326a30e--8164caf4-a8ca-4aeb-a5b7-882d78c2dd08.lovable.app-1778396584600.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Layout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useStore();
  const isPublic =
    path === "/login" || path === "/signup" || path.startsWith("/share/");

  if (isPublic || !user) {
    if (!isPublic && !user) {
      // not logged in and not on a public page — redirect via Link
      if (typeof window !== "undefined") window.location.href = "/login";
      return null;
    }
    return <Outlet />;
  }
  return <AppShell><Outlet /></AppShell>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Layout />
        <Toaster theme="dark" position="top-right" richColors />
      </StoreProvider>
    </QueryClientProvider>
  );
}

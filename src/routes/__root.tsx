import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import "@fontsource-variable/inter-tight/index.css";
import "@fontsource/jetbrains-mono/300.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useHydrated } from "../lib/useHydrated";
import { AnimusCanvas } from "../scene/AnimusCanvas";
import { HUD } from "../ui/HUD";
import { Reticle } from "../ui/Reticle";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="hud-label mt-4">PAGE_NOT_FOUND</p>
        <a
          href="/"
          className="mt-6 inline-flex border border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background"
        >
          RETURN_HOME
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="hud-label">CONNECTION_ERROR</p>
        <h1 className="mt-4 font-display text-2xl">Something went wrong.</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-foreground bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background"
          >
            Retry
          </button>
          <a
            href="/"
            className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
          >
            Return
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Roushan Kumar" },
      {
        name: "keywords",
        content:
          "Roushan Kumar, Astreon, Backend Developer, Cloud Developer, Stride, Astra Vision, Alyra Lock, Next.js 16, FastAPI, Docker, Oracle Cloud, Redis 7, LibSQL, portfolio",
      },
      { property: "og:site_name", content: "ASTREON — Roushan Kumar" },
      { name: "theme-color", content: "#0a0a0b" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const hydrated = useHydrated();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [desync, setDesync] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setDesync(true);
    setTimeout(() => setTheme((t) => (t === "light" ? "dark" : "light")), 180);
    setTimeout(() => setDesync(false), 700);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {hydrated && <AnimusCanvas dark={theme === "dark"} />}

      <div className="grain pointer-events-none fixed inset-0 z-30" aria-hidden />

      {hydrated && <HUD theme={theme} onToggleTheme={toggleTheme} />}
      {hydrated && <Reticle />}

      {desync && <div className="desync-flash" />}

      <main className="relative z-10">
        <Outlet />
      </main>

      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
            borderRadius: 2,
          },
        }}
      />
    </QueryClientProvider>
  );
}

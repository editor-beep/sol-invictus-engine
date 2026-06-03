import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Starfield } from "@/components/Starfield";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Toaster } from "@/components/ui/sonner";
import { NudgeBanner } from "@/components/NudgeBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold">404</h1>
        <h2 className="mt-4 font-display text-xl text-parchment">The path is not on the Tree.</h2>
        <p className="mt-2 text-sm text-parchment/60">
          What you seek does not lie at this address. Return to the altar.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm border border-gold/40 bg-gold/10 px-5 py-2 text-sm tracking-widest uppercase text-gold transition-colors hover:bg-gold/20"
          >
            Return
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-gold">The candle gutters.</h1>
        <p className="mt-2 text-sm text-parchment/70">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-sm border border-gold/40 bg-gold/10 px-5 py-2 text-sm tracking-widest uppercase text-gold hover:bg-gold/20"
          >
            Re-light
          </button>
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
      { title: "The Invocation Engine — sigils from the Keys of Solomon" },
      {
        name: "description",
        content:
          "An invocation engine that draws from planetary kameas, tarot, the Tree of Life, chakras, numerology, and Solomonic seals to compose a unique sigil for any intention.",
      },
      { name: "author", content: "The Invocation Engine" },
      { property: "og:title", content: "The Invocation Engine" },
      {
        property: "og:description",
        content:
          "Speak an intention. Receive a sigil drawn from the Keys of Solomon and the seven planets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=IM+Fell+English+SC&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return (
    <QueryClientProvider client={queryClient}>
      <Starfield />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <NudgeBanner />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

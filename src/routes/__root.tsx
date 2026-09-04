import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/site-nav";
import { ThemeProvider } from "@/components/theme-provider";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Chance Journey",
      },
      {
        name: "description",
        content: "CJ changes the world.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/brand/favicon.ico",
      },
      {
        rel: "icon",
        href: "/brand/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        href: "/brand/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="font-mono antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <main>
            <SiteNav />
            {children}
          </main>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { ScrollCue } from "@/components/scroll-cue";
import { ScrollWordmark } from "@/components/scroll-wordmark";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen">
      <section
        aria-label="Chance Journey home"
        data-home-section="hero"
        className="relative min-h-dvh bg-[url('/cj-home-bg-pixel.webp')] bg-cover bg-center bg-no-repeat"
      >
        <ScrollCue />
      </section>
      <ScrollWordmark />
      <footer className="border-t border-border/70 px-6 py-8 text-center text-sm text-muted-foreground">
        © 2026 Chance Journey. All rights reserved.
      </footer>
    </div>
  );
}

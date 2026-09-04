import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoDark, LogoLight } from "./logo";

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const firstSection = document.querySelector<HTMLElement>("[data-home-section='hero']");
      const nextIsScrolled = firstSection
        ? firstSection.getBoundingClientRect().bottom <= 0
        : window.scrollY > 2;

      setIsScrolled((currentIsScrolled) =>
        currentIsScrolled === nextIsScrolled ? currentIsScrolled : nextIsScrolled,
      );
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const sideControlBaseClass =
    "pointer-events-auto absolute z-20 flex items-center justify-center rounded-full transition-[top,width,height,background-color,box-shadow,backdrop-filter,color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none";

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        isScrolled
          ? "border-b border-border/70 bg-background/85 shadow-[0_16px_44px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_16px_44px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-0",
      )}
    >
      <div
        className={cn(
          "relative w-full transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isScrolled ? "h-12 sm:h-[3.25rem]" : "h-14 sm:h-[3.75rem]",
        )}
      >
        <Link
          to="/"
          aria-label="Chance Journey home — Chance Journey is an organization that brings changes."
          className={cn(
            sideControlBaseClass,
            "group/logo peer/logo left-3 justify-start overflow-hidden hover:w-[min(11.5rem,calc(100vw-1.5rem))] hover:text-foreground/90 focus:text-foreground/90 focus-visible:w-[min(11.5rem,calc(100vw-1.5rem))] sm:left-6",
            isScrolled
              ? "top-1 h-10 w-10 bg-transparent shadow-none backdrop-blur-0 sm:h-11 sm:w-11"
              : "top-4 h-10 w-10 bg-foreground/10 text-foreground shadow-[0_10px_28px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:h-11 sm:w-11",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center sm:size-11">
            <LogoLight className="size-4 transition-transform duration-700 ease-in-out group-hover/logo:rotate-[360deg] group-focus-visible/logo:rotate-[360deg] motion-reduce:transition-none sm:size-4.5 dark:hidden" />
            <LogoDark className="hidden size-4 transition-transform duration-700 ease-in-out group-hover/logo:rotate-[360deg] group-focus-visible/logo:rotate-[360deg] motion-reduce:transition-none sm:size-4.5 dark:block" />
          </span>
          <span className="min-w-0 pr-4 text-left opacity-0 transition-opacity duration-200 ease-out group-hover/logo:opacity-100 group-hover/logo:delay-150 group-focus-visible/logo:opacity-100 group-focus-visible/logo:delay-150 motion-reduce:transition-none">
            <span className="block text-[11px] leading-[1.1] font-bold whitespace-nowrap sm:text-xs">
              Chance Journey
            </span>
            <span className="mt-0.5 block text-[9px] leading-[1.1] whitespace-nowrap text-foreground/70 sm:text-[10px]">
              Make change happen.
            </span>
          </span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            sideControlBaseClass,
            "right-3 gap-1.5 bg-foreground/10 px-3 text-xs font-semibold text-foreground backdrop-blur-xl peer-hover/logo:pointer-events-none peer-hover/logo:opacity-0 peer-focus-visible/logo:pointer-events-none peer-focus-visible/logo:opacity-0 hover:bg-foreground/15 sm:right-6 sm:px-4 sm:text-sm sm:peer-hover/logo:pointer-events-auto sm:peer-hover/logo:opacity-100 sm:peer-focus-visible/logo:pointer-events-auto sm:peer-focus-visible/logo:opacity-100",
            isScrolled
              ? "top-2 h-8 shadow-none sm:h-9"
              : "top-4 h-10 shadow-[0_10px_28px_rgba(0,0,0,0.1)] sm:h-11",
          )}
        >
          <PlusIcon aria-hidden="true" className="size-4" />
          Waitlist
        </Button>
      </div>
    </header>
  );
}

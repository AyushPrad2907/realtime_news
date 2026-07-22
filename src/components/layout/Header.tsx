"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Search, Menu, Sun, Moon, Radio } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";

const PRIMARY_NAV = [
  { label: "Home", view: { type: "home" as const } },
  { label: "Live", view: { type: "section" as const, slug: "live" as const } },
  { label: "Breaking", view: { type: "section" as const, slug: "breaking" as const } },
  { label: "National", view: { type: "section" as const, slug: "national" as const } },
  { label: "International", view: { type: "section" as const, slug: "international" as const } },
  { label: "Podcasts", view: { type: "section" as const, slug: "podcasts" as const } },
];

export function Header() {
  const { navigate, current, setMobileMenuOpen, setSearchOpen, isLive } = useStore();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  // Track hydration without triggering setState in effect
  const mounted = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (label: string) => {
    if (label === "Home") return current.type === "home";
    if (label === "Live") return current.type === "section" && current.slug === "live";
    if (label === "Breaking") return current.type === "section" && current.slug === "breaking";
    if (label === "National") return (current.type === "section" && current.slug === "national") || (current.type === "category" && current.slug === "national");
    if (label === "International") return (current.type === "section" && current.slug === "international") || (current.type === "category" && current.slug === "international");
    if (label === "Podcasts") return current.type === "section" && current.slug === "podcasts" || current.type === "podcast-episode";
    return false;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-shadow",
        scrolled ? "shadow-sm border-b border-border" : "border-b border-border"
      )}
    >
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          {/* Left: Mobile menu icon (mobile only) */}
          <div className="flex items-center gap-3 md:gap-6 flex-1 md:flex-none">
            {/* Mobile: search icon left */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden -ml-1 p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Logo */}
            <button
              onClick={() => navigate({ type: "home" })}
              className="flex items-center gap-2 group"
              aria-label="Go to homepage"
            >
              <span className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
                The<span className="text-brand">National</span>Dispatch
              </span>
            </button>
          </div>

          {/* Center: Primary nav (desktop only) */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.view)}
                data-active={isActive(item.label)}
                className={cn(
                  "nav-link font-ui text-sm font-medium tracking-wide transition-colors",
                  isActive(item.label)
                    ? "text-foreground"
                    : "text-ink-secondary hover:text-foreground"
                )}
              >
                {item.label === "Live" ? (
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {isLive && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                      </span>
                    )}
                  </span>
                ) : (
                  item.label
                )}
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 md:flex-none justify-end">
            {/* Live button - desktop */}
            <button
              onClick={() => navigate({ type: "section", slug: "live" })}
              className="hidden md:inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-live/10 text-live font-ui text-xs font-semibold uppercase tracking-wide hover:bg-live/20 transition-colors"
            >
              <Radio className="h-3.5 w-3.5" />
              {isLive ? "Live Now" : "Live"}
            </button>

            {/* Search button - desktop */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-md border border-border hover:bg-muted transition-colors text-sm text-ink-secondary"
              aria-label="Open search (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

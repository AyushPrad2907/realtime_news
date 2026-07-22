"use client";

import { useStore } from "@/lib/store";
import { Home, Radio, Search, Headphones, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { navigate, current, isLive, setMobileMenuOpen } = useStore();

  const isActive = (id: string) => {
    if (id === "home") return current.type === "home";
    if (id === "live") return current.type === "section" && current.slug === "live";
    if (id === "search") return false;
    if (id === "podcasts") return current.type === "section" && current.slug === "podcasts" || current.type === "podcast-episode";
    if (id === "menu") return false;
    return false;
  };

  const items = [
    { id: "home", label: "Home", Icon: Home, action: () => navigate({ type: "home" }) },
    { id: "live", label: "Live", Icon: Radio, action: () => navigate({ type: "section", slug: "live" }), badge: isLive },
    { id: "search", label: "Search", Icon: Search, action: () => useStore.getState().setSearchOpen(true) },
    { id: "podcasts", label: "Podcasts", Icon: Headphones, action: () => navigate({ type: "section", slug: "podcasts" }) },
    { id: "menu", label: "Menu", Icon: Menu, action: () => setMobileMenuOpen(true) },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t border-border"
      aria-label="Mobile bottom navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-16">
        {items.map(({ id, label, Icon, action, badge }) => {
          const active = isActive(id);
          return (
            <button
              key={id}
              onClick={action}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 relative",
                active ? "text-brand" : "text-ink-secondary"
              )}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {badge && (
                  <span className="absolute -top-0.5 -right-1 flex h-2 w-2">
                    <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                  </span>
                )}
              </div>
              <span className="font-ui text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

export function CategoryBar() {
  const { navigate, current } = useStore();
  const t = useT();
  const mounted = useHydrated();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const activeCat = current.type === "category" ? current.slug : null;
  const activeSection = current.type === "section" ? current.slug : null;

  return (
    <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="mx-auto max-w-[1280px] relative">
        {/* Left scroll arrow (desktop) */}
        <button
          onClick={() => scrollBy(-1)}
          className={cn(
            "hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-10 items-center justify-center bg-gradient-to-r from-background to-transparent transition-opacity",
            canLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label={mounted ? t("aria.scrollLeft") : "Scroll categories left"}
        >
          <ChevronLeft className="h-4 w-4 text-ink-secondary" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar px-4 md:px-10 py-2.5"
        >
          {CATEGORIES.map((cat) => {
            const active =
              activeCat === cat.slug ||
              (activeSection === cat.slug);
            return (
              <button
                key={cat.slug}
                onClick={() => navigate({ type: "category", slug: cat.slug })}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full font-ui text-[13px] font-medium transition-all",
                  active
                    ? "bg-foreground text-background"
                    : "text-ink-secondary hover:bg-muted hover:text-foreground"
                )}
                style={active ? undefined : undefined}
              >
                <span className="flex items-center gap-1.5">
                  {!active && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: cat.colorVar }}
                    />
                  )}
                  {mounted ? (t(`cat.${cat.slug}` as any) || cat.name) : cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow (desktop) */}
        <button
          onClick={() => scrollBy(1)}
          className={cn(
            "hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-10 items-center justify-center bg-gradient-to-l from-background to-transparent transition-opacity",
            canRight ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          aria-label={mounted ? t("aria.scrollRight") : "Scroll categories right"}
        >
          <ChevronRight className="h-4 w-4 text-ink-secondary" />
        </button>
      </div>
    </div>
  );
}

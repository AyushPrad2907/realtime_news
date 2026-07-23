"use client";

import { useStore } from "@/lib/store";
import { ARTICLES_LIST, INDIAN_STATES } from "@/lib/mock-data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export function StateNews() {
  const { navigate } = useStore();
  const [activeState, setActiveState] = useState(INDIAN_STATES[0]);

  const articles = useMemo(
    () =>
      ARTICLES_LIST.filter((a) => a.states?.includes(activeState)).slice(0, 4),
    [activeState]
  );

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section">State News</h2>
        <span className="font-ui text-xs text-ink-tertiary">
          {articles.length} {articles.length === 1 ? "story" : "stories"} from {activeState}
        </span>
      </div>

      {/* State selector — horizontal scroll on mobile, vertical list on desktop */}
      <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-8">
        <aside className="md:border-r md:border-border md:pr-6">
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3 hidden md:block">
            Select State
          </p>
          <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-1 md:pb-0">
            {INDIAN_STATES.slice(0, 10).map((s) => (
              <button
                key={s}
                onClick={() => setActiveState(s)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full md:rounded-md font-ui text-xs md:text-sm text-left transition-colors",
                  activeState === s
                    ? "bg-foreground text-background font-medium"
                    : "bg-muted text-ink-secondary hover:bg-muted/70"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </aside>

        <div>
          {articles.length === 0 ? (
            <div className="py-12 text-center bg-surface-alt rounded-md">
              <p className="font-ui text-sm text-ink-secondary">
                No stories available for {activeState} right now.
              </p>
              <p className="font-ui text-xs text-ink-tertiary mt-1">
                Check back later or browse other states.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

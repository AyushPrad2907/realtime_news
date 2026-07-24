"use client";

import { useStore } from "@/lib/store";
import { INDIAN_STATES } from "@/lib/mock-data";
import { useArticles } from "@/lib/use-data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

export function StateNews() {
  const { navigate } = useStore();
  const t = useT();
  const mounted = useHydrated();
  const [activeState, setActiveState] = useState(INDIAN_STATES[0]);

  const { data: articles, loading } = useArticles({ state: activeState, limit: 4 });

  if (!mounted) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section">{t("section.stateNews")}</h2>
        <span className="font-ui text-xs text-ink-tertiary">
          {articles.length} {articles.length === 1 ? t("misc.story") : t("misc.stories")}{t("misc.from")}{activeState}
        </span>
      </div>

      {/* State selector — horizontal scroll on mobile, vertical list on desktop */}
      <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-8">
        <aside className="min-w-0 md:border-r md:border-border md:pr-6">
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3 hidden md:block">
            {t("misc.selectState")}
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-muted rounded-lg h-32" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center bg-surface-alt rounded-md">
              <p className="font-ui text-sm text-ink-secondary">
                {t("misc.noStoriesFor")} {activeState}
              </p>
              <p className="font-ui text-xs text-ink-tertiary mt-1">
                {t("misc.checkBackLater")}
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

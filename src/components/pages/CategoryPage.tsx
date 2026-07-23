"use client";

import { useStore } from "@/lib/store";
import { useArticles } from "@/lib/use-data";
import { ARTICLES_LIST } from "@/lib/mock-data";
import type { CategorySlug } from "@/lib/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { getCategory } from "@/lib/utils-news";
import { AdBanner } from "@/components/sections/AdBanner";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/use-t";

interface CategoryPageProps {
  slug: CategorySlug;
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const { navigate } = useStore();
  const t = useT();
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [visibleCount, setVisibleCount] = useState(9);

  const { data: fetchedArticles, loading } = useArticles({ category: slug, limit: 100 });
  const cat = getCategory(slug);
  const categoryTitle = t(`cat.${slug}` as any) || cat.name;

  const articles = useMemo(() => {
    const list = fetchedArticles.length > 0 ? fetchedArticles : ARTICLES_LIST.filter((a) => a.category === slug);
    if (sort === "newest") {
      return [...list].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return [...list].sort((a, b) => b.views - a.views);
  }, [fetchedArticles, slug, sort]);

  const visible = articles.slice(0, visibleCount);
  const [lead, ...rest] = visible;

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8 animate-pulse">
        <header className="mb-8 md:mb-10 pb-6 border-b border-border">
          <div className="h-10 w-48 bg-muted/70 rounded mb-3" />
          <div className="h-5 w-2/3 bg-muted/70 rounded mb-4" />
          <div className="h-4 w-20 bg-muted/70 rounded" />
        </header>
        <div className="aspect-[16/9] bg-muted/60 rounded-xl mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/9] bg-muted/60 rounded-md" />
              <div className="h-3 w-16 bg-muted/70 rounded" />
              <div className="h-5 w-full bg-muted/70 rounded" />
              <div className="h-3 w-2/3 bg-muted/70 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Header */}
      <header className="mb-8 md:mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="h-8 w-1.5 rounded-full"
            style={{ background: cat.colorVar }}
            aria-hidden
          />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            {categoryTitle}
          </h1>
        </div>
        <p className="font-serif text-lg text-ink-secondary max-w-2xl">
          {cat.description}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <span className="font-ui text-xs text-ink-tertiary">
            {articles.length} {articles.length === 1 ? "story" : "stories"}
          </span>
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-muted">
            {([
              { key: "newest", label: "Newest" },
              { key: "popular", label: "Most read" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setSort(opt.key);
                  setVisibleCount(9);
                }}
                className={cn(
                  "px-3 py-1.5 rounded font-ui text-xs font-medium transition-colors",
                  sort === opt.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-ink-secondary hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Lead article */}
      {lead && (
        <section className="mb-10">
          <ArticleCard article={lead} showStandfirst className="md:flex-row md:items-start md:gap-8" />
        </section>
      )}

      {/* Ad */}
      <div className="mb-10">
        <AdBanner format="leaderboard" />
      </div>

      {/* Grid */}
      {rest.length > 0 && (
        <section className="mb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* Load more */}
      {visibleCount < articles.length && (
        <div className="text-center py-8">
          <button
            onClick={() => setVisibleCount((c) => c + 6)}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
          >
            {t("section.viewAll")}
          </button>
          <p className="font-ui text-xs text-ink-tertiary mt-2">
            {articles.length - visibleCount} more stories available
          </p>
        </div>
      )}

      {visibleCount >= articles.length && articles.length > 6 && (
        <div className="text-center py-8">
          <p className="font-ui text-sm text-ink-tertiary mb-3">
            You&rsquo;ve reached the end of {cat.name}.
          </p>
          <button
            onClick={() => navigate({ type: "home" })}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
          >
            {t("article.backToHome")}
          </button>
        </div>
      )}
    </div>
  );
}

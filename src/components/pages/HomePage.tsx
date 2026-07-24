"use client";

import { useState, useEffect, useRef } from "react";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { useArticles, usePodcasts } from "@/lib/use-data";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";
import { HeroStory } from "@/components/sections/HeroStory";
import { TopStories } from "@/components/sections/TopStories";
import { LatestNews } from "@/components/sections/LatestNews";
import { CategoryRibbon } from "@/components/sections/CategoryRibbon";
import { StateNews } from "@/components/sections/StateNews";
import { LiveSection } from "@/components/sections/LiveSection";
import { PodcastSection } from "@/components/sections/PodcastSection";
import { TrendingNow } from "@/components/sections/TrendingNow";
import { EditorsPicks } from "@/components/sections/EditorsPicks";
import { Newsletter } from "@/components/sections/Newsletter";
import { AdBanner } from "@/components/sections/AdBanner";
import type { Article, CategorySlug, PodcastEpisode } from "@/lib/types";

function LazySection({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function HomePage() {
  const t = useT();
  const mounted = useHydrated();
  // Fetch from real API; mock data is returned instantly as fallback
  const { data: articles, loading } = useArticles({ limit: 50 });
  const { data: podcastData } = usePodcasts();

  // Show a beautiful, shimmering skeleton loading state to prevent layout flash
  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8 animate-pulse">
        {/* Hero Story Skeleton */}
        <div className="mb-10 md:mb-16">
          <div className="aspect-[16/10] md:aspect-[16/9] bg-muted/60 rounded-xl relative flex flex-col justify-end p-4 md:p-10">
            <div className="h-4 w-24 bg-muted/90 rounded mb-3" />
            <div className="h-8 md:h-12 w-3/4 bg-muted/90 rounded mb-4" />
            <div className="h-8 md:h-12 w-1/2 bg-muted/90 rounded mb-6" />
            <div className="h-4 w-40 bg-muted/90 rounded" />
          </div>
        </div>

        {/* Top Stories Skeleton */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-end justify-between mb-6 border-b border-border pb-3">
            <div className="h-6 w-32 bg-muted/70 rounded" />
            <div className="h-4 w-16 bg-muted/70 rounded" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="col-span-1 space-y-4">
              <div className="aspect-[16/9] bg-muted/60 rounded-md" />
              <div className="h-4 w-20 bg-muted/70 rounded" />
              <div className="h-6 w-full bg-muted/70 rounded" />
              <div className="h-4 w-3/4 bg-muted/70 rounded" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[16/9] bg-muted/60 rounded-md" />
                  <div className="h-3 w-16 bg-muted/70 rounded" />
                  <div className="h-5 w-full bg-muted/70 rounded" />
                  <div className="h-3 w-2/3 bg-muted/70 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest News Skeleton */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="h-6 w-28 bg-muted/70 rounded border-b border-border pb-2 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start py-4 border-b border-border">
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-5/6 bg-muted/70 rounded" />
                  <div className="h-3 w-1/2 bg-muted/70 rounded" />
                </div>
                <div className="h-16 w-24 bg-muted/60 rounded" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block space-y-6">
            <div className="h-6 w-24 bg-muted/70 rounded mb-4" />
            <div className="h-48 bg-muted/50 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Until articles load, use mock data so the page renders instantly
  const list = articles.length > 0 ? articles : ARTICLES_LIST;
  const episodes: PodcastEpisode[] = podcastData.episodes;

  const featured = list.find((a) => a.isFeatured) ?? list[0];

  // Top stories: take 5 articles, exclude the featured one
  const topStories = list.filter((a) => a.id !== featured?.id).slice(0, 5);

  // Editor's picks: a curated selection (use mock-defined slugs as a stable curation signal,
  // then fall back to the next 4 articles by views)
  const editorsPickSlugs = new Set([
    "supreme-court-data-protection-ruling",
    "isro-reusable-launch-vehicle-test-success",
    "bhopal-heritage-conservation-project",
    "dengue-vaccine-trial-results-published",
  ]);
  const editorsPicks =
    list.filter((a) => editorsPickSlugs.has(a.slug)).slice(0, 4) ||
    list.slice(4, 8);

  const byCategory = (slug: CategorySlug) => list.filter((a) => a.category === slug);

  if (!featured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-ui text-sm text-ink-secondary">{mounted ? t("misc.loading") : "Loading…"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      <HeroStory article={featured} />

      <TopStories articles={topStories} />

      <div className="mb-12 md:mb-16">
        <AdBanner format="leaderboard" />
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 mb-12 md:mb-16">
        <div>
          <LatestNews articles={list} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <AdBanner format="rectangle" />
            <div>
              <h3 className="font-display text-base font-bold mb-3 border-b border-border pb-2">
                {mounted ? t("misc.mostRead") : "Most Read"}
              </h3>
              <ol className="space-y-3">
                {[...list]
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((a, i) => (
                    <li key={a.id} className="flex gap-3">
                      <span className="font-display text-2xl font-extrabold text-ink-tertiary/40 tabular-nums leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-ui text-sm leading-snug line-clamp-2 flex-1">
                        {a.title}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
            <AdBanner format="rectangle" />
          </div>
        </aside>
      </div>

      <LazySection>
        <LiveSection />
      </LazySection>

      <LazySection>
        <EditorsPicks articles={editorsPicks} />
      </LazySection>

      <LazySection>
        <CategoryRibbon category="politics" articles={byCategory("politics")} />
      </LazySection>
      <LazySection>
        <CategoryRibbon category="economy" articles={byCategory("economy")} />
      </LazySection>
      <LazySection>
        <CategoryRibbon category="sports" articles={byCategory("sports")} />
      </LazySection>

      <LazySection>
        <PodcastSection episodes={episodes} />
      </LazySection>

      <LazySection>
        <StateNews />
      </LazySection>

      <LazySection>
        <CategoryRibbon category="technology" articles={byCategory("technology")} />
      </LazySection>
      <LazySection>
        <CategoryRibbon category="science" articles={byCategory("science")} />
      </LazySection>

      <LazySection>
        <TrendingNow articles={list} />
      </LazySection>

      <LazySection>
        <Newsletter />
      </LazySection>
    </div>
  );
}

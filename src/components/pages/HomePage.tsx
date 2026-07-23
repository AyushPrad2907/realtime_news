"use client";

import { useState, useEffect, useRef } from "react";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { useArticles, usePodcasts } from "@/lib/use-data";
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
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px 0px", // Load 300px before scrolling into view for a smooth transition
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[100px]">
      {shouldRender ? children : <div className="h-24 animate-pulse bg-muted/20 rounded-lg" />}
    </div>
  );
}

export function HomePage() {
  // Fetch from real API; mock data is returned instantly as fallback
  const { data: articles } = useArticles({ limit: 50 });
  const { data: podcastData } = usePodcasts();

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
        <p className="font-ui text-sm text-ink-secondary">Loading…</p>
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
                Most Read
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

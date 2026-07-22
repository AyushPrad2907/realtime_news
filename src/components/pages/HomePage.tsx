"use client";

import { ARTICLES_LIST } from "@/lib/mock-data";
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
import type { CategorySlug } from "@/lib/types";

export function HomePage() {
  const featured = ARTICLES_LIST.find((a) => a.isFeatured) ?? ARTICLES_LIST[0];

  // Top stories: take 5 articles, exclude the featured one
  const topStories = ARTICLES_LIST.filter((a) => a.id !== featured.id).slice(0, 5);

  // Editor's picks: a curated selection
  const editorsPicks = [
    ARTICLES_LIST.find((a) => a.slug === "supreme-court-data-protection-ruling")!,
    ARTICLES_LIST.find((a) => a.slug === "isro-reusable-launch-vehicle-test-success")!,
    ARTICLES_LIST.find((a) => a.slug === "bhopal-heritage-conservation-project")!,
    ARTICLES_LIST.find((a) => a.slug === "dengue-vaccine-trial-results-published")!,
  ];

  const byCategory = (slug: CategorySlug) =>
    ARTICLES_LIST.filter((a) => a.category === slug);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      <HeroStory article={featured} />

      <TopStories articles={topStories} />

      <div className="mb-12 md:mb-16">
        <AdBanner format="leaderboard" />
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12 mb-12 md:mb-16">
        <div>
          <LatestNews articles={ARTICLES_LIST} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <AdBanner format="rectangle" />
            <div>
              <h3 className="font-display text-base font-bold mb-3 border-b border-border pb-2">
                Most Read
              </h3>
              <ol className="space-y-3">
                {ARTICLES_LIST.slice()
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

      <LiveSection />

      <EditorsPicks articles={editorsPicks} />

      <CategoryRibbon category="politics" articles={byCategory("politics")} />
      <CategoryRibbon category="economy" articles={byCategory("economy")} />
      <CategoryRibbon category="sports" articles={byCategory("sports")} />

      <PodcastSection />

      <StateNews />

      <CategoryRibbon category="technology" articles={byCategory("technology")} />
      <CategoryRibbon category="science" articles={byCategory("science")} />

      <TrendingNow />

      <Newsletter />
    </div>
  );
}

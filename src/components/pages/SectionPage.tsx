"use client";

import { useStore } from "@/lib/store";
import { ARTICLES_LIST, PODCAST_EPISODES, PODCAST_SERIES } from "@/lib/mock-data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { LiveSection } from "@/components/sections/LiveSection";
import { AdBanner } from "@/components/sections/AdBanner";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Globe, Flag, Headphones } from "lucide-react";

import { useT } from "@/hooks/use-t";

interface SectionPageProps {
  slug: "live" | "breaking" | "national" | "international" | "podcasts";
}

export function SectionPage({ slug }: SectionPageProps) {
  // Live is its own page
  if (slug === "live") {
    return <LiveSection />;
  }
  // Podcasts section
  if (slug === "podcasts") {
    return <PodcastsSection />;
  }
  return <NewsSectionPage slug={slug} />;
}

const META = {
  breaking: {
    titleKey: "nav.breaking",
    description: "The latest developing stories, as they happen.",
    Icon: AlertCircle,
    color: "var(--breaking)",
    filter: (a: (typeof ARTICLES_LIST)[number]) => a.isBreaking === true,
  },
  national: {
    titleKey: "cat.national",
    description: "Stories shaping the nation — from across the country.",
    Icon: Flag,
    color: "var(--cat-national)",
    filter: (a: (typeof ARTICLES_LIST)[number]) =>
      a.category === "national" || (a.states && a.states.length > 0),
  },
  international: {
    titleKey: "cat.international",
    description: "Global developments, contextualised.",
    Icon: Globe,
    color: "var(--cat-international)",
    filter: (a: (typeof ARTICLES_LIST)[number]) => a.category === "international",
  },
} as const;

function NewsSectionPage({ slug }: { slug: "breaking" | "national" | "international" }) {
  const { navigate } = useStore();
  const t = useT();
  const [visibleCount, setVisibleCount] = useState(9);

  const config = META[slug];
  const Icon = config.Icon;
  const filterFn = config.filter;

  const articles = useMemo(
    () =>
      ARTICLES_LIST.filter(filterFn).sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [filterFn]
  );

  const visible = articles.slice(0, visibleCount);
  const [lead, ...rest] = visible;

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Header */}
      <header className="mb-8 md:mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="h-8 w-1.5 rounded-full"
            style={{ background: config.color }}
            aria-hidden
          />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            {t(config.titleKey as any)}
          </h1>
          {slug === "breaking" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-live text-white font-ui text-xs font-bold uppercase tracking-wide">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {t("nav.live")}
            </span>
          )}
        </div>
        <p className="font-serif text-lg text-ink-secondary max-w-2xl">
          {config.description}
        </p>
      </header>

      {/* Lead article */}
      {lead && (
        <section className="mb-10">
          <ArticleCard article={lead} showStandfirst />
        </section>
      )}

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

      {visibleCount < articles.length && (
        <div className="text-center py-8">
          <button
            onClick={() => setVisibleCount((c) => c + 6)}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
          >
            {t("section.viewAll")}
          </button>
        </div>
      )}

      {articles.length === 0 && (
        <div className="py-16 text-center">
          <Icon className="h-12 w-12 text-ink-tertiary mx-auto mb-4" />
          <p className="font-ui text-sm text-ink-secondary">
            No stories in this section right now. Check back soon.
          </p>
          <button
            onClick={() => navigate({ type: "home" })}
            className="mt-4 inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
          >
            {t("article.backToHome")}
          </button>
        </div>
      )}
    </div>
  );
}

function PodcastsSection() {
  const [filter, setFilter] = useState<"All" | "News" | "Analysis" | "Interviews" | "Special Series">("All");

  const filtered = useMemo(() => {
    if (filter === "All") return PODCAST_EPISODES;
    return PODCAST_EPISODES.filter((ep) => {
      const series = PODCAST_SERIES.find((s) => s.id === ep.seriesId);
      return series?.category === filter;
    });
  }, [filter]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      <header className="mb-8 md:mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Headphones className="h-8 w-8 text-brand" />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Podcasts
          </h1>
        </div>
        <p className="font-serif text-lg text-ink-secondary max-w-2xl">
          Long-form conversations, daily briefings, and on-the-ground reporting —
          from the editors and correspondents of The National Dispatch.
        </p>
      </header>

      {/* Featured series */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-5">Series</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {PODCAST_SERIES.map((series) => (
            <div key={series.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-md aspect-square bg-muted mb-2.5">
                <img
                  src={series.coverImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover img-zoom"
                />
              </div>
              <p className="font-display text-sm font-bold line-clamp-1 group-hover:text-brand transition-colors">
                {series.name}
              </p>
              <p className="font-ui text-[11px] text-ink-tertiary">
                {series.episodes} episodes
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["All", "News", "Analysis", "Interviews", "Special Series"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full font-ui text-xs font-medium transition-colors",
              filter === f
                ? "bg-foreground text-background"
                : "bg-muted text-ink-secondary hover:bg-muted/70"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-5">
          {filter === "All" ? "Latest Episodes" : `${filter} Episodes`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((ep) => (
            <PodcastCard key={ep.id} episode={ep} />
          ))}
        </div>
      </section>
    </div>
  );
}

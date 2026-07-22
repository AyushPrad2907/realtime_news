"use client";

import { useState, useMemo } from "react";
import { PODCAST_EPISODES, PODCAST_SERIES } from "@/lib/mock-data";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "News", "Analysis", "Interviews", "Special Series"] as const;
type Filter = (typeof FILTERS)[number];

export function PodcastsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const filteredEpisodes = useMemo(() => {
    if (filter === "All") return PODCAST_EPISODES;
    return PODCAST_EPISODES.filter((ep) => {
      const series = PODCAST_SERIES.find((s) => s.id === ep.seriesId);
      return series?.category === filter;
    });
  }, [filter]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Headphones className="h-8 w-8 text-brand" />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Podcasts
          </h1>
        </div>
        <p className="font-serif text-lg text-ink-secondary max-w-2xl">
          Long-form conversations, daily briefings, and on-the-ground reporting —
          from the editors and correspondents of The National Dispatch.
        </p>
      </div>

      {/* Featured series — show all series as cards */}
      <section className="mb-12">
        <h2 className="h-section mb-5 border-b border-border pb-3">Series</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {PODCAST_SERIES.map((series) => (
            <div
              key={series.id}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-md aspect-square bg-muted mb-2.5 relative">
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

      {/* Filter row */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => (
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

      {/* Episodes grid */}
      <section className="mb-12">
        <h2 className="h-section mb-5 border-b border-border pb-3">
          {filter === "All" ? "Latest Episodes" : `${filter} Episodes`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredEpisodes.map((ep) => (
            <PodcastCard key={ep.id} episode={ep} />
          ))}
        </div>
      </section>
    </div>
  );
}

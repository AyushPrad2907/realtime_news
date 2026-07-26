"use client";

import { useState, useMemo } from "react";
import { PODCAST_EPISODES, PODCAST_SERIES } from "@/lib/mock-data";
import { usePodcasts } from "@/lib/use-data";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { Headphones } from "lucide-react";
import { t } from "@/lib/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "News", "Analysis", "Interviews", "Special Series"] as const;
type Filter = (typeof FILTERS)[number];

export function PodcastsPage() {
  const mounted = useHydrated();
  const { language } = useStore();
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const { data } = usePodcasts();
  const series = data.series.length > 0 ? data.series : PODCAST_SERIES;
  const allEpisodes = data.episodes.length > 0 ? data.episodes : PODCAST_EPISODES;

  const filteredEpisodes = useMemo(() => {
    let list = allEpisodes;
    if (selectedSeriesId) {
      list = list.filter((ep) => ep.seriesId === selectedSeriesId);
    }
    if (filter === "All") return list;
    return list.filter((ep) => {
      const s = series.find((x) => x.id === ep.seriesId);
      return s?.category === filter;
    });
  }, [filter, selectedSeriesId, allEpisodes, series]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Headphones className="h-8 w-8 text-brand" />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            {mounted ? t(language, "nav.podcasts") : "Podcasts"}
          </h1>
        </div>
        <p className="font-serif text-lg text-ink-secondary max-w-2xl">
          {mounted ? t(language, "misc.podcastDesc") : "Long-form conversations, daily briefings, and on-the-ground reporting — from the editors and correspondents of NewsVarta."}
        </p>
      </div>

      {/* Featured series — show all series as cards */}
      <section className="mb-12">
        <h2 className="h-section mb-5 border-b border-border pb-3">{mounted ? t(language, "misc.series") : "Series"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {series.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSeriesId(selectedSeriesId === s.id ? null : s.id)}
              className={cn(
                "group cursor-pointer p-2 rounded-lg border transition-all duration-200",
                selectedSeriesId === s.id 
                  ? "border-brand bg-brand/5 shadow-sm" 
                  : "border-transparent hover:border-border hover:bg-muted/30"
              )}
            >
              <div className="overflow-hidden rounded-md aspect-square bg-muted mb-2.5 relative">
                <img
                  src={s.coverImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover img-zoom"
                />
              </div>
              <p className="font-display text-sm font-bold line-clamp-1 group-hover:text-brand transition-colors">
                {s.name}
              </p>
              <p className="font-ui text-[11px] text-ink-tertiary">
                {s.episodes} {mounted ? t(language, "misc.episodes") : "episodes"}
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
          {filter === "All" ? (mounted ? t(language, "misc.latestEpisodes") : "Latest Episodes") : `${filter} Episodes`}
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

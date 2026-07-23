"use client";

import { useStore } from "@/lib/store";
import type { PodcastEpisode } from "@/lib/types";
import { PODCAST_SERIES } from "@/lib/mock-data";
import { Play, Pause, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils-news";

interface PodcastCardProps {
  episode: PodcastEpisode;
  variant?: "default" | "compact";
  className?: string;
}

export function PodcastCard({ episode, variant = "default", className }: PodcastCardProps) {
  const { navigate, playEpisode, nowPlaying, isPlaying, togglePlay } = useStore();
  const series = PODCAST_SERIES.find((s) => s.id === episode.seriesId);

  const isCurrent = nowPlaying?.id === episode.id;
  const showPlay = !isCurrent || !isPlaying;

  const onPlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episode);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={() => navigate({ type: "podcast-episode", slug: episode.slug })}
        className={cn("group flex items-center gap-3 w-full text-left", className)}
      >
        <div className="relative shrink-0">
          <img
            src={episode.coverImage}
            alt=""
            loading="lazy"
            className="h-14 w-14 rounded object-cover"
          />
          <div
            onClick={onPlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded"
            role="button"
            tabIndex={0}
            aria-label={showPlay ? "Play episode" : "Pause episode"}
          >
            {showPlay ? (
              <Play className="h-5 w-5 text-white" fill="currentColor" />
            ) : (
              <Pause className="h-5 w-5 text-white" fill="currentColor" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-ui text-[10px] uppercase tracking-wider text-ink-tertiary mb-0.5">
            {series?.name}
          </p>
          <p className="font-display text-sm font-bold leading-tight line-clamp-2 group-hover:text-brand transition-colors">
            {episode.title}
          </p>
          <p className="font-ui text-[11px] text-ink-tertiary mt-1">
            {episode.duration}
          </p>
        </div>
      </button>
    );
  }

  return (
    <article
      onClick={() => navigate({ type: "podcast-episode", slug: episode.slug })}
      className={cn("group cursor-pointer flex flex-col card-hover", className)}
    >
      <div className="relative overflow-hidden rounded-md mb-3 aspect-square bg-muted">
        <img
          src={episode.coverImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover img-zoom"
        />
        <button
          onClick={onPlayClick}
          className="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label={showPlay ? "Play episode" : "Pause episode"}
        >
          {showPlay ? (
            <Play className="h-4 w-4" fill="currentColor" />
          ) : (
            <Pause className="h-4 w-4" fill="currentColor" />
          )}
        </button>
      </div>
      <p className="font-ui text-[10px] uppercase tracking-wider text-brand font-semibold mb-1">
        {series?.name} · Ep {episode.episodeNumber}
      </p>
      <h3 className="font-display text-base md:text-lg font-bold leading-tight line-clamp-3 group-hover:text-brand transition-colors">
        {episode.title}
      </h3>
      <p className="font-serif text-[13px] text-ink-secondary mt-1.5 line-clamp-2">
        {episode.description}
      </p>
      <div className="flex items-center gap-2 mt-2 font-ui text-[11px] text-ink-tertiary">
        <Clock className="h-3 w-3" />
        <span>{episode.duration}</span>
        <span aria-hidden>·</span>
        <span>{timeAgo(episode.publishedAt)}</span>
      </div>
    </article>
  );
}

"use client";

import { useStore } from "@/lib/store";
import { PODCAST_EPISODES, PODCAST_SERIES } from "@/lib/mock-data";
import { fetchPodcastEpisode } from "@/lib/api-client";
import { PodcastCard } from "@/components/cards/PodcastCard";
import {
  Play,
  Pause,
  Download,
  Share2,
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils-news";
import { TimeAgo } from "@/components/TimeAgo";
import type { PodcastEpisode, PodcastSeries } from "@/lib/types";

interface PodcastDetailPageProps {
  slug: string;
}

export function PodcastDetailPage({ slug }: PodcastDetailPageProps) {
  const { navigate, back, canGoBack, playEpisode, nowPlaying, isPlaying, togglePlay } = useStore();
  const [progress, setProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState<string>("00:00");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start with mock data for instant render, refresh from API in background
  const mockEpisode = PODCAST_EPISODES.find((e) => e.slug === slug);
  const mockSeries = mockEpisode
    ? PODCAST_SERIES.find((s) => s.id === mockEpisode.seriesId) ?? null
    : null;

  const [episode, setEpisode] = useState<PodcastEpisode | null>(mockEpisode ?? null);
  const [series, setSeries] = useState<PodcastSeries | null>(mockSeries);
  const [otherEpisodes, setOtherEpisodes] = useState<PodcastEpisode[]>(
    mockEpisode
      ? PODCAST_EPISODES.filter((e) => e.seriesId === mockEpisode.seriesId && e.id !== mockEpisode.id).slice(0, 6)
      : []
  );
  const [loading, setLoading] = useState(!mockEpisode);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      fetchPodcastEpisode(slug).then((data) => {
        if (cancelled) return;
        if (data) {
          setEpisode(data.episode);
          setSeries({
            id: data.series.id,
            name: data.series.name,
            description: data.series.description,
            coverImage: data.series.coverImage,
            category: data.series.category as PodcastSeries["category"],
            episodes: data.series.episodes,
          });
          setOtherEpisodes(data.otherEpisodes);
        } else {
          setEpisode(null);
        }
        setLoading(false);
      }).catch(() => {
        if (!cancelled) {
          setEpisode(null);
          setLoading(false);
        }
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [slug]);

  const isCurrent = nowPlaying?.id === episode?.id;
  const showPlay = !isCurrent || !isPlaying;

  useEffect(() => {
    if (isCurrent && isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCurrent, isPlaying]);

  useEffect(() => {
    if (episode) {
      document.title = `${episode.title} — Podcast — NewsVarta`;
    }
    return () => {
      document.title = "NewsVarta";
    };
  }, [episode]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  if (!episode || !series) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Episode not found</h1>
        <button
          onClick={() => navigate({ type: "section", slug: "podcasts" })}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          Browse all podcasts
        </button>
      </div>
    );
  }

  const onPlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episode);
      setProgress(0);
    }
  };

  const onShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Episode link copied to clipboard");
  };

  // Format duration as mm:ss from "MM:SS" or "HH:MM:SS"
  const fmtTime = (t: string) => t;

  // Parse "MM:SS" to seconds for seeking
  const parseTime = (t: string): number => {
    const parts = t.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const totalSeconds = parseTime(episode.duration);
  const currentSeconds = Math.floor((progress / 100) * totalSeconds);
  const formatCurrentTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-ui text-xs text-ink-tertiary mb-4">
        <button
          onClick={() => navigate({ type: "section", slug: "podcasts" })}
          className="hover:text-brand transition-colors"
        >
          Podcasts
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary">{series.name}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1">{episode.title}</span>
      </nav>

      {canGoBack() && (
        <button
          onClick={back}
          className="inline-flex items-center gap-1 font-ui text-xs text-ink-secondary hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
        <div className="min-w-0">
          {/* Header */}
          <div className="flex items-start gap-4 md:gap-6 mb-6">
            <img
              src={episode.coverImage}
              alt=""
              className="h-24 w-24 md:h-32 md:w-32 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
                {series.name} · Episode {episode.episodeNumber}
              </p>
              <h1 className="font-display text-2xl md:text-4xl font-extrabold leading-tight tracking-tight">
                {episode.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 font-ui text-xs text-ink-tertiary">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(episode.publishedAt)}
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {episode.duration}
                </span>
                <span aria-hidden>·</span>
                <span><TimeAgo iso={episode.publishedAt} /></span>
              </div>
            </div>
          </div>

          {/* Audio player / Video Player */}
          {episode.videoId ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
              <iframe
                src={`https://www.youtube.com/embed/${episode.videoId}?autoplay=0`}
                title={episode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="bg-surface-alt border border-border/60 rounded-lg p-4 md:p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={onPlayClick}
                  className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-lg transition-colors"
                  aria-label={showPlay ? "Play episode" : "Pause episode"}
                >
                  {showPlay ? (
                    <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                  ) : (
                    <Pause className="h-6 w-6" fill="currentColor" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base font-bold line-clamp-1">
                    {episode.title}
                  </p>
                  <p className="font-ui text-[11px] text-ink-tertiary">
                    {series.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toast.message("Downloading episode…")}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    aria-label="Download episode"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onShare}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    aria-label="Share episode"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Seek bar */}
              <div className="flex items-center gap-3">
                <span className="font-ui text-[11px] tabular-nums text-ink-secondary w-12 text-right">
                  {formatCurrentTime(currentSeconds)}
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative cursor-pointer">
                  <div
                    className="h-full bg-brand transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-ui text-[11px] tabular-nums text-ink-tertiary w-12">
                  {episode.duration}
                </span>
              </div>
            </div>
          )}

          {/* Show notes */}
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold mb-3">About this episode</h2>
            <p className="font-serif text-base text-ink-secondary leading-relaxed mb-6">
              {episode.description}
            </p>

            <h3 className="font-display text-lg font-bold mb-3 border-b border-border pb-2">
              Chapter markers
            </h3>
            <ul className="space-y-1">
              {episode.showNotes.map((ch) => (
                <li key={ch.time}>
                  <button
                    onClick={() => {
                      const seconds = parseTime(ch.time);
                      setProgress((seconds / totalSeconds) * 100);
                      setCurrentChapter(ch.time);
                      if (!isCurrent) playEpisode(episode);
                    }}
                    className="group w-full flex items-center gap-3 p-2 -mx-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <span className="font-ui text-xs font-mono tabular-nums text-brand w-14 shrink-0">
                      {ch.time}
                    </span>
                    <span className="font-ui text-sm text-foreground group-hover:text-brand transition-colors">
                      {ch.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsor mention */}
          <div className="my-8 p-4 rounded-md border border-dashed border-border bg-surface-alt text-center">
            <p className="font-ui text-[11px] uppercase tracking-wider text-ink-tertiary mb-1">
              This episode is brought to you by
            </p>
            <p className="font-display text-lg font-bold">Audible</p>
            <p className="font-serif text-sm text-ink-secondary mt-1">
              Listen to thousands of audiobooks and podcasts. First month free.
            </p>
          </div>

          {/* More from this series */}
          {otherEpisodes.length > 0 && (
            <div className="mt-10">
              <h3 className="h-section mb-5 border-b border-border pb-3">
                More from {series.name}
              </h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {otherEpisodes.map((ep) => (
                  <PodcastCard key={ep.id} episode={ep} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="p-4 rounded-lg bg-surface-alt">
              <img
                src={series.coverImage}
                alt=""
                className="h-24 w-24 rounded-md object-cover mb-3"
              />
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
                {series.category}
              </p>
              <h4 className="font-display text-lg font-bold leading-tight">
                {series.name}
              </h4>
              <p className="font-serif text-sm text-ink-secondary mt-1.5 leading-relaxed">
                {series.description}
              </p>
              <p className="font-ui text-[11px] text-ink-tertiary mt-3">
                {series.episodes} episodes
              </p>
            </div>

            <div>
              <h4 className="font-display text-base font-bold mb-3 border-b border-border pb-2">
                Other Series
              </h4>
              <ul className="space-y-2">
                {PODCAST_SERIES.filter((s) => s.id !== series.id).slice(0, 5).map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        // Just go to podcasts page for now
                        navigate({ type: "section", slug: "podcasts" });
                      }}
                      className="group flex items-center gap-3 w-full p-2 -mx-2 rounded-md hover:bg-muted transition-colors text-left"
                    >
                      <img
                        src={s.coverImage}
                        alt=""
                        className="h-10 w-10 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-ui text-sm font-medium line-clamp-1 group-hover:text-brand transition-colors">
                          {s.name}
                        </p>
                        <p className="font-ui text-[11px] text-ink-tertiary">
                          {s.episodes} episodes
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

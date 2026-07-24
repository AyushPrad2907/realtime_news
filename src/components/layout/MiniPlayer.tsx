"use client";

import { useStore } from "@/lib/store";
import { Play, Pause, X, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function MiniPlayer() {
  const { nowPlaying, isPlaying, togglePlay, stopPlayback, navigate } = useStore();

  return (
    <AnimatePresence>
      {nowPlaying && (
        <MiniPlayerContent
          key={nowPlaying.id}
          episodeId={nowPlaying.id}
          coverImage={nowPlaying.coverImage}
          title={nowPlaying.title}
          duration={nowPlaying.duration}
          slug={nowPlaying.slug}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onStop={stopPlayback}
          onExpand={(slug) => navigate({ type: "podcast-episode", slug })}
        />
      )}
    </AnimatePresence>
  );
}

interface MiniPlayerContentProps {
  episodeId: string;
  coverImage: string;
  title: string;
  duration: string;
  slug: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onExpand: (slug: string) => void;
}

function MiniPlayerContent({
  episodeId,
  coverImage,
  title,
  duration,
  slug,
  isPlaying,
  onTogglePlay,
  onStop,
  onExpand,
}: MiniPlayerContentProps) {
  // Each instance starts at 0 — the `key={episodeId}` in the parent causes
  // a fresh mount whenever the episode changes, which naturally resets state.
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.4));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg"
    >
      {/* Progress bar */}
      <div className="h-0.5 bg-muted relative">
        <div
          className="h-full bg-brand transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-3 md:px-6 py-2.5 flex items-center gap-3">
        {/* Cover */}
        <button
          onClick={() => onExpand(slug)}
          className="shrink-0 relative"
          aria-label="Open episode"
        >
          <img
            src={coverImage}
            alt=""
            className="h-10 w-10 md:h-12 md:w-12 rounded object-cover"
          />
        </button>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="font-ui text-sm font-medium text-foreground line-clamp-1">
            {title}
          </p>
          <p className="font-ui text-[11px] text-ink-tertiary line-clamp-1">
            {duration} · NewsVarta
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-full bg-brand hover:bg-brand-dark text-white transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4" fill="currentColor" />
            )}
          </button>

          <button
            onClick={() => onExpand(slug)}
            className="hidden md:inline-flex p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Expand"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          <button
            onClick={onStop}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Close player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

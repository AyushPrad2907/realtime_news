"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { useBreaking } from "@/lib/use-data";
import { AlertCircle, X, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveClock } from "@/components/LiveClock";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

export function BreakingTicker() {
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { navigate } = useStore();
  const { data: headlines, refetch } = useBreaking();
  const t = useT();
  const mounted = useHydrated();

  if (dismissed || headlines.length === 0) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Triple the content so the loop is seamless
  const tickerContent = [...headlines, ...headlines, ...headlines];

  const onClickHeadline = (text: string) => {
    const match = ARTICLES_LIST.find((a) =>
      text.toLowerCase().includes(a.title.toLowerCase().slice(0, 25).toLowerCase())
    );
    if (match) {
      navigate({ type: "article", slug: match.slug });
    } else {
      navigate({ type: "section", slug: "breaking" });
    }
  };

  return (
    <div
      className="bg-breaking text-white border-b border-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label={mounted ? t("aria.breakingNews") : "Breaking news"}
    >
      <div className="mx-auto max-w-[1280px] flex items-stretch">
        <div className="shrink-0 flex items-center gap-2 px-3 md:px-5 py-2 bg-black/30 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <AlertCircle className="h-3.5 w-3.5 text-red-300" />
          <span className="font-ui text-[11px] md:text-xs font-bold uppercase tracking-wider">
            {mounted ? t("nav.breaking") : "Breaking"}
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className={cn(
              "flex items-center whitespace-nowrap py-2 animate-ticker",
              paused && "ticker-paused"
            )}
          >
            {tickerContent.map((headline, i) => (
              <button
                key={i}
                onClick={() => onClickHeadline(headline)}
                className="inline-flex items-center gap-3 px-4 font-ui text-[13px] text-white/90 hover:text-white transition-colors"
              >
                <span className="h-1 w-1 rounded-full bg-white/60" />
                {headline}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          className="shrink-0 px-2.5 flex items-center text-white/70 hover:text-white transition-colors border-l border-white/10"
          title="Refresh breaking news"
          aria-label="Refresh breaking news"
        >
          <RotateCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-white")} />
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 px-3 md:px-4 flex items-center text-white/70 hover:text-white transition-colors border-l border-white/10"
          aria-label={mounted ? t("aria.dismissTicker") : "Dismiss breaking news ticker"}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Compact live clock — right side of ticker, visible on all screens */}
        <div className="shrink-0 hidden sm:flex items-center px-3 md:px-4 border-l border-white/10 bg-black/20">
          <LiveClock compact />
        </div>
      </div>
    </div>
  );
}

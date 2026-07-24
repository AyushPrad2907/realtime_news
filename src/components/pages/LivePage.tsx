"use client";

import { useStore } from "@/lib/store";
import { LIVE_UPDATES, ARTICLES_LIST } from "@/lib/mock-data";
import { useLive, useArticles } from "@/lib/use-data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Users, Calendar, Bell, Share2, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { useState, useEffect } from "react";
import type { LiveUpdate } from "@/lib/types";

export function LivePage() {
  const mounted = useHydrated();
  const { navigate, language } = useStore();
  const { data: live } = useLive();
  const { data: articles } = useArticles({ category: "politics", limit: 10 });

  const [updates, setUpdates] = useState<LiveUpdate[]>(LIVE_UPDATES);
  const [newUpdateCount, setNewUpdateCount] = useState(0);

  // Sync updates from API when they arrive
  useEffect(() => {
    const id = setTimeout(() => {
      if (live.updates && live.updates.length > 0) {
        setUpdates(live.updates);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [live.updates]);

  // Simulate periodic new-update notifications (every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      setNewUpdateCount((c) => c + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const showNewUpdates = () => {
    setNewUpdateCount(0);
    const sample: LiveUpdate[] = [
      { id: `n${Date.now()}`, timestamp: "Just now", text: "The President has received the Bill for assent, the Ministry of Electronics and IT said in a statement." },
      { id: `n${Date.now() + 1}`, timestamp: "Just now", text: "Industry associations welcomed the passage of the Bill, calling it a \"defining moment\" for digital India." },
    ];
    setUpdates((prev) => [...sample, ...prev]);
  };

  const isLive = live.isLive;
  const programTitle = live.programTitle;
  const programDesc = live.programDesc;
  const viewerCount = live.viewerCount;

  const relatedStories = (articles.length > 0 ? articles : ARTICLES_LIST).filter(
    (a) => a.category === "politics" || a.tags.includes("Parliament")
  ).slice(0, 3);


  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">{mounted ? t(language, "misc.liveNews") : "Live News"}</h1>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-live text-white font-ui text-xs font-bold uppercase tracking-wide">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {mounted ? t(language, "misc.onAir") : "On Air"}
            </span>
          )}
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold transition-colors">
            <Bell className="h-3.5 w-3.5" />
            {mounted ? t(language, "misc.notifyMe") : "Notify me"}
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold transition-colors">
            <Share2 className="h-3.5 w-3.5" />
            {mounted ? t(language, "misc.share") : "Share"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Main column */}
        <div>
          {/* YouTube embed */}
          <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4 relative">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop&q=80"
              alt="Live broadcast"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                className="h-20 w-20 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
                aria-label="Play live stream"
              >
                <Play className="h-9 w-9 text-foreground ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded bg-live text-white font-ui text-xs font-bold uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Live
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur text-white font-ui text-xs">
              <Users className="h-3 w-3" />
              <span>{viewerCount.toLocaleString()}{mounted ? t(language, "misc.watching") : " watching"}</span>
            </div>
          </div>

          {/* Program info */}
          <div className="mb-6">
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
              NewsVarta Live · Special Coverage
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight mb-2">
              {programTitle}
            </h2>
            <p className="font-serif text-base text-ink-secondary leading-relaxed">
              {programDesc}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 font-ui text-xs text-ink-tertiary">
              <span>On air since 8:00 AM</span>
              <span aria-hidden>·</span>
              <span>Today, July 23</span>
              <span aria-hidden>·</span>
              <span>11 hours of coverage</span>
            </div>
          </div>

          {/* Mobile: live updates below */}
          <div className="lg:hidden">
            <LiveUpdatesTimeline
              updates={updates}
              newUpdateCount={newUpdateCount}
              onShowNew={showNewUpdates}
              language={language}
              mounted={mounted}
            />
          </div>

          {/* Related stories */}
          <div className="mt-10">
            <h3 className="h-section mb-5 border-b border-border pb-3">{mounted ? t(language, "section.relatedStories") : "Related Stories"}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStories.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>

          {/* Upcoming broadcasts */}
          <div className="mt-10">
            <h3 className="h-section mb-5 border-b border-border pb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand" />
              {mounted ? t(language, "misc.upcomingBroadcasts") : "Upcoming Broadcasts"}
            </h3>
            <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {[
                { time: "Tomorrow · 9:00 AM", title: "Morning Briefing with the Editorial Desk", desc: "The day's top stories, contextualised in 30 minutes." },
                { time: "Tomorrow · 1:00 PM", title: "Midday Market Wrap", desc: "Live coverage of the closing bell with our Markets Editor." },
                { time: "Fri · 6:00 PM", title: "The Week That Was", desc: "A weekly review of the stories that defined the week." },
              ].map((b) => (
                <div
                  key={b.title}
                  className="p-4 hover:bg-surface-alt transition-colors flex items-start gap-4"
                >
                  <div className="shrink-0 text-right">
                    <p className="font-ui text-[11px] font-bold uppercase tracking-wide text-brand">
                      {b.time.split("·")[0]}
                    </p>
                    <p className="font-ui text-xs text-ink-tertiary mt-0.5">
                      {b.time.split("·")[1]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-base font-bold leading-tight">
                      {b.title}
                    </h4>
                    <p className="font-serif text-sm text-ink-secondary mt-1">
                      {b.desc}
                    </p>
                  </div>
                  <button className="shrink-0 px-3 h-8 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold transition-colors flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {mounted ? t(language, "misc.remind") : "Remind"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: live updates (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <LiveUpdatesTimeline
              updates={updates}
              newUpdateCount={newUpdateCount}
              onShowNew={showNewUpdates}
              language={language}
              mounted={mounted}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function LiveUpdatesTimeline({
  language,
  mounted,
  updates,
  newUpdateCount,
  onShowNew,
}: {
  updates: typeof LIVE_UPDATES;
  newUpdateCount: number;
  onShowNew: () => void;
  language: any;
  mounted: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          {mounted ? t(language, "misc.liveUpdates") : "Live Updates"}
          <span className="relative flex h-2 w-2">
            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
        </h3>
      </div>

      {newUpdateCount > 0 && (
        <button
          onClick={onShowNew}
          className="w-full mb-3 px-3 py-2 rounded-md bg-brand/10 hover:bg-brand/20 text-brand font-ui text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          {newUpdateCount} new update{newUpdateCount > 1 ? "s" : ""} — tap to view
          <ChevronRight className="h-3 w-3" />
        </button>
      )}

      <div className="border-l-2 border-border pl-4 space-y-4 max-h-[600px] overflow-y-auto styled-scroll pr-2">
        <AnimatePresence initial={false}>
          {updates.map((u, i) => (
            <motion.div
              key={u.id}
              initial={u.isNew ? { opacity: 0, y: -8, backgroundColor: "rgb(254, 243, 199)" } : false}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <span
                className={`absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full ${
                  i === 0 ? "bg-live" : "bg-ink-tertiary"
                } ring-4 ring-background`}
              />
              <p className="font-ui text-[11px] font-bold text-brand tabular-nums">
                {u.timestamp}
              </p>
              <p className="font-serif text-sm text-ink leading-relaxed mt-0.5">
                {u.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useStore } from "@/lib/store";
import { Play, Users } from "lucide-react";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

export function LiveSection() {
  const { navigate, isLive, language } = useStore();
  const t = useT();
  const mounted = useHydrated();

  if (!mounted) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="rounded-xl overflow-hidden bg-foreground text-background">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
          {/* Video / Thumbnail */}
          <button
            onClick={() => navigate({ type: "section", slug: "live" })}
            className="relative aspect-video md:aspect-auto md:min-h-[340px] group"
          >
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop&q=80"
              alt={mounted ? t("aria.liveBroadcast") : "Live news broadcast"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-live text-white font-ui text-xs font-bold uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {isLive ? t("live.liveNow") : t("live.offAir")}
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/95 group-hover:bg-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-105">
                <Play className="h-7 w-7 md:h-9 md:w-9 text-foreground ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Viewer count */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur text-white font-ui text-xs">
              <Users className="h-3 w-3" />
              <span>{language === "hi" ? "४,२८७" : "4,287"} {t("misc.watching")}</span>
            </div>
          </button>

          {/* Info */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand-light mb-2">
              {t("live.liveStream")}
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold leading-tight mb-3">
              {t("live.title")}
            </h3>
            <p className="font-serif text-base text-background/80 mb-5">
              {t("live.desc")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate({ type: "section", slug: "live" })}
                className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                {t("live.watchLive")}
              </button>
              <div className="font-ui text-xs text-background/70">
                <p>{t("live.onAirSince")}</p>
                <p>{t("live.coverage")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

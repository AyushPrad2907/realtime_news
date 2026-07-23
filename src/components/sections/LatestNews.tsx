"use client";

import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { AdBanner } from "./AdBanner";
import { useMemo } from "react";
import { useT } from "@/hooks/use-t";

interface LatestNewsProps {
  articles: Article[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  const { navigate } = useStore();
  const t = useT();

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ),
    [articles]
  );

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section flex items-center gap-2">
          {t("section.latestNews")}
          <span className="relative flex h-2 w-2">
            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-success" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
        </h2>
        <button
          onClick={() => navigate({ type: "section", slug: "national" })}
          className="font-ui text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          {t("section.viewAll")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-0 divide-y divide-border">
        {sorted.slice(0, 8).map((article, i) => (
          <div key={article.id} className="contents">
            <div className="pb-1">
              <ArticleCard article={article} variant="list" showImage={false} />
            </div>
            {i === 4 && (
              <div className="hidden md:flex md:col-span-2 py-4">
                <AdBanner format="leaderboard" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

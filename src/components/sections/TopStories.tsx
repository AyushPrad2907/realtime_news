"use client";

import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArrowRight } from "lucide-react";

interface TopStoriesProps {
  articles: Article[];
}

export function TopStories({ articles }: TopStoriesProps) {
  const { navigate } = useStore();
  if (articles.length === 0) return null;

  const [lead, ...rest] = articles;

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section">Top Stories</h2>
        <button
          onClick={() => navigate({ type: "section", slug: "national" })}
          className="font-ui text-xs font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
        <div className="shrink-0 w-[280px] snap-start">
          <ArticleCard article={lead} showStandfirst />
        </div>
        {rest.slice(0, 4).map((a) => (
          <div key={a.id} className="shrink-0 w-[280px] snap-start">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>

      {/* Desktop: 3-column grid with lead article */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
        <div className="col-span-1 row-span-2">
          <ArticleCard article={lead} showStandfirst className="h-full" />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-6 lg:gap-8">
          {rest.slice(0, 4).map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

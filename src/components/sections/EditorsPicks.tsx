"use client";

import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { PenLine } from "lucide-react";
import { useT } from "@/hooks/use-t";

interface EditorsPicksProps {
  articles: Article[];
}

export function EditorsPicks({ articles }: EditorsPicksProps) {
  const t = useT();
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;

  return (
    <section className="mb-12 md:mb-16 -mx-4 md:mx-0 px-4 md:px-0 md:border-l-4 md:border-brand md:pl-6 lg:pl-8 bg-surface-alt md:bg-transparent md:rounded-r-md py-6 md:py-0">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section flex items-center gap-2">
          <PenLine className="h-5 w-5 text-brand" />
          {t("section.editorsPicks")}
        </h2>
      </div>

      {/* Mobile: stack */}
      <div className="md:hidden space-y-6">
        <ArticleCard article={lead} showStandfirst />
        {rest.slice(0, 3).map((a) => (
          <ArticleCard key={a.id} article={a} variant="compact" />
        ))}
      </div>

      {/* Desktop: lead + 3 small */}
      <div className="hidden md:grid md:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
        <ArticleCard article={lead} showStandfirst />
        <div className="flex flex-col gap-5">
          {rest.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

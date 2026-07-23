"use client";

import { useStore } from "@/lib/store";
import type { Article, CategorySlug } from "@/lib/types";
import { getCategory } from "@/lib/utils-news";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArrowRight } from "lucide-react";
import { useT } from "@/hooks/use-t";

interface CategoryRibbonProps {
  category: CategorySlug;
  articles: Article[];
}

export function CategoryRibbon({ category, articles }: CategoryRibbonProps) {
  const { navigate } = useStore();
  const t = useT();
  const cat = getCategory(category);

  if (articles.length === 0) return null;

  const categoryTitle = t(`cat.${category}` as any) || cat.name;

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <span
            className="h-5 w-1 rounded-full"
            style={{ background: cat.colorVar }}
            aria-hidden
          />
          <h2 className="h-section">{categoryTitle}</h2>
        </div>
        <button
          onClick={() => navigate({ type: "category", slug: category })}
          className="font-ui text-xs font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          {t("section.viewAll")}
        </button>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
        {articles.slice(0, 5).map((a) => (
          <div key={a.id} className="shrink-0 w-[260px] snap-start">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8">
        {articles.slice(0, 4).map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

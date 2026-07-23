"use client";

import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { getCategory, getAuthor } from "@/lib/utils-news";
import { Clock, Headphones, ArrowRight } from "lucide-react";
import { TimeAgo } from "@/components/TimeAgo";
import { useT } from "@/hooks/use-t";

interface HeroStoryProps {
  article: Article;
}

export function HeroStory({ article }: HeroStoryProps) {
  const { navigate } = useStore();
  const t = useT();
  const cat = getCategory(article.category);
  const author = getAuthor(article.authorId);
  const categoryTitle = t(`cat.${article.category}` as any) || cat.name;

  return (
    <section className="mb-10 md:mb-16">
      <article
        onClick={() => navigate({ type: "article", slug: article.slug })}
        className="group cursor-pointer relative overflow-hidden rounded-lg md:rounded-xl"
      >
        {/* Background image */}
        <div className="aspect-[16/10] md:aspect-[16/9] relative">
          <img
            src={article.heroImage}
            alt={article.heroCaption ?? article.title}
            className="absolute inset-0 h-full w-full object-cover img-zoom"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/85 md:via-black/45 md:to-transparent" />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-4 md:p-10">
          <div className="md:max-w-2xl">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <span
                className="px-2 py-0.5 md:px-2.5 md:py-1 rounded text-white font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-wide"
                style={{ background: cat.colorVar }}
              >
                {categoryTitle}
              </span>
              {article.isBreaking && (
                <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-live text-white font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-wide flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  {t("nav.breaking")}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-extrabold leading-[1.1] text-white tracking-tight line-clamp-3 md:line-clamp-4">
              {article.title}
            </h1>

            <p className="hidden md:block font-serif text-lg md:text-xl text-white/85 mt-3 md:mt-4 line-clamp-2 max-w-xl">
              {article.standfirst}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 md:mt-5 font-ui text-xs md:text-sm text-white/80">
              <span className="font-medium text-white/95">{t("article.by")} {author.name}</span>
              <span aria-hidden>·</span>
              <span><TimeAgo iso={article.publishedAt} /></span>
              <span aria-hidden className="hidden md:inline">·</span>
              <span className="hidden md:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTime} {t("article.minRead")}
              </span>
              {article.hasAudio && (
                <>
                  <span aria-hidden className="hidden md:inline">·</span>
                  <span className="hidden md:flex items-center gap-1">
                    <Headphones className="h-3 w-3" />
                    Audio
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 md:mt-6 inline-flex items-center gap-1.5 text-white font-ui text-xs md:text-sm font-semibold group-hover:gap-2.5 transition-all">
              {t("section.viewAll")} <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

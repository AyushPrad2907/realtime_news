"use client";

import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { getCategory, getAuthor } from "@/lib/utils-news";
import { Clock, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeAgo } from "@/components/TimeAgo";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "list" | "hero-side" | "small";
  showImage?: boolean;
  showStandfirst?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = "default",
  showImage = true,
  showStandfirst = false,
  className,
}: ArticleCardProps) {
  const { navigate } = useStore();
  const t = useT();
  const mounted = useHydrated();
  const cat = getCategory(article.category);
  const author = getAuthor(article.authorId);
  const categoryTitle = t(`cat.${article.category}` as any) || cat.name;

  const go = () => navigate({ type: "article", slug: article.slug });

  if (!mounted) return null;

  if (variant === "list") {
    return (
      <button
        onClick={go}
        className="group w-full flex items-center gap-3 md:gap-4 py-3 border-b border-border text-left"
      >
        <div className="shrink-0 font-ui text-xs text-ink-tertiary tabular-nums w-16">
          <TimeAgo iso={article.publishedAt} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-[15px] md:text-base font-bold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
            {article.title}
          </p>
          <p className="font-ui text-[11px] text-ink-tertiary mt-1">
            {categoryTitle} · {article.readingTime} {t("article.minRead")}
          </p>
        </div>
        {showImage && (
          <img
            src={article.heroImage}
            alt=""
            loading="lazy"
            className="h-12 w-16 md:h-14 md:w-20 rounded object-cover shrink-0"
          />
        )}
      </button>
    );
  }

  if (variant === "small") {
    return (
      <button
        onClick={go}
        className="group block w-full text-left"
      >
        {showImage && (
          <div className="overflow-hidden rounded-md mb-2.5 aspect-[16/9] bg-muted">
            <img
              src={article.heroImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover img-zoom"
            />
          </div>
        )}
        <div
          className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white mb-1.5"
          style={{ background: cat.colorVar }}
        >
          {categoryTitle}
        </div>
        <h4 className="font-display text-sm font-bold leading-snug line-clamp-3 group-hover:text-brand transition-colors">
          {article.title}
        </h4>
        <p className="font-ui text-[11px] text-ink-tertiary mt-1.5">
          <TimeAgo iso={article.publishedAt} />
        </p>
      </button>
    );
  }

  if (variant === "compact") {
    // Compact = horizontal layout with thumb on the right
    return (
      <button
        onClick={go}
        className="group block w-full text-left"
      >
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div
              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white mb-1.5"
              style={{ background: cat.colorVar }}
            >
              {categoryTitle}
            </div>
            <h4 className="font-display text-[15px] font-bold leading-snug line-clamp-3 group-hover:text-brand transition-colors">
              {article.title}
            </h4>
            <p className="font-ui text-[11px] text-ink-tertiary mt-1.5">
              <TimeAgo iso={article.publishedAt} /> · {article.readingTime} {t("article.minRead")}
            </p>
          </div>
          {showImage && (
            <div className="shrink-0 overflow-hidden rounded-md aspect-square w-20 h-20 bg-muted">
              <img
                src={article.heroImage}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover img-zoom"
              />
            </div>
          )}
        </div>
      </button>
    );
  }

  // Default: standard article card (image top, content below)
  return (
    <article
      onClick={go}
      className={cn(
        "group cursor-pointer flex flex-col card-hover",
        className
      )}
    >
      {showImage && (
        <div className="overflow-hidden rounded-md mb-3 aspect-[16/9] bg-muted">
          <img
            src={article.heroImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover img-zoom"
          />
        </div>
      )}
      <div
        className="inline-block self-start px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white mb-2"
        style={{ background: cat.colorVar }}
      >
        {categoryTitle}
      </div>
      <h3 className="font-display text-lg md:text-xl font-bold leading-tight line-clamp-3 group-hover:text-brand transition-colors">
        {article.title}
      </h3>
      {showStandfirst && (
        <p className="font-serif text-[15px] text-ink-secondary mt-2 line-clamp-2">
          {article.standfirst}
        </p>
      )}
      <div className="flex items-center gap-2 mt-3 font-ui text-[11px] text-ink-tertiary">
        <span>{author.name}</span>
        <span aria-hidden>·</span>
        <span><TimeAgo iso={article.publishedAt} /></span>
        <span aria-hidden>·</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {article.readingTime} {t("article.minRead")}
        </span>
        {article.hasAudio && (
          <>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              {t("misc.audio")}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

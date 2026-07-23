"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { fetchArticles } from "@/lib/api-client";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { ArticleCard } from "@/components/cards/ArticleCard";
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DateArchivePageProps {
  date: string; // YYYY-MM-DD
}

export function DateArchivePage({ date }: DateArchivePageProps) {
  const { navigate } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const dateObj = new Date(date + "T00:00:00.000Z");
  const dateLabel = dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Previous/next day navigation
  const prevDate = new Date(dateObj);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(dateObj);
  nextDate.setDate(nextDate.getDate() + 1);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const isNextDisabled = nextDate > today;

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      fetchArticles({ date, limit: 50, sort: "newest" })
        .then((data) => {
          if (!cancelled) {
            setArticles(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            // Fallback to mock data filtered by date
            const filtered = ARTICLES_LIST.filter((a) => {
              const pubDate = new Date(a.publishedAt).toISOString().slice(0, 10);
              return pubDate === date;
            });
            setArticles(filtered);
            setLoading(false);
          }
        });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [date]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-ui text-xs text-ink-tertiary mb-4">
        <button
          onClick={() => navigate({ type: "home" })}
          className="hover:text-brand transition-colors"
        >
          Home
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary">Archive</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary">{dateLabel}</span>
      </nav>

      <button
        onClick={() => navigate({ type: "home" })}
        className="inline-flex items-center gap-1 font-ui text-xs text-ink-secondary hover:text-brand transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to homepage
      </button>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-md bg-brand/10 text-brand flex items-center justify-center">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
              Date Archive
            </p>
            <h1 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {dateLabel}
            </h1>
          </div>
        </div>
        <p className="font-serif text-base text-ink-secondary mt-2">
          {loading
            ? "Loading articles…"
            : articles.length === 0
            ? "No articles were published on this date."
            : `${articles.length} ${articles.length === 1 ? "article" : "articles"} published on this date.`}
        </p>
      </header>

      {/* Day navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate({ type: "date-archive", date: fmt(prevDate) })}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous day</span>
          <span className="sm:hidden">Prev</span>
        </button>
        <span className="font-ui text-xs text-ink-tertiary">
          {prevDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          {" — "}
          {isNextDisabled
            ? "Today"
            : nextDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
        <button
          onClick={() => !isNextDisabled && navigate({ type: "date-archive", date: fmt(nextDate) })}
          disabled={isNextDisabled}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 h-10 rounded-md border font-ui text-sm font-semibold transition-colors",
            isNextDisabled
              ? "border-border opacity-40 cursor-not-allowed"
              : "border-border hover:bg-muted"
          )}
        >
          <span className="hidden sm:inline">Next day</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Articles */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="h-12 w-12 text-ink-tertiary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">
            No articles from this date
          </h2>
          <p className="font-ui text-sm text-ink-secondary mb-6">
            Try browsing a different day, or explore our latest coverage.
          </p>
          <button
            onClick={() => navigate({ type: "home" })}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
          >
            Back to homepage
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

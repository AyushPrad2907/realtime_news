"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
import { ARTICLES_LIST, PODCAST_EPISODES, CATEGORIES, TRENDING_TOPICS } from "@/lib/mock-data";
import { fetchSearch } from "@/lib/api-client";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { Search as SearchIcon, X, TrendingUp, FileText, Headphones, Loader2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { Article, PodcastEpisode } from "@/lib/types";

type FilterType = "all" | "articles" | "podcasts";
type DateFilter = "anytime" | "today" | "week" | "month";

interface SearchPageProps {
  query: string;
}

export function SearchPage({ query: initialQuery }: SearchPageProps) {
  const mounted = useHydrated();
  const { navigate, language } = useStore();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<FilterType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("anytime");
  const [sort, setSort] = useState<"relevance" | "newest" | "popular">("relevance");
  const [apiArticles, setApiArticles] = useState<Article[]>([]);
  const [apiPodcasts, setApiPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch from API when query changes
  useEffect(() => {
    if (query.trim().length < 2) {
      setApiArticles([]);
      setApiPodcasts([]);
      return;
    }
    let cancelled = false;
    const id = setTimeout(() => {
      setLoading(true);
      fetchSearch(query).then((data) => {
        if (cancelled) return;
        setApiArticles(data.articles);
        setApiPodcasts(data.podcasts);
        setLoading(false);
      });
    }, 200); // debounce
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  // Client-side date + sort filtering on top of API results
  const matchedArticles = useMemo(() => {
    let results = apiArticles;
    const now = Date.now();
    if (dateFilter === "today") {
      results = results.filter(
        (a) => now - new Date(a.publishedAt).getTime() < 86400000
      );
    } else if (dateFilter === "week") {
      results = results.filter(
        (a) => now - new Date(a.publishedAt).getTime() < 86400000 * 7
      );
    } else if (dateFilter === "month") {
      results = results.filter(
        (a) => now - new Date(a.publishedAt).getTime() < 86400000 * 30
      );
    }

    if (sort === "newest") {
      results = [...results].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sort === "popular") {
      results = [...results].sort((a, b) => b.views - a.views);
    }
    return results;
  }, [apiArticles, dateFilter, sort]);

  const matchedPodcasts = useMemo(() => {
    if (type === "articles") return [];
    return apiPodcasts;
  }, [apiPodcasts, type]);

  const matchedCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const totalResults = matchedArticles.length + matchedPodcasts.length;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Already live-filtered; this is a no-op but keeps form semantics
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8">
      {/* Search input */}
      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex items-center gap-3 px-4 h-14 rounded-lg border border-border focus-within:ring-2 focus-within:ring-brand bg-background">
          <SearchIcon className="h-5 w-5 text-ink-tertiary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mounted ? t(language, "misc.searchPlaceholder") : "Search articles, podcasts, topics..."}
            autoFocus
            className="flex-1 bg-transparent outline-none font-ui text-base placeholder:text-ink-tertiary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Header */}
      <div className="mb-6">
        {query.trim() === "" ? (
          <div className="py-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
              {mounted ? t(language, "search.label") : "Search"} The National Dispatch
            </h1>
            <p className="font-serif text-base text-ink-secondary mb-6 max-w-xl">
              {mounted ? t(language, "misc.searchDesc") : "Find articles, podcasts, and topics across our archive. Use the filters below to refine by date, type, or category."}
            </p>
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> {mounted ? t(language, "misc.trendingSearches") : "Trending searches"}
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-foreground hover:text-background font-ui text-xs transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-display text-xl md:text-2xl font-bold">
              {totalResults > 0
                ? `${totalResults} result${totalResults > 1 ? "s" : ""} for “${query}”`
                : `No results for “${query}”`}
            </h1>

            {matchedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {matchedCategories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => navigate({ type: "category", slug: c.slug })}
                    className="px-3 py-1 rounded-full font-ui text-xs font-medium text-white"
                    style={{ background: c.colorVar }}
                  >
                    {mounted ? (language === "hi" ? `${c.name} देखें →` : `Browse ${c.name} →`) : `Browse ${c.name} →`}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {query.trim() !== "" && totalResults > 0 && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-border">
            {/* Type filter */}
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-muted">
              {([
                { key: "all", label: "All", icon: null },
                { key: "articles", label: "Articles", icon: FileText },
                { key: "podcasts", label: "Podcasts", icon: Headphones },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-ui text-xs font-medium transition-colors",
                    type === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-ink-secondary hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {label}
                </button>
              ))}
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {([
                { key: "anytime", label: "Anytime" },
                { key: "today", label: "Today" },
                { key: "week", label: "This Week" },
                { key: "month", label: "This Month" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setDateFilter(key)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-md font-ui text-xs font-medium transition-colors",
                    dateFilter === key
                      ? "bg-foreground text-background"
                      : "text-ink-secondary hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-ui text-xs text-ink-tertiary">{mounted ? t(language, "misc.sort") : "Sort:"}</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="h-8 px-2 rounded-md border border-border bg-background font-ui text-xs focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest first</option>
                <option value="popular">Most read</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6 mb-12">
            {type !== "podcasts" && matchedArticles.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" />
                  Articles
                  <span className="font-ui text-xs font-normal text-ink-tertiary">
                    ({matchedArticles.length})
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {matchedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </section>
            )}

            {type !== "articles" && matchedPodcasts.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-brand" />
                  Podcasts
                  <span className="font-ui text-xs font-normal text-ink-tertiary">
                    ({matchedPodcasts.length})
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                  {matchedPodcasts.map((ep) => (
                    <PodcastCard key={ep.id} episode={ep} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}

      {query.trim() !== "" && totalResults === 0 && (
        <div className="py-16 text-center max-w-md mx-auto">
          <SearchIcon className="h-12 w-12 text-ink-tertiary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">{mounted ? t(language, "search.noResults") : "No results found"}</h2>
          <p className="font-ui text-sm text-ink-secondary mb-6">
            We couldn&rsquo;t find anything matching &ldquo;{query}&rdquo;. Try a
            different term, or check out our trending topics below.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TRENDING_TOPICS.slice(0, 6).map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="px-3 py-1.5 rounded-full bg-muted hover:bg-foreground hover:text-background font-ui text-xs transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate({ type: "home" })}
            className="mt-6 inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
          >
            {mounted ? t(language, "misc.browseHomepage") : "Browse homepage"}
          </button>
        </div>
      )}
    </div>
  );
}

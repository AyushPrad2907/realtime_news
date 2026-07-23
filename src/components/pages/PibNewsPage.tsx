"use client";

import { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Calendar, Search, RefreshCw, ExternalLink, FileText, ChevronRight, X, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface PibArticle {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
}

import { useT } from "@/hooks/use-t";

export function PibNewsPage() {
  const { navigate } = useStore();
  const t = useT();
  const [articles, setArticles] = useState<PibArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Reader states
  const [selectedArticleUrl, setSelectedArticleUrl] = useState<string | null>(null);
  const [selectedArticleTitle, setSelectedArticleTitle] = useState<string>("");
  const [articleHtml, setArticleHtml] = useState<string | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");

  const fetchFeed = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/news");
      if (!res.ok) {
        throw new Error("Unable to fetch official releases. Please try again later.");
      }
      const data = await res.json();
      setArticles(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load press releases.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        (a.contentSnippet && a.contentSnippet.toLowerCase().includes(query))
    );
  }, [articles, searchQuery]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Fetch full article content from scraper API
  const openArticleReader = async (url: string, title: string) => {
    setSelectedArticleUrl(url);
    setSelectedArticleTitle(title);
    setArticleHtml(null);
    setArticleLoading(true);
    setArticleError(null);

    try {
      const res = await fetch(`/api/news/article?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        throw new Error("Failed to load full release content from PIB portal.");
      }
      const data = await res.json();
      setArticleHtml(data.html || "");
    } catch (err: any) {
      setArticleError(err.message || "Could not retrieve the full release content.");
    } finally {
      setArticleLoading(false);
    }
  };

  const closeArticleReader = () => {
    setSelectedArticleUrl(null);
    setArticleHtml(null);
    setArticleError(null);
  };

  const adjustFontSize = (direction: "in" | "out") => {
    const sizes: ("sm" | "base" | "lg" | "xl")[] = ["sm", "base", "lg", "xl"];
    const currentIndex = sizes.indexOf(fontSize);
    if (direction === "in" && currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    } else if (direction === "out" && currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  // If reader is active, render the Reader view
  if (selectedArticleUrl) {
    return (
      <div className="mx-auto max-w-[900px] px-4 md:px-8 pt-4 md:pt-8 animate-in slide-in-from-right duration-300">
        {/* Reader Nav Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
          <button
            onClick={closeArticleReader}
            className="inline-flex items-center gap-1.5 text-sm font-ui font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Releases
          </button>

          <div className="flex items-center gap-3">
            {/* Font resizing */}
            <div className="flex items-center border border-border rounded-md bg-muted p-0.5">
              <button
                onClick={() => adjustFontSize("out")}
                disabled={fontSize === "sm"}
                className="p-1.5 rounded hover:bg-background text-ink-secondary disabled:opacity-30"
                title="Decrease font size"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-[10px] font-bold font-ui px-2 text-ink-tertiary select-none uppercase">
                Size
              </span>
              <button
                onClick={() => adjustFontSize("in")}
                disabled={fontSize === "xl"}
                className="p-1.5 rounded hover:bg-background text-ink-secondary disabled:opacity-30"
                title="Increase font size"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* External link fallback */}
            <a
              href={selectedArticleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 h-8 rounded border border-border text-xs font-semibold hover:bg-muted transition-colors text-ink-secondary"
            >
              Open Official Link <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Reader Content Area */}
        {articleLoading ? (
          <div className="space-y-6 py-12 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-8 bg-muted rounded w-4/5 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
            <div className="space-y-3 pt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-muted rounded w-full" />
              ))}
            </div>
          </div>
        ) : articleError ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30">
            <FileText className="h-12 w-12 mx-auto text-destructive/80 mb-4" />
            <h3 className="font-display text-lg font-bold mb-2">Could not load release</h3>
            <p className="text-sm text-ink-secondary max-w-md mx-auto mb-6">{articleError}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => openArticleReader(selectedArticleUrl, selectedArticleTitle)}
                className="px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors"
              >
                Retry
              </button>
              <a
                href={selectedArticleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md border border-border font-ui text-sm font-semibold hover:bg-muted transition-colors"
              >
                View on PIB Website <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <article className="pb-20">
            {/* Custom stylesheet scoped to the fetched content to handle dynamic rendering styles */}
            <div
              className={cn(
                "pib-reader-content font-serif leading-relaxed text-foreground select-text selection:bg-brand/20",
                fontSize === "sm" && "text-sm",
                fontSize === "base" && "text-base md:text-lg",
                fontSize === "lg" && "text-lg md:text-xl",
                fontSize === "xl" && "text-xl md:text-2xl"
              )}
              dangerouslySetInnerHTML={{ __html: articleHtml || "" }}
            />
            
            {/* Inline helper styles to reset generic styles inside retrieved tables */}
            <style jsx global>{`
              .pib-reader-content table {
                width: 100% !important;
                border-collapse: collapse;
              }
              .pib-reader-content td {
                color: inherit !important;
                font-family: inherit !important;
                text-align: left !important;
              }
              .pib-reader-content p {
                margin-bottom: 1.5em;
                text-align: justify;
                line-height: 1.75;
                font-family: inherit !important;
                font-size: inherit !important;
                color: inherit !important;
                background-color: transparent !important;
              }
              .pib-reader-content span {
                font-family: inherit !important;
                font-size: inherit !important;
                color: inherit !important;
                background-color: transparent !important;
              }
              .pib-reader-content div {
                font-family: inherit !important;
                color: inherit !important;
              }
              /* Align Ministry / Dept Headers */
              .pib-reader-content div[style*="font-size: 30px"],
              .pib-reader-content div[style*="font-size:30px"] {
                font-family: var(--font-playfair), serif !important;
                font-weight: 800 !important;
                font-size: 1.8rem !important;
                line-height: 1.3 !important;
                margin-top: 10px;
                margin-bottom: 20px;
                text-align: center !important;
              }
              .pib-reader-content td[style*="text-align: center"],
              .pib-reader-content td[style*="text-align:center"] {
                font-family: var(--font-inter), sans-serif !important;
                font-weight: 600 !important;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--brand) !important;
                font-size: 0.95rem !important;
                padding-bottom: 15px;
              }
            `}</style>
          </article>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-8 animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-8 md:mb-10 pb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-8 w-1.5 rounded-full bg-brand" aria-hidden />
              <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
                {t("section.govtReleases")}
              </h1>
            </div>
            <p className="font-serif text-lg text-ink-secondary max-w-2xl">
              Live updates directly from the Press Information Bureau (PIB), Government of India.
            </p>
          </div>
          
          <button
            onClick={() => fetchFeed(true)}
            disabled={loading || refreshing}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </button>
        </div>

        {/* Search and Metadata */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
            <input
              type="text"
              placeholder="Filter by keyword (e.g. Ministry, PM, cabinet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
            />
          </div>
          <span className="font-ui text-xs text-ink-tertiary">
            {filteredArticles.length} {filteredArticles.length === 1 ? "release" : "releases"} found
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 border border-border rounded-lg bg-card/50 space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30 mb-12">
          <FileText className="h-12 w-12 mx-auto text-destructive/80 mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">Failed to load feed</h3>
          <p className="text-sm text-ink-secondary max-w-md mx-auto mb-6">{error}</p>
          <button
            onClick={() => fetchFeed()}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card/30 mb-12">
          <Search className="h-12 w-12 mx-auto text-ink-tertiary mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">No releases found</h3>
          <p className="text-sm text-ink-secondary max-w-md mx-auto">
            {searchQuery ? "Try searching for a different keyword." : "The PIB RSS feed is currently empty. Please check back later."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 mb-12">
          {filteredArticles.map((article, index) => (
            <article
              key={index}
              className="group p-6 border border-border rounded-lg bg-card hover:bg-muted/30 transition-all duration-300 flex flex-col md:flex-row gap-4 md:items-start justify-between cursor-pointer"
              onClick={() => openArticleReader(article.link, article.title)}
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-ui text-ink-secondary">
                  <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-semibold tracking-wider uppercase text-[10px]">
                    Official Release
                  </span>
                  <span className="flex items-center gap-1 text-ink-tertiary">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.pubDate)}
                  </span>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-brand transition-colors duration-200">
                  {article.title}
                </h2>

                {article.contentSnippet && (
                  <p className="font-serif text-sm md:text-base text-ink-secondary leading-relaxed line-clamp-3">
                    {article.contentSnippet}
                  </p>
                )}
              </div>

              <div className="self-end md:self-start pt-2 md:pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid triggering the parent click handler
                    openArticleReader(article.link, article.title);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 h-9 rounded-md bg-foreground text-background font-ui text-xs font-bold hover:bg-brand hover:text-white transition-all duration-200 group-hover:translate-x-0.5"
                >
                  Read Release
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer disclaimer */}
      <footer className="py-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-ui text-ink-tertiary mb-12">
        <p>Source: Press Information Bureau (PIB), Government of India</p>
        <button
          onClick={() => navigate({ type: "home" })}
          className="inline-flex items-center gap-1 hover:text-brand font-semibold transition-colors"
        >
          Back to Newsvarta homepage <ChevronRight className="h-3 w-3" />
        </button>
      </footer>
    </div>
  );
}

"use client";

import { useStore } from "@/lib/store";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { CategoryBadge } from "@/components/cards/CategoryBadge";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { AdBanner } from "@/components/sections/AdBanner";
import { getAuthor, formatDate, formatViews } from "@/lib/utils-news";
import { TimeAgo } from "@/components/TimeAgo";
import { fetchArticle } from "@/lib/api-client";
import {
  Clock,
  Headphones,
  Eye,
  Share2,
  Twitter,
  Facebook,
  Send,
  Link2,
  Mail,
  Play,
  Pause,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import type { Article, Author } from "@/lib/types";

interface ArticlePageProps {
  slug: string;
}

export function ArticlePage({ slug }: ArticlePageProps) {
  const { navigate, back, canGoBack, playEpisode, nowPlaying, isPlaying, togglePlay } = useStore();
  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState<Article | null>(
    () => ARTICLES_LIST.find((a) => a.slug === slug) ?? null
  );
  const [author, setAuthor] = useState<Author | null>(() =>
    article ? getAuthor(article.authorId) : null
  );
  const [loading, setLoading] = useState(!article);

  // Fetch fresh data from API (this also increments the view counter server-side)
  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      fetchArticle(slug).then((data) => {
        if (cancelled) return;
        if (data) {
          setArticle(data.article);
          setAuthor(data.author);
        } else {
          setArticle(null);
        }
        setLoading(false);
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [slug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    // Prefer mock list for related (we don't want to wait for another API call)
    return ARTICLES_LIST.filter(
      (a) => a.id !== article.id && a.category === article.category
    ).slice(0, 3);
  }, [article]);

  const nextArticle = useMemo(() => {
    if (!article) return null;
    const idx = ARTICLES_LIST.findIndex((a) => a.id === article.id);
    if (idx === -1 || idx === ARTICLES_LIST.length - 1) return ARTICLES_LIST[0];
    return ARTICLES_LIST[idx + 1];
  }, [article]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — The National Dispatch`;
    }
    return () => {
      document.title = "The National Dispatch";
    };
  }, [article]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  if (!article || !author) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Article not found</h1>
        <p className="font-ui text-sm text-ink-secondary mb-6">
          The article you&rsquo;re looking for may have been moved or removed.
        </p>
        <button
          onClick={() => navigate({ type: "home" })}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors"
        >
          Back to homepage
        </button>
      </div>
    );
  }

  const isCurrentAudio = nowPlaying?.id === `article-${article.id}`;
  const showArticleAudioPlay = !isCurrentAudio || !isPlaying;

  const onShare = (platform: string) => {
    if (platform === "copy") {
      const url = window.location.href;
      navigator.clipboard?.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.message(`Sharing to ${platform}…`, {
        description: "Demo mode — sharing would open the platform in a new tab.",
      });
    }
  };

  const playArticleAudio = () => {
    if (isCurrentAudio) {
      togglePlay();
    } else {
      // Use a podcast-style episode object for the mini-player
      playEpisode({
        id: `article-${article.id}`,
        slug: article.slug,
        seriesId: "article",
        title: article.title,
        description: article.standfirst,
        publishedAt: article.publishedAt,
        duration: article.audioDuration ?? "—",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverImage: article.heroImage,
        episodeNumber: 0,
        showNotes: [],
      });
    }
  };

  // Render article body with HTML
  const renderBody = () => {
    // Use dangerouslySetInnerHTML for the rich body content
    return (
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    );
  };

  return (
    <article className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 font-ui text-xs text-ink-tertiary mb-4"
      >
        <button
          onClick={() => navigate({ type: "home" })}
          className="hover:text-brand transition-colors"
        >
          Home
        </button>
        <ChevronRight className="h-3 w-3" />
        <button
          onClick={() => navigate({ type: "category", slug: article.category })}
          className="hover:text-brand transition-colors"
        >
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary line-clamp-1">{article.title}</span>
      </nav>

      {/* Back button */}
      {canGoBack() && (
        <button
          onClick={back}
          className="inline-flex items-center gap-1 font-ui text-xs text-ink-secondary hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
        {/* Main content */}
        <div className="min-w-0">
          {/* Category */}
          <CategoryBadge slug={article.category} size="md" />

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mt-4 mb-4">
            {article.title}
          </h1>

          {/* Standfirst */}
          <p className="font-serif text-lg md:text-xl text-ink-secondary leading-relaxed mb-6">
            {article.standfirst}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 border-y border-border font-ui text-xs text-ink-secondary mb-6">
            <div className="flex items-center gap-2">
              <img
                src={author.avatar}
                alt={author.name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="font-medium text-foreground">{author.name}</span>
            </div>
            <span aria-hidden>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span className="text-ink-tertiary">
                  Updated <TimeAgo iso={article.updatedAt ?? article.publishedAt} />
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} min read
            </span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(article.views)} views
            </span>
          </div>

          {/* Hero image */}
          <figure className="mb-6">
            <div className="overflow-hidden rounded-lg aspect-[16/9] bg-muted">
              <img
                src={article.heroImage}
                alt={article.heroCaption ?? article.title}
                className="h-full w-full object-cover"
              />
            </div>
            {(article.heroCaption || article.heroCredit) && (
              <figcaption className="mt-2 flex items-start justify-between gap-4 font-ui text-xs text-ink-tertiary italic">
                <span>{article.heroCaption}</span>
                {article.heroCredit && (
                  <span className="shrink-0">{article.heroCredit}</span>
                )}
              </figcaption>
            )}
          </figure>

          {/* Audio player */}
          {article.hasAudio && (
            <div className="mb-6 p-4 rounded-md bg-surface-alt border border-border/60 flex items-center gap-4">
              <button
                onClick={playArticleAudio}
                className="h-12 w-12 shrink-0 rounded-full bg-brand hover:bg-brand-dark text-white flex items-center justify-center transition-colors"
                aria-label={showArticleAudioPlay ? "Play audio version" : "Pause audio"}
              >
                {showArticleAudioPlay ? (
                  <Play className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Pause className="h-5 w-5" fill="currentColor" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-brand flex items-center gap-1.5">
                  <Headphones className="h-3 w-3" />
                  Listen to this article
                </p>
                <p className="font-display text-sm font-bold mt-0.5 line-clamp-1">
                  {article.title}
                </p>
                <p className="font-ui text-[11px] text-ink-tertiary">
                  Narrated · {article.audioDuration}
                </p>
              </div>
            </div>
          )}

          {/* Share row */}
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border">
            <span className="font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary mr-2 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </span>
            {[
              { Icon: Twitter, label: "Twitter", key: "Twitter" },
              { Icon: Facebook, label: "Facebook", key: "Facebook" },
              { Icon: Send, label: "Telegram", key: "Telegram" },
              { Icon: Mail, label: "Email", key: "Email" },
              { Icon: Link2, label: copied ? "Copied" : "Copy link", key: "copy" },
            ].map(({ Icon, label, key }) => (
              <button
                key={key}
                onClick={() => onShare(key)}
                className="p-2 rounded-md border border-border hover:bg-muted hover:border-foreground/30 transition-colors"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Article body */}
          <div className="prose-col">
            {renderBody()}

            {/* Mid-article ad */}
            <div className="my-8">
              <AdBanner format="leaderboard" />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
              Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate({ type: "search", query: tag })}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-foreground hover:text-background font-ui text-xs text-ink-secondary transition-colors"
                >
                  #{tag.replace(/\s+/g, "")}
                </button>
              ))}
            </div>
          </div>

          {/* Author card */}
          <div className="mt-8 p-5 md:p-6 rounded-lg bg-surface-alt flex gap-4 items-start">
            <img
              src={author.avatar}
              alt={author.name}
              className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover shrink-0"
            />
            <div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
                {author.role}
              </p>
              <h4 className="font-display text-lg font-bold">{author.name}</h4>
              <p className="font-serif text-sm text-ink-secondary mt-1.5 leading-relaxed">
                {author.bio}
              </p>
            </div>
          </div>

          {/* End ad */}
          <div className="mt-8">
            <AdBanner format="leaderboard" />
          </div>

          {/* Related */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="h-section mb-5 border-b border-border pb-3">
                You may also like
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}

          {/* Next article */}
          {nextArticle && (
            <button
              onClick={() => navigate({ type: "article", slug: nextArticle.slug })}
              className="mt-12 w-full text-left p-5 md:p-7 rounded-lg border border-border hover:border-foreground/30 hover:bg-surface-alt transition-colors group"
            >
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-2">
                Next Story
              </p>
              <h4 className="font-display text-xl md:text-2xl font-bold leading-tight line-clamp-2 group-hover:text-brand transition-colors">
                {nextArticle.title}
              </h4>
              <p className="font-serif text-sm text-ink-secondary mt-2 line-clamp-2">
                {nextArticle.standfirst}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 font-ui text-sm font-semibold text-brand">
                Continue reading
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )}
        </div>

        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <AdBanner format="rectangle" />

            <div>
              <h3 className="font-display text-base font-bold mb-3 border-b border-border pb-2">
                Most Read
              </h3>
              <ol className="space-y-4">
                {ARTICLES_LIST.slice()
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((a, i) => (
                    <li key={a.id}>
                      <button
                        onClick={() => navigate({ type: "article", slug: a.slug })}
                        className="group text-left flex gap-3"
                      >
                        <span className="font-display text-2xl font-extrabold text-ink-tertiary/40 group-hover:text-brand transition-colors tabular-nums leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-ui text-sm leading-snug line-clamp-3 group-hover:text-brand transition-colors">
                          {a.title}
                        </span>
                      </button>
                    </li>
                  ))}
              </ol>
            </div>

            <AdBanner format="rectangle" />
          </div>
        </aside>
      </div>
    </article>
  );
}

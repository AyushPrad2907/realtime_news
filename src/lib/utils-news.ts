import { CATEGORIES, AUTHORS, ARTICLES_LIST } from "./mock-data";
import type { Article, Author, CategorySlug } from "./types";

export function getCategory(slug: CategorySlug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

export function getAuthor(id: string): Author {
  return AUTHORS.find((a) => a.id === id) ?? AUTHORS[0];
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES_LIST.find((a) => a.slug === slug);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", opts ?? {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return "Yesterday";
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return formatDate(iso, { day: "numeric", month: "short" });
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function categoryColorClass(slug: CategorySlug): string {
  const map: Record<CategorySlug, string> = {
    politics: "bg-[var(--cat-politics)]",
    economy: "bg-[var(--cat-economy)]",
    sports: "bg-[var(--cat-sports)]",
    health: "bg-[var(--cat-health)]",
    technology: "bg-[var(--cat-technology)]",
    science: "bg-[var(--cat-science)]",
    entertainment: "bg-[var(--cat-entertainment)]",
    national: "bg-[var(--cat-national)]",
    international: "bg-[var(--cat-international)]",
  };
  return map[slug];
}

export function categoryTextOnColor(): string {
  return "text-white";
}

export type CategorySlug =
  | "politics"
  | "economy"
  | "sports"
  | "health"
  | "technology"
  | "science"
  | "entertainment"
  | "national"
  | "international";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  colorVar: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  standfirst: string;
  category: CategorySlug;
  tags: string[];
  states?: string[];
  authorId: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  views: number;
  heroImage: string;
  heroCaption?: string;
  heroCredit?: string;
  body: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isLive?: boolean;
  hasAudio?: boolean;
  audioDuration?: string;
  keyPoints?: string[];
}

export interface PodcastSeries {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  episodes: number;
  category: "News" | "Analysis" | "Interviews" | "Special Series";
}

export interface PodcastEpisode {
  id: string;
  slug: string;
  seriesId: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  audioUrl: string;
  coverImage: string;
  episodeNumber: number;
  showNotes: { time: string; label: string }[];
}

export interface LiveUpdate {
  id: string;
  timestamp: string;
  text: string;
  isNew?: boolean;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: "Editorial" | "Tech" | "Sales" | "Operations";
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  benefits: string[];
}

export type PageView =
  | { type: "home" }
  | { type: "pib-news" }
  | { type: "article"; slug: string }
  | { type: "category"; slug: CategorySlug }
  | { type: "section"; slug: "live" | "breaking" | "national" | "international" | "podcasts" }
  | { type: "podcast-episode"; slug: string }
  | { type: "search"; query: string }
  | { type: "advertise" }
  | { type: "careers" }
  | { type: "career-detail"; slug: string }
  | { type: "career-apply"; slug: string }
  | { type: "about" }
  | { type: "contact" }
  | { type: "privacy" }
  | { type: "terms" }
  | { type: "date-archive"; date: string } // ISO date string YYYY-MM-DD
  // Auth + panels
  | { type: "login" }
  | { type: "editor"; view?: "dashboard" | "new-article" | "edit-article"; articleId?: string }
  | { type: "admin"; view?: "dashboard" | "articles" | "editors" | "ads" | "live" | "careers" | "layout" | "analytics" | "messages" | "breaking" | "live-updates" | "subscribers" };

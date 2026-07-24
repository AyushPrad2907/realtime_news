import type { Article, Author, Category, PodcastEpisode, PodcastSeries, Job, LiveUpdate } from "@/lib/types";
import type {
  Article as PrismaArticle,
  User as PrismaUser,
  Category as PrismaCategory,
  PodcastSeries as PrismaPodcastSeries,
  PodcastEpisode as PrismaPodcastEpisode,
  Job as PrismaJob,
  LiveUpdate as PrismaLiveUpdate,
} from "@prisma/client";

/** Convert a Prisma Article (with relations) into the public Article shape. */
export function serializeArticle(
  a: PrismaArticle & { author?: PrismaUser | null; category?: PrismaCategory | null }
): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    standfirst: a.standfirst,
    body: a.body,
    category: a.categorySlug as Article["category"],
    tags: safeParse(a.tags, []),
    states: a.stateTags ? safeParse<string[]>(a.stateTags, []) : undefined,
    authorId: a.authorId,
    publishedAt: a.publishedAt?.toISOString() ?? a.createdAt.toISOString(),
    updatedAt: a.updatedAt?.toISOString() ?? undefined,
    readingTime: a.readingTime,
    views: a.views,
    heroImage: a.heroImage,
    heroCaption: a.heroCaption ?? undefined,
    heroCredit: a.heroCredit ?? undefined,
    isFeatured: a.isFeatured,
    isBreaking: a.isBreaking,
    hasAudio: a.hasAudio,
    audioDuration: a.audioDuration ?? undefined,
    keyPoints: extractKeyPointsFromBody(a.body),
  };
}

/** Convert a Prisma User (author) into the Author shape used by the public site. */
export function serializeAuthor(u: PrismaUser): Author {
  return {
    id: u.id,
    name: u.name,
    bio: u.bio ?? "",
    avatar: u.avatar ?? defaultAvatar(u.name),
    role: u.jobTitle ?? "Correspondent",
  };
}

export function serializeCategory(c: PrismaCategory): Category {
  return {
    slug: c.slug as Category["slug"],
    name: c.name,
    description: c.description,
    colorVar: c.colorVar,
  };
}

export function serializeSeries(s: PrismaPodcastSeries): PodcastSeries {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    coverImage: s.coverImage,
    episodes: 0, // populated by caller if needed
    category: s.category as PodcastSeries["category"],
  };
}

export function serializeEpisode(
  e: PrismaPodcastEpisode
): PodcastEpisode {
  return {
    id: e.id,
    slug: e.slug,
    seriesId: e.seriesId,
    title: e.title,
    description: e.description,
    publishedAt: e.publishedAt.toISOString(),
    duration: e.duration,
    audioUrl: e.audioUrl,
    coverImage: e.coverImage,
    episodeNumber: e.episodeNumber,
    showNotes: safeParse(e.showNotes, []),
  };
}

export function serializeJob(j: PrismaJob): Job {
  return {
    id: j.id,
    slug: j.slug,
    title: j.title,
    department: j.department as Job["department"],
    location: j.location,
    type: j.type as Job["type"],
    description: j.description,
    responsibilities: safeParse(j.responsibilities, []),
    requirements: safeParse(j.requirements, []),
    niceToHaves: j.niceToHaves ? safeParse(j.niceToHaves, undefined) : undefined,
    benefits: safeParse(j.benefits, []),
  };
}

export function serializeLiveUpdate(u: PrismaLiveUpdate): LiveUpdate {
  return {
    id: u.id,
    timestamp: u.timestamp,
    text: u.text,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function defaultAvatar(name: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=random&size=200`;
}

// Extract <li> items from the .key-points block in the article body
function extractKeyPointsFromBody(body: string): string[] | undefined {
  const match = body.match(
    /<div class="key-points">[\s\S]*?<ul>([\s\S]*?)<\/ul>[\s\S]*?<\/div>/
  );
  if (!match) return undefined;
  const lis = match[1].match(/<li>([\s\S]*?)<\/li>/g);
  if (!lis) return undefined;
  return lis.map((li) => li.replace(/<\/?li>/g, "").trim());
}

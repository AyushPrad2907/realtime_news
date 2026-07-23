/**
 * Seed script for The National Dispatch.
 *
 * Run with: `bun run db:seed` (we alias it below)
 *
 * This script:
 *  - Creates a default ADMIN user (admin@dispatch.test / admin123)
 *  - Creates a default EDITOR user (editor@dispatch.test / editor123)
 *  - Seeds categories
 *  - Seeds users (authors) as EDITORs
 *  - Seeds articles, podcast series + episodes, jobs, live config, breaking news
 *
 * Safe to run multiple times: it upserts each record on a stable key.
 */
import { PrismaClient, UserRole, ArticleStatus, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORIES,
  AUTHORS,
  ARTICLES_LIST,
  PODCAST_SERIES,
  PODCAST_EPISODES,
  JOBS,
  BREAKING_NEWS,
  LIVE_UPDATES,
} from "../src/lib/mock-data";

const db = new PrismaClient();

// Map author IDs from mock-data to stable cuid-like strings
// (we'll just use the originals — they are short and unique)
const AUTHOR_ID_MAP: Record<string, string> = {
  a1: "author-anjali-mehta",
  a2: "author-rahul-verma",
  a3: "author-priya-nair",
  a4: "author-vikram-singh",
  a5: "author-sara-khan",
  a6: "author-arvind-rao",
};

async function main() {
  console.log("Seeding database...");

  // ── Categories ─────────────────────────────────────────────
  for (const cat of CATEGORIES) {
    await db.category.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        colorVar: cat.colorVar,
        sortOrder: CATEGORIES.indexOf(cat),
      },
      update: {
        name: cat.name,
        description: cat.description,
        colorVar: cat.colorVar,
        sortOrder: CATEGORIES.indexOf(cat),
      },
    });
  }
  console.log(`✓ ${CATEGORIES.length} categories`);

  // ── Admin user ─────────────────────────────────────────────
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@dispatch.test" },
    create: {
      id: "user-admin",
      email: "admin@dispatch.test",
      name: "Platform Administrator",
      passwordHash: adminPass,
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      jobTitle: "Super Admin",
      bio: "Platform administrator with full access to all settings and content.",
    },
    update: {
      role: UserRole.ADMIN,
      status: AccountStatus.ACTIVE,
      passwordHash: adminPass,
    },
  });

  // ── Editor user (demo) ─────────────────────────────────────
  const editorPass = await bcrypt.hash("editor123", 10);
  const demoEditor = await db.user.upsert({
    where: { email: "editor@dispatch.test" },
    create: {
      id: "user-demo-editor",
      email: "editor@dispatch.test",
      name: "Demo Editor",
      passwordHash: editorPass,
      role: UserRole.EDITOR,
      status: AccountStatus.ACTIVE,
      jobTitle: "Senior Editor",
      bio: "Demo editor account for testing the editor panel.",
    },
    update: {
      role: UserRole.EDITOR,
      status: AccountStatus.ACTIVE,
      passwordHash: editorPass,
    },
  });

  // ── Author users (also editors, so they can write articles) ─
  for (const author of AUTHORS) {
    const id = AUTHOR_ID_MAP[author.id];
    const pass = await bcrypt.hash("author123", 10);
    await db.user.upsert({
      where: { email: `${author.name.toLowerCase().replace(/\s+/g, ".")}@dispatch.test` },
      create: {
        id,
        email: `${author.name.toLowerCase().replace(/\s+/g, ".")}@dispatch.test`,
        name: author.name,
        passwordHash: pass,
        role: UserRole.EDITOR,
        status: AccountStatus.ACTIVE,
        jobTitle: author.role,
        bio: author.bio,
        avatar: author.avatar,
      },
      update: {
        name: author.name,
        jobTitle: author.role,
        bio: author.bio,
        avatar: author.avatar,
      },
    });
  }
  console.log(`✓ ${AUTHORS.length + 2} users (1 admin, 1 demo editor, ${AUTHORS.length} author-editors)`);

  // ── Articles ───────────────────────────────────────────────
  for (const a of ARTICLES_LIST) {
    const authorId = AUTHOR_ID_MAP[a.authorId] ?? "user-demo-editor";
    await db.article.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        standfirst: a.standfirst,
        body: a.body,
        categorySlug: a.category,
        tags: JSON.stringify(a.tags),
        stateTags: a.states ? JSON.stringify(a.states) : null,
        authorId,
        status: ArticleStatus.PUBLISHED,
        isFeatured: a.isFeatured ?? false,
        isBreaking: a.isBreaking ?? false,
        hasAudio: a.hasAudio ?? false,
        audioUrl: a.hasAudio ? `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(parseInt(a.id, 10) % 8) + 1}.mp3` : null,
        audioDuration: a.audioDuration ?? null,
        heroImage: a.heroImage,
        heroCaption: a.heroCaption ?? null,
        heroCredit: a.heroCredit ?? null,
        readingTime: a.readingTime,
        views: a.views,
        publishedAt: new Date(a.publishedAt),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt),
        approvedAt: new Date(a.publishedAt),
        approvedById: admin.id,
        position: parseInt(a.id, 10),
      },
      update: {
        title: a.title,
        standfirst: a.standfirst,
        body: a.body,
        categorySlug: a.category,
        tags: JSON.stringify(a.tags),
        stateTags: a.states ? JSON.stringify(a.states) : null,
        authorId,
        status: ArticleStatus.PUBLISHED,
        isFeatured: a.isFeatured ?? false,
        isBreaking: a.isBreaking ?? false,
        hasAudio: a.hasAudio ?? false,
        audioUrl: a.hasAudio ? `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(parseInt(a.id, 10) % 8) + 1}.mp3` : null,
        audioDuration: a.audioDuration ?? null,
        heroImage: a.heroImage,
        heroCaption: a.heroCaption ?? null,
        heroCredit: a.heroCredit ?? null,
        readingTime: a.readingTime,
        views: a.views,
        publishedAt: new Date(a.publishedAt),
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt),
      },
    });
  }
  console.log(`✓ ${ARTICLES_LIST.length} articles`);

  // ── Podcast series + episodes ──────────────────────────────
  for (const s of PODCAST_SERIES) {
    await db.podcastSeries.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        coverImage: s.coverImage,
        category: s.category,
      },
      update: {
        name: s.name,
        description: s.description,
        coverImage: s.coverImage,
        category: s.category,
      },
    });
  }
  for (const e of PODCAST_EPISODES) {
    await db.podcastEpisode.upsert({
      where: { slug: e.slug },
      create: {
        slug: e.slug,
        seriesId: e.seriesId,
        title: e.title,
        description: e.description,
        publishedAt: new Date(e.publishedAt),
        duration: e.duration,
        audioUrl: e.audioUrl,
        coverImage: e.coverImage,
        episodeNumber: e.episodeNumber,
        showNotes: JSON.stringify(e.showNotes),
      },
      update: {
        seriesId: e.seriesId,
        title: e.title,
        description: e.description,
        publishedAt: new Date(e.publishedAt),
        duration: e.duration,
        audioUrl: e.audioUrl,
        coverImage: e.coverImage,
        episodeNumber: e.episodeNumber,
        showNotes: JSON.stringify(e.showNotes),
      },
    });
  }
  console.log(`✓ ${PODCAST_SERIES.length} podcast series, ${PODCAST_EPISODES.length} episodes`);

  // ── Jobs ───────────────────────────────────────────────────
  for (const j of JOBS) {
    await db.job.upsert({
      where: { slug: j.slug },
      create: {
        slug: j.slug,
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type,
        description: j.description,
        responsibilities: JSON.stringify(j.responsibilities),
        requirements: JSON.stringify(j.requirements),
        niceToHaves: j.niceToHaves ? JSON.stringify(j.niceToHaves) : null,
        benefits: JSON.stringify(j.benefits),
        isActive: true,
        postedById: admin.id,
      },
      update: {
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type,
        description: j.description,
        responsibilities: JSON.stringify(j.responsibilities),
        requirements: JSON.stringify(j.requirements),
        niceToHaves: j.niceToHaves ? JSON.stringify(j.niceToHaves) : null,
        benefits: JSON.stringify(j.benefits),
        isActive: true,
      },
    });
  }
  console.log(`✓ ${JOBS.length} jobs`);

  // ── Live config ────────────────────────────────────────────
  await db.liveConfig.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      programTitle: "Parliament Passes Digital Infrastructure Bill — Special Coverage",
      programDesc:
        "Join our anchors and correspondents for live analysis as the Bill moves to the President for assent. With expert guests and on-the-ground reporting from Parliament House.",
      isLive: true,
      viewerCount: 4287,
      startedAt: new Date(new Date().setHours(8, 0, 0, 0)),
      showOnHomepage: true,
    },
    update: {},
  });
  console.log("✓ Live config");

  // ── Live updates ───────────────────────────────────────────
  for (const u of LIVE_UPDATES) {
    await db.liveUpdate.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        timestamp: u.timestamp,
        text: u.text,
      },
      update: {
        timestamp: u.timestamp,
        text: u.text,
      },
    });
  }
  console.log(`✓ ${LIVE_UPDATES.length} live updates`);

  // ── Breaking news ──────────────────────────────────────────
  await db.breakingNews.deleteMany({});
  for (const [i, text] of BREAKING_NEWS.entries()) {
    await db.breakingNews.create({
      data: {
        text,
        order: i,
        isActive: true,
      },
    });
  }
  console.log(`✓ ${BREAKING_NEWS.length} breaking headlines`);

  // ── Demo ads ───────────────────────────────────────────────
  const existingAds = await db.ad.count();
  if (existingAds === 0) {
    await db.ad.createMany({
      data: [
        {
          name: "Homepage Leaderboard",
          type: "leaderboard",
          placement: "homepage-top",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=728&h=90&fit=crop&q=80",
          linkUrl: "#",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 86400000),
          status: "ACTIVE",
          createdById: admin.id,
        },
        {
          name: "Article Inline Banner",
          type: "leaderboard",
          placement: "article-inline",
          imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=728&h=90&fit=crop&q=80",
          linkUrl: "#",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 86400000),
          status: "ACTIVE",
          createdById: admin.id,
        },
        {
          name: "Sidebar Rectangle",
          type: "rectangle",
          placement: "sidebar",
          imageUrl: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=300&h=250&fit=crop&q=80",
          linkUrl: "#",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 86400000),
          status: "ACTIVE",
          createdById: admin.id,
        },
      ],
    });
    console.log("✓ 3 demo ads");
  }

  console.log("\n──────────────────────────────────────────");
  console.log("Seed complete!");
  console.log("──────────────────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin:  admin@dispatch.test  /  admin123");
  console.log("  Editor: editor@dispatch.test /  editor123");
  console.log("──────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

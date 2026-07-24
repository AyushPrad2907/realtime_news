import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { serializeArticle } from "@/lib/serializers";
import { ArticleStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// List all articles (with filters) for admin review queue
export async function GET(req: NextRequest) {
  let user;
  try {
    user = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // DRAFT | PENDING | PUBLISHED | REJECTED
  const category = searchParams.get("category");
  const authorId = searchParams.get("authorId");

  const where: any = {};
  const VALID_STATUSES = ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"];
  if (status && VALID_STATUSES.includes(status)) {
    where.status = status as ArticleStatus;
  }
  if (category) where.categorySlug = category;
  if (authorId) where.authorId = authorId;

  const articles = await db.article.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { author: true, category: true },
  });

  return NextResponse.json({
    articles: articles.map(serializeArticle),
    count: articles.length,
  });
}

// Create article directly (admin can bypass editor)
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    standfirst,
    body: articleBody,
    categorySlug,
    tags,
    stateTags,
    heroImage,
    heroCaption,
    heroCredit,
    hasAudio,
    audioUrl,
    audioDuration,
    readingTime,
    isFeatured,
    isBreaking,
    publish, // if true, publish immediately
  } = body ?? {};

  if (!title || !categorySlug) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    );
  }

  const hasLatin = /[a-z0-9]/i.test(title);
  const baseSlug = hasLatin
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80)
    : `article-${Date.now()}`;
  const slug = await uniqueSlug(baseSlug);

  const article = await db.article.create({
    data: {
      slug,
      title,
      standfirst: standfirst ?? "",
      body: articleBody ?? "",
      categorySlug,
      tags: JSON.stringify(tags ?? []),
      stateTags: stateTags ? JSON.stringify(stateTags) : null,
      authorId: user.id,
      status: publish ? ArticleStatus.PUBLISHED : ArticleStatus.DRAFT,
      hasAudio: hasAudio ?? false,
      audioUrl: audioUrl ?? null,
      audioDuration: audioDuration ?? null,
      heroImage: heroImage ?? "",
      heroCaption: heroCaption ?? null,
      heroCredit: heroCredit ?? null,
      readingTime: readingTime ?? 5,
      isFeatured: isFeatured ?? false,
      isBreaking: isBreaking ?? false,
      publishedAt: publish ? new Date() : null,
      approvedAt: publish ? new Date() : null,
      approvedById: publish ? user.id : null,
    },
    include: { author: true, category: true },
  });

  return NextResponse.json({ article: serializeArticle(article) });
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let i = 1;
  while (await db.article.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}

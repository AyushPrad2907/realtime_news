import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEditor } from "@/lib/session";
import { serializeArticle } from "@/lib/serializers";
import { ArticleStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// List editor's own articles (drafts + submissions)
export async function GET() {
  let user;
  try {
    user = await requireEditor();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const articles = await db.article.findMany({
    where: { authorId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  return NextResponse.json({ articles: articles.map(serializeArticle) });
}

// Create a new draft
export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireEditor();
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
  } = body ?? {};

  if (!title || !categorySlug) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    );
  }

  // Auto-generate slug from title
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
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
      status: ArticleStatus.DRAFT,
      hasAudio: hasAudio ?? false,
      audioUrl: audioUrl ?? null,
      audioDuration: audioDuration ?? null,
      heroImage: heroImage ?? "",
      heroCaption: heroCaption ?? null,
      heroCredit: heroCredit ?? null,
      readingTime: readingTime ?? 5,
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

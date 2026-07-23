import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { serializeArticle } from "@/lib/serializers";

export const dynamic = "force-dynamic";

// Returns the current homepage layout (featured + ordered top stories)
export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const featured = await db.article.findFirst({
    where: { isFeatured: true, status: "PUBLISHED" },
    include: { author: true, category: true },
  });
  const topStories = await db.article.findMany({
    where: { status: "PUBLISHED", isFeatured: false },
    orderBy: { position: "asc" },
    take: 10,
    include: { author: true, category: true },
  });

  return NextResponse.json({
    featured: featured ? serializeArticle(featured) : null,
    topStories: topStories.map(serializeArticle),
  });
}

// Reorder / set featured
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const body = await req.json();
  const { featuredId, orderedIds } = body ?? {};

  // Featured toggle
  if (featuredId) {
    await db.article.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
    await db.article.update({
      where: { id: featuredId },
      data: { isFeatured: true },
    });
  }

  // Reorder
  if (Array.isArray(orderedIds)) {
    await Promise.all(
      orderedIds.map((id: string, idx: number) =>
        db.article.update({ where: { id }, data: { position: idx } })
      )
    );
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeArticle } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const breaking = searchParams.get("breaking") === "true";
  const featured = searchParams.get("featured") === "true";
  const sort = searchParams.get("sort") ?? "newest";

  const where: any = { status: "PUBLISHED" };
  if (category) where.categorySlug = category;
  if (breaking) where.isBreaking = true;
  if (featured) where.isFeatured = true;
  if (state) {
    where.stateTags = { contains: `"${state}"` };
  }

  const orderBy =
    sort === "popular"
      ? { views: "desc" as const }
      : { publishedAt: "desc" as const };

  const articles = await db.article.findMany({
    where,
    orderBy,
    take: limit,
    include: { author: true, category: true },
  });

  return NextResponse.json({
    articles: articles.map(serializeArticle),
    count: articles.length,
  });
}

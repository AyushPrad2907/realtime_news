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
  const date = searchParams.get("date"); // YYYY-MM-DD

  const where: any = { status: "PUBLISHED" };
  if (category) where.categorySlug = category;
  if (breaking) where.isBreaking = true;
  if (featured) where.isFeatured = true;
  if (state) {
    where.stateTags = { contains: `"${state}"` };
  }
  if (date) {
    // Filter articles published on that calendar day (UTC)
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");
    where.publishedAt = { gte: start, lte: end };
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

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeArticle } from "@/lib/serializers";
import { serializeEpisode } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const type = searchParams.get("type") ?? "all"; // all | articles | podcasts
  const sort = searchParams.get("sort") ?? "newest";

  if (q.length < 2) {
    return NextResponse.json({ articles: [], podcasts: [], total: 0 });
  }

  const articles =
    type === "all" || type === "articles"
      ? await db.article.findMany({
          where: {
            status: "PUBLISHED",
            OR: [
              { title: { contains: q } },
              { standfirst: { contains: q } },
              { tags: { contains: q } },
            ],
          },
          orderBy:
            sort === "popular"
              ? { views: "desc" }
              : { publishedAt: "desc" },
          take: 30,
          include: { author: true, category: true },
        })
      : [];

  const podcasts =
    type === "all" || type === "podcasts"
      ? await db.podcastEpisode.findMany({
          where: {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
            ],
          },
          orderBy: { publishedAt: "desc" },
          take: 20,
        })
      : [];

  return NextResponse.json({
    articles: articles.map(serializeArticle),
    podcasts: podcasts.map(serializeEpisode),
    total: articles.length + podcasts.length,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30", 10);
  const since = new Date(Date.now() - days * 86400000);

  const [
    totalArticles,
    publishedArticles,
    pendingArticles,
    draftArticles,
    rejectedArticles,
    totalEditors,
    activeAds,
    totalViews,
    recentArticles,
    topArticles,
    categoriesAgg,
  ] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.article.count({ where: { status: "PENDING" } }),
    db.article.count({ where: { status: "DRAFT" } }),
    db.article.count({ where: { status: "REJECTED" } }),
    db.user.count({ where: { role: "EDITOR" } }),
    db.ad.count({ where: { status: "ACTIVE" } }),
    db.article.aggregate({ _sum: { views: true } }),
    db.article.findMany({
      where: { publishedAt: { gte: since } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { author: true, category: true },
    }),
    db.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 10,
      include: { author: true, category: true },
    }),
    db.article.groupBy({
      by: ["categorySlug"],
      _sum: { views: true },
      _count: true,
      orderBy: { _sum: { views: "desc" } },
    }),
  ]);

  const viewsDb = await db.articleView.groupBy({
    by: ["date"],
    _sum: { count: true },
    where: { date: { gte: since } },
    orderBy: { date: "asc" },
  });

  const viewsMap = new Map<string, number>();
  for (const v of viewsDb) {
    const dateStr = v.date.toISOString().slice(0, 10);
    viewsMap.set(dateStr, v._sum.count ?? 0);
  }

  const dailyViews: { date: string; views: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    dailyViews.push({
      date: dateStr,
      views: viewsMap.get(dateStr) ?? 0,
    });
  }

  return NextResponse.json({
    summary: {
      totalArticles,
      publishedArticles,
      pendingArticles,
      draftArticles,
      rejectedArticles,
      totalEditors,
      activeAds,
      totalViews: totalViews._sum.views ?? 0,
    },
    recentArticles: recentArticles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      authorName: a.author.name,
      categoryName: a.category.name,
      publishedAt: a.publishedAt?.toISOString() ?? null,
      views: a.views,
      status: a.status,
    })),
    topArticles: topArticles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      authorName: a.author.name,
      categoryName: a.category.name,
      views: a.views,
    })),
    categoryPerformance: categoriesAgg.map((c) => ({
      category: c.categorySlug,
      views: c._sum.views ?? 0,
      count: c._count,
    })),
    dailyViews,
  });
}

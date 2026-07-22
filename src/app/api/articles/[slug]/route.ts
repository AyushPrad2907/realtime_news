import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeArticle } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });
  if (!article || article.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment views (fire-and-forget)
  db.article
    .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.json({
    article: serializeArticle(article),
    author: {
      id: article.author.id,
      name: article.author.name,
      bio: article.author.bio ?? "",
      avatar: article.author.avatar ?? "",
      role: article.author.jobTitle ?? "Correspondent",
    },
  });
}

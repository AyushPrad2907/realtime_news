import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { ArticleStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (article.status === ArticleStatus.PUBLISHED) {
    return NextResponse.json(
      { error: "Article is already published" },
      { status: 409 }
    );
  }

  const updated = await db.article.update({
    where: { id },
    data: {
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date(),
      approvedAt: new Date(),
      approvedById: user.id,
      rejectionNote: null,
    },
  });
  return NextResponse.json({ ok: true, status: updated.status });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEditor } from "@/lib/session";
import { ArticleStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// Submit article for admin approval
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user;
  try {
    user = await requireEditor();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (user.role === "EDITOR" && article.authorId !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  if (article.status !== ArticleStatus.DRAFT && article.status !== ArticleStatus.REJECTED) {
    return NextResponse.json(
      { error: `Cannot submit article in ${article.status} state` },
      { status: 409 }
    );
  }

  const updated = await db.article.update({
    where: { id },
    data: {
      status: ArticleStatus.PENDING,
      submittedAt: new Date(),
      rejectionNote: null,
    },
  });
  return NextResponse.json({ ok: true, status: updated.status });
}

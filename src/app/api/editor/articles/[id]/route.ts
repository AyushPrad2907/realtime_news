import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEditor, getCurrentUser } from "@/lib/session";
import { serializeArticle } from "@/lib/serializers";
import { ArticleStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
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
  const article = await db.article.findUnique({
    where: { id },
    include: { author: true, category: true },
  });
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Editors can only see their own; admins can see any
  if (user.role === "EDITOR" && article.authorId !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  return NextResponse.json({ article: serializeArticle(article) });
}

export async function PUT(
  req: NextRequest,
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
  // Once submitted (PENDING) editors can't edit unless admin returns it
  if (
    user.role === "EDITOR" &&
    article.status === ArticleStatus.PENDING
  ) {
    return NextResponse.json(
      { error: "Article is pending review and cannot be edited" },
      { status: 409 }
    );
  }

  const body = await req.json();
  const updates: any = {};
  for (const key of [
    "title",
    "standfirst",
    "body",
    "categorySlug",
    "heroImage",
    "heroCaption",
    "heroCredit",
    "hasAudio",
    "audioUrl",
    "audioDuration",
    "readingTime",
    "isFeatured",
    "isBreaking",
  ]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.tags !== undefined) updates.tags = JSON.stringify(body.tags);
  if (body.stateTags !== undefined)
    updates.stateTags = body.stateTags ? JSON.stringify(body.stateTags) : null;
  updates.updatedAt = new Date();

  const updated = await db.article.update({
    where: { id },
    data: updates,
    include: { author: true, category: true },
  });
  return NextResponse.json({ article: serializeArticle(updated) });
}

export async function DELETE(
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
  // Only allow delete if not published
  if (article.status === ArticleStatus.PUBLISHED && user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Published articles can only be deleted by an admin" },
      { status: 409 }
    );
  }

  await db.article.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

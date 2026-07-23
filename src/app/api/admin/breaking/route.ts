import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const items = await db.breakingNews.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({
    items: items.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { text, isActive } = await req.json();
  if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });
  const max = await db.breakingNews.aggregate({ _max: { order: true } });
  const item = await db.breakingNews.create({
    data: {
      text,
      isActive: isActive ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id, text, isActive, order } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates: any = {};
  if (text !== undefined) updates.text = text;
  if (isActive !== undefined) updates.isActive = isActive;
  if (order !== undefined) updates.order = order;
  const item = await db.breakingNews.update({ where: { id }, data: updates });
  return NextResponse.json({ item });
}

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
  const updates = await db.liveUpdate.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({
    updates: updates.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { timestamp, text } = await req.json();
  if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });
  const update = await db.liveUpdate.create({
    data: {
      text,
      timestamp: timestamp ?? new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    },
  });
  return NextResponse.json({ update });
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id, text, timestamp } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates: any = {};
  if (text !== undefined) updates.text = text;
  if (timestamp !== undefined) updates.timestamp = timestamp;
  const update = await db.liveUpdate.update({ where: { id }, data: updates });
  return NextResponse.json({ update });
}

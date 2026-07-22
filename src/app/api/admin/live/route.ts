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
  const config = await db.liveConfig.findUnique({ where: { id: "default" } });
  return NextResponse.json({ config });
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const body = await req.json();
  const updates: any = {};
  for (const k of ["youtubeUrl", "programTitle", "programDesc", "isLive", "viewerCount", "showOnHomepage"]) {
    if (body[k] !== undefined) updates[k] = body[k];
  }
  if (body.startedAt) updates.startedAt = new Date(body.startedAt);
  if (body.nextBroadcastAt) updates.nextBroadcastAt = new Date(body.nextBroadcastAt);

  const config = await db.liveConfig.upsert({
    where: { id: "default" },
    create: { id: "default", ...updates },
    update: updates,
  });
  return NextResponse.json({ config });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const updates: any = {};
  for (const k of ["name", "type", "placement", "imageUrl", "linkUrl", "htmlContent", "status", "impressions", "clicks"]) {
    if (body[k] !== undefined) updates[k] = body[k];
  }
  if (body.startDate) updates.startDate = new Date(body.startDate);
  if (body.endDate) updates.endDate = new Date(body.endDate);
  const ad = await db.ad.update({ where: { id }, data: updates });
  return NextResponse.json({ ad });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { id } = await params;
  await db.ad.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

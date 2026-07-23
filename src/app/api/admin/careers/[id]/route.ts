import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { serializeJob } from "@/lib/serializers";

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
  for (const k of ["title", "department", "location", "type", "description", "isActive"]) {
    if (body[k] !== undefined) updates[k] = body[k];
  }
  if (body.responsibilities) updates.responsibilities = JSON.stringify(body.responsibilities);
  if (body.requirements) updates.requirements = JSON.stringify(body.requirements);
  if (body.niceToHaves !== undefined) updates.niceToHaves = body.niceToHaves ? JSON.stringify(body.niceToHaves) : null;
  if (body.benefits) updates.benefits = JSON.stringify(body.benefits);

  const job = await db.job.update({ where: { id }, data: updates });
  return NextResponse.json({ job: serializeJob(job) });
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
  await db.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

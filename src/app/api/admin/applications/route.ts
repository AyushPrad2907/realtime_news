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
  const jobId = searchParams.get("jobId");

  const where: any = {};
  if (jobId) where.jobId = jobId;

  const applications = await db.jobApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { job: { select: { title: true, slug: true } } },
  });

  return NextResponse.json({
    applications: applications.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.jobApplication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeJob } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const job = await db.job.findUnique({ where: { slug } });
  if (!job || !job.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ job: serializeJob(job) });
}

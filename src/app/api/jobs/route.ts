import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeJob } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await db.job.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ jobs: jobs.map(serializeJob) });
}

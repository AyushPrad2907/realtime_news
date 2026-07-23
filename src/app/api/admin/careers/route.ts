import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { serializeJob } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const jobs = await db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });
  return NextResponse.json({
    jobs: jobs.map((j) => ({
      ...serializeJob(j),
      isActive: j.isActive,
      applicationCount: (j as any)._count?.applications ?? 0,
      createdAt: j.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const body = await req.json();
  const {
    title,
    department,
    location,
    type,
    description,
    responsibilities,
    requirements,
    niceToHaves,
    benefits,
    isActive,
  } = body ?? {};
  if (!title || !department || !location || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);
  const slug = await uniqueJobSlug(baseSlug);

  const job = await db.job.create({
    data: {
      slug,
      title,
      department,
      location,
      type,
      description: description ?? "",
      responsibilities: JSON.stringify(responsibilities ?? []),
      requirements: JSON.stringify(requirements ?? []),
      niceToHaves: niceToHaves ? JSON.stringify(niceToHaves) : null,
      benefits: JSON.stringify(benefits ?? []),
      isActive: isActive ?? true,
      postedById: user.id,
    },
  });
  return NextResponse.json({ job: serializeJob(job) });
}

async function uniqueJobSlug(base: string): Promise<string> {
  let candidate = base;
  let i = 1;
  while (await db.job.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}

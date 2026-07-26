import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const job = await db.job.findUnique({ where: { slug } });
  if (!job || !job.isActive) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const {
    fullName,
    email,
    phone,
    city,
    linkedinUrl,
    portfolioUrl,
    resumePath,
    coverLetter,
    source,
  } = body ?? {};

  if (!fullName || !email || !resumePath) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const application = await db.jobApplication.create({
    data: {
      jobId: job.id,
      fullName,
      email,
      phone: phone ?? null,
      city: city ?? null,
      linkedinUrl: linkedinUrl ?? null,
      portfolioUrl: portfolioUrl ?? null,
      resumePath,
      coverLetter: coverLetter ?? null,
      source: source ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: application.id });
}

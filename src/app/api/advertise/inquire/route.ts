import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    fullName,
    email,
    phone,
    company,
    websiteUrl,
    formats,
    budget,
    startDate,
    message,
  } = body ?? {};

  if (!fullName || !email || !company) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.advertiseInquiry.create({
    data: {
      fullName,
      email,
      phone: phone ?? null,
      company,
      websiteUrl: websiteUrl ?? null,
      formats: JSON.stringify(formats ?? []),
      budget: budget ?? null,
      startDate: startDate ? new Date(startDate) : null,
      message: message ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}

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
  const ads = await db.ad.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const body = await req.json();
  const { name, type, placement, imageUrl, linkUrl, htmlContent, startDate, endDate, status } = body ?? {};
  if (!name || !type || !placement) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const ad = await db.ad.create({
    data: {
      name,
      type,
      placement,
      imageUrl: imageUrl ?? null,
      linkUrl: linkUrl ?? null,
      htmlContent: htmlContent ?? null,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 86400000),
      status: status ?? "SCHEDULED",
      createdById: user.id,
    },
  });
  return NextResponse.json({ ad });
}

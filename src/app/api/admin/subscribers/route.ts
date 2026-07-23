import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const subscribers = await db.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json({
    subscribers: subscribers.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.newsletterSubscriber.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

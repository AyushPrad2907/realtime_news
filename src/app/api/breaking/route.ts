import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BREAKING_NEWS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.breakingNews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ items: items.map((b) => b.text) });
  } catch (err) {
    console.error("Prisma database connection failed in breaking news API. Falling back to mock:", err);
    // Return active mock breaking news
    const mockTexts = BREAKING_NEWS.filter((b) => b.isActive).map((b) => b.text);
    return NextResponse.json({ items: mockTexts });
  }
}

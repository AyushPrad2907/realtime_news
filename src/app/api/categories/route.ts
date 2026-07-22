import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeCategory } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cats = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ categories: cats.map(serializeCategory) });
}

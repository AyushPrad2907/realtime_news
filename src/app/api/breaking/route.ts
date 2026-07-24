import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Parser from "rss-parser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await db.breakingNews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    
    if (items.length > 0) {
      return NextResponse.json({ items: items.map((b) => b.text) });
    }

    // Fallback: Fetch top 8 titles from PIB RSS as breaking news
    const parser = new Parser();
    const feedUrl = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1";
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (res.ok) {
      const xml = await res.text();
      const feed = await parser.parseString(xml);
      const headlines = (feed.items ?? [])
        .slice(0, 8)
        .map((item) => item.title ?? "")
        .filter(Boolean);
      if (headlines.length > 0) {
        return NextResponse.json({ items: headlines });
      }
    }

    return NextResponse.json({ items: [] });
  } catch (err) {
    console.error("Prisma database connection failed in breaking news API. Falling back to empty array:", err);
    return NextResponse.json({ items: [] });
  }
}

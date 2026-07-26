import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Parser from "rss-parser";

export const dynamic = "force-dynamic";

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === "en") return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return data[0].map((x: any) => x[0]).join("");
      }
    }
  } catch (e) {
    console.error("Translation error in breaking:", e);
  }
  return text;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") ?? "en";
    const isHindi = lang === "hi";

    const items = await db.breakingNews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    
    if (items.length > 0) {
      const texts = items.map((b) => b.text);
      if (isHindi) {
        const translated = await Promise.all(texts.map(t => translateText(t, "hi")));
        return NextResponse.json({ items: translated });
      }
      return NextResponse.json({ items: texts });
    }

    // Fallback: Fetch top 8 titles from PIB RSS as breaking news
    const parser = new Parser();
    const feedUrl = `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=${isHindi ? "2" : "1"}`;
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const xml = new TextDecoder("utf-8").decode(buffer);
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
    console.error("Prisma database connection failed in breaking news API:", err);
    return NextResponse.json({ items: [] });
  }
}

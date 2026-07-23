import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const revalidate = 900; // Cache for 15 minutes

export async function GET() {
  const parser = new Parser();
  try {
    // Verified working URL for PIB Press Releases (English)
    const response = await fetch("https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PIB feed: Status ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Clean unescaped & characters that break XML parsing
    const cleanXml = xmlText.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, "&amp;");

    const feed = await parser.parseString(cleanXml);

    return NextResponse.json({
      title: feed.title || "Press Information Bureau",
      description: feed.description || "Latest Government Releases",
      items: feed.items || [],
    });
  } catch (error: any) {
    console.error("Failed to parse PIB feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch PIB feed", details: error.message },
      { status: 500 }
    );
  }
}

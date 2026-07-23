import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache individual releases for 1 hour

function extractPdfDiv(html: string): string {
  const startTag = 'id="PdfDiv"';
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) return "";

  const startIndex = html.lastIndexOf('<div', startIdx);
  if (startIndex === -1) return "";

  const tagEndIndex = html.indexOf('>', startIdx);
  if (tagEndIndex === -1) return "";

  let depth = 1;
  let currentIndex = tagEndIndex + 1;

  while (depth > 0 && currentIndex < html.length) {
    const nextOpen = html.indexOf('<div', currentIndex);
    const nextClose = html.indexOf('</div>', currentIndex);

    if (nextClose === -1) {
      break;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      currentIndex = nextOpen + 4;
    } else {
      depth--;
      currentIndex = nextClose + 6;
    }
  }

  return html.substring(tagEndIndex + 1, currentIndex - 6).trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate the URL domain is indeed pib.gov.in
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== "pib.gov.in") {
      return NextResponse.json({ error: "Unauthorized target URL" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch article: ${res.status}`);
    }

    const htmlText = await res.text();
    const cleanedHtmlText = htmlText.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, "&amp;");
    const extractedContent = extractPdfDiv(cleanedHtmlText);

    if (!extractedContent) {
      return NextResponse.json({ error: "Could not locate release content block on the page" }, { status: 404 });
    }

    return NextResponse.json({ html: extractedContent });
  } catch (error: any) {
    console.error("Failed to scrape PIB article:", error);
    return NextResponse.json(
      { error: "Failed to scrape PIB article content", details: error.message },
      { status: 500 }
    );
  }
}

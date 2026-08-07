import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeArticle } from "@/lib/serializers";
import https from "https";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { getPibArticleImage } from "@/lib/pib-scraper";

export const dynamic = "force-dynamic";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Extract language from query params or googtrans cookie header, default to 'hi'
  const { searchParams } = new URL(_req.url);
  let lang = searchParams.get("lang");
  if (!lang) {
    const cookieHeader = _req.headers.get("cookie") || "";
    const match = cookieHeader.match(/googtrans=([^;]+)/);
    if (match) {
      const val = decodeURIComponent(match[1]);
      if (val.endsWith("/hi")) lang = "hi";
      else if (val.endsWith("/en")) lang = "en";
    }
  }
  if (!lang) lang = "hi"; // Default to Hindi

  // Intercept PIB releases dynamically
  if (slug.startsWith("pib-")) {
    const prid = slug.replace("pib-", "");
    const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch PIB release" }, { status: 404 });
      }

      const html = await res.text();
      const cleanEntities = html
        .replace(/&zwj;/gi, "\u200d")
        .replace(/&ndash;/gi, "–")
        .replace(/&mdash;/gi, "—")
        .replace(/&nbsp;/gi, " ")
        .replace(/&rsquo;/gi, "’")
        .replace(/&lsquo;/gi, "‘")
        .replace(/&rdquo;/gi, "”")
        .replace(/&ldquo;/gi, "“");
      const cleanedHtml = cleanEntities.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, "&amp;");
      let bodyContent = extractPdfDiv(cleanedHtml);

      if (!bodyContent) {
        return NextResponse.json({ error: "Release content block not found" }, { status: 404 });
      }

      // Sanitize the HTML to strip out legacy styling that overrides our theme text color
      bodyContent = bodyContent
        .replace(/<style[\s\S]*?<\/style>/gi, "") // Remove embedded style blocks
        .replace(/<font[^>]*>/gi, "") // Strip font opening tags
        .replace(/<\/font>/gi, "") // Strip font closing tags
        .replace(/style=["'][^"']*(?:color|background)[^"']*["']/gi, ""); // Strip style attributes setting color/bg

      // Generate a mock title from the extracted content if needed
      const h2Match = bodyContent.match(/<h2[^>]*id="Titleh2"[^>]*>([\s\S]*?)<\/h2>/i);
      const title = h2Match ? h2Match[1].replace(/<[^>]*>/g, "").trim() : "Government Release";

      const standfirstMatch = bodyContent.match(/<h3[^>]*id="Subtitleh3"[^>]*>([\s\S]*?)<\/h3>/i);
      const standfirst = standfirstMatch ? standfirstMatch[1].replace(/<[^>]*>/g, "").trim() : "Official press release from Government of India.";

      let heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=900&fit=crop&q=80";
      const scrapedImg = await getPibArticleImage(prid);
      if (scrapedImg) {
        heroImage = scrapedImg;
      }

      const mockArticle = {
        id: `pib-${prid}`,
        slug,
        title,
        standfirst,
        body: bodyContent,
        category: "national", // default category
        tags: ["Government", "PIB", "Official Release"],
        states: [],
        authorId: "pib",
        publishedAt: new Date().toISOString(), // Fallback
        readingTime: 3,
        views: 200,
        heroImage,
        isFeatured: false,
        isBreaking: false,
        hasAudio: false,
        keyPoints: [],
      };

      // Translate dynamically if target is Hindi
      if (lang === "hi") {
        mockArticle.title = await translateText(mockArticle.title, "hi");
        mockArticle.standfirst = await translateText(mockArticle.standfirst, "hi");
        mockArticle.body = await translateText(mockArticle.body, "hi");
      }

      return NextResponse.json({
        article: mockArticle,
        author: {
          id: "pib",
          name: "Press Information Bureau",
          bio: "Official press agency of the Government of India.",
          avatar: "https://ui-avatars.com/api/?name=PIB",
          role: "Government Spokesperson",
        },
      }, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150",
        }
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error scraping PIB release content", details: err.message },
        { status: 500 }
      );
    }
  }

  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: { author: true, category: true },
    });

    if (!article || article.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment views (fire-and-forget)
    db.article
      .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
      .catch(() => {});

    const serialized = serializeArticle(article);

    // Translate dynamically if target is Hindi
    if (lang === "hi") {
      serialized.title = await translateText(serialized.title, "hi");
      serialized.standfirst = await translateText(serialized.standfirst, "hi");
      serialized.body = await translateText(serialized.body, "hi");
    }

    return NextResponse.json({
      article: serialized,
      author: {
        id: article.author.id,
        name: article.author.name,
        bio: article.author.bio ?? "",
        avatar: article.author.avatar ?? "",
        role: article.author.jobTitle ?? "Correspondent",
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
      }
    });
  } catch (dbError) {
    console.error("Prisma database connection failed in details endpoint. Falling back to mock data:", dbError);
    const foundMock = ARTICLES_LIST.find((a) => a.slug === slug);
    if (!foundMock) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const mockArticle = { ...foundMock };

    // Translate dynamically if target is Hindi
    if (lang === "hi") {
      mockArticle.title = await translateText(mockArticle.title, "hi");
      mockArticle.standfirst = await translateText(mockArticle.standfirst, "hi");
      mockArticle.body = await translateText(mockArticle.body, "hi");
    }

    return NextResponse.json({
      article: mockArticle,
      author: {
        id: mockArticle.authorId,
        name: "Newsvarta Editorial Team",
        bio: "Curated editorial coverage.",
        avatar: "https://ui-avatars.com/api/?name=Newsvarta",
        role: "Editorial Team",
      },
    });
  }
}

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === "en") return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const resBody = await new Promise<string>((resolve, reject) => {
      https.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`HTTP status ${res.statusCode}`));
          }
        });
      }).on("error", reject);
    });

    const data = JSON.parse(resBody);
    if (data && data[0]) {
      return data[0].map((x: any) => x[0]).join("");
    }
  } catch (e) {
    console.error("Translation helper error:", e);
  }
  return text;
}

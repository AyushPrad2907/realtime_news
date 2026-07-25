import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeArticle } from "@/lib/serializers";
import https from "https";
import { ARTICLES_LIST } from "@/lib/mock-data";
import Parser from "rss-parser";

export const dynamic = "force-dynamic";

function getCategoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("cabinet") || t.includes("election") || t.includes("parliament") || t.includes("pm modi") || t.includes("narendra modi") || t.includes("minister") || t.includes("president")) {
    if (t.includes("visit") || t.includes("international") || t.includes("bilateral") || t.includes("foreign")) {
      return "international";
    }
    return "politics";
  }
  if (t.includes("economy") || t.includes("gst") || t.includes("gdp") || t.includes("tax") || t.includes("finance") || t.includes("budget") || t.includes("trade") || t.includes("commerce")) {
    return "economy";
  }
  if (t.includes("sports") || t.includes("hockey") || t.includes("cricket") || t.includes("championship") || t.includes("medal") || t.includes("khelo")) {
    return "sports";
  }
  if (t.includes("health") || t.includes("ayushman") || t.includes("disease") || t.includes("medical") || t.includes("vaccine")) {
    return "health";
  }
  if (t.includes("technology") || t.includes("digital") || t.includes("software") || t.includes("telecom") || t.includes("ai")) {
    return "technology";
  }
  if (t.includes("space") || t.includes("isro") || t.includes("satellite") || t.includes("science") || t.includes("research")) {
    return "science";
  }
  if (t.includes("global") || t.includes("un ") || t.includes("diplomatic") || t.includes("bilateral") || t.includes("g20")) {
    return "international";
  }
  return "national";
}

const imageCache = new Map<string, string>();

async function getPibArticleImage(prid: string): Promise<string> {
  if (imageCache.has(prid)) {
    return imageCache.get(prid)!;
  }
  try {
    const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 }, // Cache scraper page fetch for 1 hour
    });
    if (!res.ok) return "";
    const html = await res.text();
    
    // Match both relative and absolute image paths on the official site
    const imgRegex = /(?:https:\/\/static\.pib\.gov\.in)?\/?WriteReadData\/(?:userfiles\/image|specificdocs\/photo)\/[^\s"'>]+/i;
    const imgMatch = html.match(imgRegex);
    if (imgMatch) {
      let imgUrl = imgMatch[0];
      if (!imgUrl.startsWith("http")) {
        if (imgUrl.startsWith("/")) imgUrl = imgUrl.substring(1);
        imgUrl = `https://static.pib.gov.in/${imgUrl}`;
      }
      if (imageCache.size >= 500) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey !== undefined) {
          imageCache.delete(firstKey);
        }
      }
      imageCache.set(prid, imgUrl);
      return imgUrl;
    }
  } catch (e) {
    console.error("Failed to scrape image for PRID", prid, e);
  }
  return "";
}

async function fetchPibArticles(lang: string = "en"): Promise<any[]> {
  const parser = new Parser();
  try {
    const isHindi = lang === "hi";
    const feedUrl = `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=${isHindi ? "2" : "1"}`;
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 300 }, // Cache feed for 5 minutes
    });

    if (!res.ok) return [];
    
    const xml = await res.text();
    // Replace html entities (zwj, ndash, mdash, nbsp, curly quotes) with unicode or plain characters
    const cleanEntities = xml
      .replace(/&zwj;/gi, "\u200d")
      .replace(/&ndash;/gi, "–")
      .replace(/&mdash;/gi, "—")
      .replace(/&nbsp;/gi, " ")
      .replace(/&rsquo;/gi, "’")
      .replace(/&lsquo;/gi, "‘")
      .replace(/&rdquo;/gi, "”")
      .replace(/&ldquo;/gi, "“");
    const cleanXml = cleanEntities.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, "&amp;");
    const feed = await parser.parseString(cleanXml);

    const items = feed.items || [];
    
    // Resolve real images in parallel for the items
    return await Promise.all(items.map(async (item, index) => {
      const pridMatch = item.link?.match(/PRID=(\d+)/);
      const prid = pridMatch ? pridMatch[1] : `national-${index}`;
      const slug = `pib-${prid}`;
      
      const title = item.title || "";
      const category = getCategoryFromTitle(title);
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

      const isHindi = lang === "hi";

      let heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=900&fit=crop&q=80"; // Fallback image (newspaper/press theme)
      if (pridMatch) {
        const scrapedImg = await getPibArticleImage(prid);
        if (scrapedImg) {
          heroImage = scrapedImg;
        }
      }

      return {
        id: `pib-${prid}`,
        slug,
        title,
        standfirst: item.contentSnippet || (isHindi ? "पत्र सूचना कार्यालय से आधिकारिक विज्ञप्ति।" : "Official Release from Press Information Bureau."),
        body: item.content || item.contentSnippet || "",
        category,
        tags: isHindi ? ["सरकारी विज्ञप्ति", "पीआईबी", "आधिकारिक"] : ["Government", "PIB", "Official Release"],
        states: [],
        authorId: "pib",
        publishedAt: pubDate,
        updatedAt: undefined,
        readingTime: Math.max(1, Math.ceil((item.contentSnippet?.split(" ").length || 100) / 200)),
        views: 150 + (index * 12),
        heroImage, 
        heroCaption: isHindi ? "पत्र सूचना कार्यालय, भारत सरकार" : "Press Information Bureau, Government of India",
        heroCredit: "PIB",
        isFeatured: index === 0, // Make the latest release featured
        isBreaking: index < 2,   // Make the latest 2 releases show up in Breaking ticker
        hasAudio: false,
        keyPoints: [],
        author: {
          id: "pib",
          name: isHindi ? "पत्र सूचना कार्यालय (PIB)" : "Press Information Bureau",
          bio: isHindi ? "भारत सरकार की आधिकारिक प्रेस एजेंसी।" : "Official press agency of the Government of India.",
          avatar: "https://ui-avatars.com/api/?name=PIB",
          role: isHindi ? "सरकारी प्रवक्ता" : "Government Spokesperson",
        },
      };
    }));
  } catch (error) {
    console.error("Error loading PIB articles:", error);
    return [];
  }
}

async function fetchLiveFallbackFeeds(
  lang: string,
  category?: string | null,
  state?: string | null,
  breaking?: boolean,
  featured?: boolean,
  date?: string | null
): Promise<any[]> {
  const isHindi = lang === "hi";
  const parser = new Parser();
  const articles: any[] = [];

  // Determine which feeds to fetch
  const feedsToFetch: { name: string; url: string; source: "pib" | "hindustan"; defaultCategory?: string }[] = [];

  // PIB national
  feedsToFetch.push({
    name: "PIB National",
    url: `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=${isHindi ? "2" : "1"}`,
    source: "pib"
  });

  // State PIB feeds if state matches
  if (state === "Delhi") {
    feedsToFetch.push({
      name: "PIB Delhi",
      url: `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=3`,
      source: "pib"
    });
  } else if (state === "Bihar") {
    feedsToFetch.push({
      name: "PIB Bihar",
      url: `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=13`,
      source: "pib"
    });
  } else if (state === "Punjab") {
    feedsToFetch.push({
      name: "PIB Punjab",
      url: `https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=20`,
      source: "pib"
    });
  }

  // Live Hindustan (always include if no state is specified, as they don't map to these 3 states easily)
  if (!state) {
    if (category === "sports") {
      feedsToFetch.push({
        name: "Hindustan Sports",
        url: "https://feed.livehindustan.com/rss/sports",
        source: "hindustan",
        defaultCategory: "sports"
      });
    } else if (category === "economy") {
      feedsToFetch.push({
        name: "Hindustan Business",
        url: "https://feed.livehindustan.com/rss/business",
        source: "hindustan",
        defaultCategory: "economy"
      });
    } else if (category === "technology" || category === "science") {
      feedsToFetch.push({
        name: "Hindustan SciTech",
        url: "https://feed.livehindustan.com/rss/science-technology",
        source: "hindustan",
        defaultCategory: "technology"
      });
    } else {
      feedsToFetch.push({
        name: "Hindustan National",
        url: "https://feed.livehindustan.com/rss/national",
        source: "hindustan",
        defaultCategory: "national"
      });
    }
  }

  await Promise.all(
    feedsToFetch.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0" },
          next: { revalidate: 300 }
        });
        if (!res.ok) return;
        const xml = await res.text();
        const cleanEntities = xml
          .replace(/&zwj;/gi, "\u200d")
          .replace(/&ndash;/gi, "–")
          .replace(/&mdash;/gi, "—")
          .replace(/&nbsp;/gi, " ")
          .replace(/&rsquo;/gi, "’")
          .replace(/&lsquo;/gi, "‘")
          .replace(/&rdquo;/gi, "”")
          .replace(/&ldquo;/gi, "“");
        const cleanXml = cleanEntities.replace(/&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g, "&amp;");
        const parsed = await parser.parseString(cleanXml);

        parsed.items.forEach((item, index) => {
          const pridMatch = item.link?.match(/PRID=(\d+)/);
          const feedSlugName = feed.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const prid = pridMatch ? pridMatch[1] : `${feedSlugName}-${index}`;
          const slug = feed.source === "pib" ? `pib-${prid}` : `hindustan-${index}-${Date.now()}`;
          const itemCategory = feed.defaultCategory || getCategoryFromTitle(item.title || "");
          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

          articles.push({
            id: slug,
            slug,
            title: item.title || "",
            standfirst: item.contentSnippet || item.description || (isHindi ? "विज्ञप्ति।" : "Official Release."),
            body: item.content || item.contentSnippet || "",
            category: itemCategory,
            tags: feed.source === "pib" ? ["PIB"] : ["Hindustan"],
            states: state ? [state] : [],
            authorId: feed.source === "pib" ? "pib-scraper" : "hindustan-scraper",
            publishedAt: pubDate,
            views: 100 + index * 5,
            heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
            heroCaption: feed.name,
            heroCredit: feed.source === "pib" ? "PIB" : "Hindustan",
            isFeatured: index === 0 && !category,
            isBreaking: index < 2,
            hasAudio: false,
            author: {
              id: feed.source === "pib" ? "pib-scraper" : "hindustan-scraper",
              name: feed.source === "pib" ? "पत्र सूचना कार्यालय (PIB)" : "लाइव हिन्दुस्तान",
              avatar: "https://ui-avatars.com/api/?name=" + (feed.source === "pib" ? "PIB" : "LH")
            }
          });
        });
      } catch (e) {
        console.error("Failed to parse feed in fallback", feed.name, e);
      }
    })
  );

  // Filter combined articles
  let filtered = articles;
  if (category) filtered = filtered.filter(a => a.category === category);
  if (breaking) filtered = filtered.filter(a => a.isBreaking);
  if (featured) filtered = filtered.filter(a => a.isFeatured);
  if (date) filtered = filtered.filter(a => a.publishedAt.startsWith(date));

  return filtered;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsedLimit = parseInt(searchParams.get("limit") ?? "20", 10);
  const limit = Math.min(isNaN(parsedLimit) ? 20 : parsedLimit, 100);
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const breaking = searchParams.get("breaking") === "true";
  const featured = searchParams.get("featured") === "true";
  const sort = searchParams.get("sort") ?? "newest";
  const date = searchParams.get("date"); // YYYY-MM-DD
  const lang = searchParams.get("lang") ?? "en";

  // 1. Fetch DB Articles
  const where: any = { status: "PUBLISHED" };
  if (category) where.categorySlug = category;
  if (breaking) where.isBreaking = true;
  if (featured) where.isFeatured = true;
  if (state) {
    where.stateTags = { contains: `"${state}"` };
  }
  if (date) {
    const start = new Date(date + "T00:00:00.000+05:30");
    const end = new Date(date + "T23:59:59.999+05:30");
    where.publishedAt = { gte: start, lte: end };
  }

  const orderBy: any = {};
  if (sort === "popular") {
    orderBy.views = "desc";
  } else {
    orderBy.publishedAt = "desc";
  }

  let serializedDb: any[] = [];
  try {
    const dbArticles = await db.article.findMany({
      where,
      orderBy,
      take: limit,
      include: { author: true, category: true },
    });
    serializedDb = dbArticles.map(serializeArticle);
    
    // If DB is empty, fetch live fallback feeds
    if (serializedDb.length === 0) {
      serializedDb = await fetchLiveFallbackFeeds(lang, category, state, breaking, featured, date);
    }
  } catch (dbError) {
    console.error("Prisma database connection failed. Falling back to live RSS feeds:", dbError);
    serializedDb = await fetchLiveFallbackFeeds(lang, category, state, breaking, featured, date);
  }

  // Combine and Sort
  let combined = [...serializedDb];

  // Deduplicate by slug
  const seenSlugs = new Set<string>();
  combined = combined.filter((article) => {
    if (seenSlugs.has(article.slug)) return false;
    seenSlugs.add(article.slug);
    return true;
  });

  if (sort === "popular") {
    combined.sort((a, b) => b.views - a.views);
  } else {
    combined.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Slice to the requested limit
  const result = combined.slice(0, limit);

  // Pre-translate titles and standfirsts to Hindi server-side if lang is "hi"
  if (lang === "hi") {
    await Promise.all(
      result.map(async (article) => {
        article.title = await translateText(article.title, "hi");
        article.standfirst = await translateText(article.standfirst, "hi");
      })
    );
  }

  return NextResponse.json({
    articles: result,
    count: result.length,
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    }
  });
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

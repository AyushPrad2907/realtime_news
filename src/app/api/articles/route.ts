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
    const buffer = await res.arrayBuffer();
    const html = new TextDecoder("utf-8").decode(buffer);
    
    // Match real article images in WriteReadData, ignoring site header/footer logos
    const pdfDivIdx = html.indexOf('id="PdfDiv"');
    const searchSpace = pdfDivIdx !== -1 ? html.substring(pdfDivIdx) : html;

    const imgRegex = /(?:https:\/\/static\.pib\.gov\.in)?\/?WriteReadData\/(?:userfiles\/image|specificdocs\/photo)\/[^\s"'>]+/gi;
    const matches = Array.from(searchSpace.matchAll(imgRegex));

    const ignoredKeywords = ["azadikaamritmahotsav", "piblogo", "emblem", "banner", "g20", "header", "footer", "logo", "75_"];

    for (const match of matches) {
      let imgUrl = match[0];
      const lower = imgUrl.toLowerCase();
      if (ignoredKeywords.some(kw => lower.includes(kw))) {
        continue;
      }
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
    
    const buffer = await res.arrayBuffer();
    const xml = new TextDecoder("utf-8").decode(buffer);
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
  const parser = new Parser({
    customFields: {
      item: [
        ["media:content", "media:content", { keepArray: true }],
        ["media:thumbnail", "media:thumbnail", { keepArray: true }],
        ["media:group", "media:group"],
        ["enclosure", "enclosure"],
      ],
    },
  });
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

  // Live Hindustan / International / Category feeds matching user language
  if (!state) {
    if (category === "sports") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan Sports", url: "https://feed.livehindustan.com/rss/sports", source: "hindustan", defaultCategory: "sports" });
      } else {
        feedsToFetch.push({ name: "ESPN Cricinfo", url: "https://www.espncricinfo.com/rss/content/story/feeds/6.xml", source: "hindustan", defaultCategory: "sports" });
        feedsToFetch.push({ name: "India Today Sports", url: "https://www.indiatoday.in/rss/1206550", source: "hindustan", defaultCategory: "sports" });
      }
    } else if (category === "economy") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan Business", url: "https://feed.livehindustan.com/rss/business", source: "hindustan", defaultCategory: "economy" });
      } else {
        feedsToFetch.push({ name: "Inc42 Startup", url: "https://inc42.com/feed/", source: "hindustan", defaultCategory: "economy" });
        feedsToFetch.push({ name: "PIB Finance", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&MinId=7", source: "pib", defaultCategory: "economy" });
      }
    } else if (category === "technology") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan SciTech", url: "https://feed.livehindustan.com/rss/science-technology", source: "hindustan", defaultCategory: "technology" });
      } else {
        feedsToFetch.push({ name: "TechCrunch", url: "https://techcrunch.com/feed/", source: "hindustan", defaultCategory: "technology" });
        feedsToFetch.push({ name: "Digital India", url: "https://www.digitalindia.gov.in/rss.xml", source: "hindustan", defaultCategory: "technology" });
      }
    } else if (category === "science") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan SciTech", url: "https://feed.livehindustan.com/rss/science-technology", source: "hindustan", defaultCategory: "science" });
        feedsToFetch.push({ name: "PIB ISRO Hi", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&MinId=14", source: "pib", defaultCategory: "science" });
      } else {
        feedsToFetch.push({ name: "Mongabay India", url: "https://india.mongabay.com/feed/", source: "hindustan", defaultCategory: "science" });
        feedsToFetch.push({ name: "The Print Science", url: "https://theprint.in/category/science/feed/", source: "hindustan", defaultCategory: "science" });
      }
    } else if (category === "politics") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan National", url: "https://feed.livehindustan.com/rss/national", source: "hindustan", defaultCategory: "politics" });
        feedsToFetch.push({ name: "PIB Cabinet Hi", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&MinId=61", source: "pib", defaultCategory: "politics" });
      } else {
        feedsToFetch.push({ name: "The Print Politics", url: "https://theprint.in/category/politics/feed/", source: "hindustan", defaultCategory: "politics" });
        feedsToFetch.push({ name: "ProPublica", url: "https://www.propublica.org/feeds/propublica/main", source: "hindustan", defaultCategory: "politics" });
      }
    } else if (category === "entertainment") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan Entertainment", url: "https://feed.livehindustan.com/rss/entertainment", source: "hindustan", defaultCategory: "entertainment" });
      } else {
        feedsToFetch.push({ name: "Pinkvilla", url: "https://www.pinkvilla.com/rss.xml", source: "hindustan", defaultCategory: "entertainment" });
        feedsToFetch.push({ name: "Koimoi", url: "https://www.koimoi.com/feed/", source: "hindustan", defaultCategory: "entertainment" });
      }
    } else if (category === "health") {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan Lifestyle", url: "https://feed.livehindustan.com/rss/lifestyle", source: "hindustan", defaultCategory: "health" });
        feedsToFetch.push({ name: "PIB Health Hi", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&MinId=13", source: "pib", defaultCategory: "health" });
      } else {
        feedsToFetch.push({ name: "Medical News Today", url: "https://www.medicalnewstoday.com/feed", source: "hindustan", defaultCategory: "health" });
        feedsToFetch.push({ name: "PIB Health En", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&MinId=13", source: "pib", defaultCategory: "health" });
      }
    } else if (category === "international") {
      if (isHindi) {
        feedsToFetch.push({ name: "Global Voices Hindi", url: "https://hi.globalvoices.org/feed/", source: "hindustan", defaultCategory: "international" });
        feedsToFetch.push({ name: "BBC Hindi", url: "https://feeds.bbci.co.uk/hindi/rss.xml", source: "hindustan", defaultCategory: "international" });
      } else {
        feedsToFetch.push({ name: "Global Voices English", url: "https://globalvoices.org/feed", source: "hindustan", defaultCategory: "international" });
        feedsToFetch.push({ name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "hindustan", defaultCategory: "international" });
      }
    } else {
      if (isHindi) {
        feedsToFetch.push({ name: "Hindustan National", url: "https://feed.livehindustan.com/rss/national", source: "hindustan", defaultCategory: "national" });
      } else {
        feedsToFetch.push({ name: "The Conversation", url: "https://theconversation.com/articles.atom", source: "hindustan", defaultCategory: "national" });
        feedsToFetch.push({ name: "Doordarshan", url: "https://ddnews.gov.in/feed/", source: "hindustan", defaultCategory: "national" });
      }
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
        const buffer = await res.arrayBuffer();
        const xml = new TextDecoder("utf-8").decode(buffer);
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

        // For PIB items, scrape images in parallel (same as fetchPibArticles)
        const ibItemsWithImages = await Promise.all(
          parsed.items.map(async (item, index) => {
            const pridMatch = item.link?.match(/PRID=(\d+)/);
            const feedSlugName = feed.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
            const prid = pridMatch ? pridMatch[1] : `${feedSlugName}-${index}`;
            const hash = Buffer.from(item.link || `${feed.name}-${index}`).toString("base64url");
            const slug = feed.source === "pib" ? `pib-${prid}` : `hindustan-${hash}`;
            const itemCategory = feed.defaultCategory || getCategoryFromTitle(item.title || "");
            const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

            let heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800";

            if (item.enclosure?.url) {
              heroImage = item.enclosure.url;
            } else {
              const mediaContent = (item as any)["media:content"] || (item as any).mediaContent;
              if (mediaContent) {
                if (Array.isArray(mediaContent) && mediaContent[0]) {
                  heroImage = mediaContent[0].url || mediaContent[0].$.url || mediaContent[0].$?.url || heroImage;
                } else if (typeof mediaContent === "object") {
                  heroImage = mediaContent.url || mediaContent.$.url || mediaContent.$?.url || heroImage;
                }
              }
              if (heroImage.startsWith("https://images.unsplash.com")) {
                const mediaThumbnail = (item as any)["media:thumbnail"] || (item as any).mediaThumbnail;
                if (mediaThumbnail) {
                  if (Array.isArray(mediaThumbnail) && mediaThumbnail[0]) {
                    heroImage = mediaThumbnail[0].url || mediaThumbnail[0].$.url || mediaThumbnail[0].$?.url || heroImage;
                  } else if (typeof mediaThumbnail === "object") {
                    heroImage = mediaThumbnail.url || mediaThumbnail.$.url || mediaThumbnail.$?.url || heroImage;
                  }
                }
              }
              if (heroImage.startsWith("https://images.unsplash.com")) {
                const searchFields = [
                  (item as any)["content:encoded"] || "",
                  item.content || "",
                  (item as any).description || ""
                ];
                for (const field of searchFields) {
                  const imgMatch = field.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
                  if (imgMatch) {
                    heroImage = imgMatch[1];
                    break;
                  }
                }
              }
              // For PIB items: scrape the press release page for a real image
              if (heroImage.startsWith("https://images.unsplash.com") && feed.source === "pib" && pridMatch) {
                const scrapedImg = await getPibArticleImage(prid);
                if (scrapedImg) heroImage = scrapedImg;
              }
            }

            return {
              id: slug,
              slug,
              title: item.title || "",
              standfirst: item.contentSnippet || (item as any).description || (isHindi ? "विज्ञप्ति।" : "Official Release."),
              body: item.content || item.contentSnippet || "",
              category: itemCategory,
              tags: feed.source === "pib" ? ["PIB"] : ["Hindustan"],
              states: state ? [state] : [],
              authorId: feed.source === "pib" ? "pib-scraper" : "hindustan-scraper",
              publishedAt: pubDate,
              views: 100 + index * 5,
              heroImage,
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
            };
          })
        );
        ibItemsWithImages.forEach(article => articles.push(article));
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
      take: Math.max(200, limit * 4), // Fetch a larger batch to filter by language
      include: { author: true, category: true },
    });
    serializedDb = dbArticles.map(serializeArticle);

    // Native language partitioning
    const wantHindi = lang === "hi";
    serializedDb = serializedDb.filter((art) => {
      const isHindi = /[\u0900-\u097F]/.test(art.title);
      return wantHindi ? isHindi : !isHindi;
    });
    
    // If DB is empty or has no matches for the selected language, fetch live fallback feeds
    if (serializedDb.length === 0) {
      const fallback = await fetchLiveFallbackFeeds(lang, category, state, breaking, featured, date);
      serializedDb = fallback.filter((art) => {
        const isHindi = /[\u0900-\u097F]/.test(art.title);
        return wantHindi ? isHindi : !isHindi;
      });
    }
  } catch (dbError) {
    console.error("Prisma database connection failed. Falling back to live RSS feeds:", dbError);
    const fallback = await fetchLiveFallbackFeeds(lang, category, state, breaking, featured, date);
    const wantHindi = lang === "hi";
    serializedDb = fallback.filter((art) => {
      const isHindi = /[\u0900-\u097F]/.test(art.title);
      return wantHindi ? isHindi : !isHindi;
    });
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

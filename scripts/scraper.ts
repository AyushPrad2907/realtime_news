import { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";

const db = new PrismaClient();
const parser = new Parser();

interface FeedConfig {
  name: string;
  url: string;
  source: "pib" | "hindustan";
  defaultCategory?: string;
  state?: string;
  lang: "hi" | "en";
}

const FEEDS: FeedConfig[] = [
  // National PIB
  {
    name: "PIB National (Hindi)",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2",
    source: "pib",
    lang: "hi",
  },
  {
    name: "PIB National (English)",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1",
    source: "pib",
    lang: "en",
  },
  // Regional PIB (State releases)
  {
    name: "PIB Delhi (Hindi)",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=3",
    source: "pib",
    state: "Delhi",
    lang: "hi",
  },
  {
    name: "PIB Bihar (Hindi)",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=13",
    source: "pib",
    state: "Bihar",
    lang: "hi",
  },
  {
    name: "PIB Punjab (Hindi)",
    url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&Regid=20",
    source: "pib",
    state: "Punjab",
    lang: "hi",
  },
  // Live Hindustan
  {
    name: "Live Hindustan National (Hindi)",
    url: "https://feed.livehindustan.com/rss/national",
    source: "hindustan",
    defaultCategory: "national",
    lang: "hi",
  },
  {
    name: "Live Hindustan Business (Hindi)",
    url: "https://feed.livehindustan.com/rss/business",
    source: "hindustan",
    defaultCategory: "economy",
    lang: "hi",
  },
  {
    name: "Live Hindustan Sports (Hindi)",
    url: "https://feed.livehindustan.com/rss/sports",
    source: "hindustan",
    defaultCategory: "sports",
    lang: "hi",
  },
  {
    name: "Live Hindustan Science & Tech (Hindi)",
    url: "https://feed.livehindustan.com/rss/science-technology",
    source: "hindustan",
    defaultCategory: "technology",
    lang: "hi",
  },
];

// Helper to determine category from keywords
function getCategoryFromText(text: string, defaultCat = "national"): string {
  const t = text.toLowerCase();
  if (t.includes("cabinet") || t.includes("election") || t.includes("parliament") || t.includes("pm modi") || t.includes("narendra modi") || t.includes("minister") || t.includes("president")) {
    if (t.includes("visit") || t.includes("international") || t.includes("bilateral") || t.includes("foreign")) {
      return "international";
    }
    return "politics";
  }
  if (t.includes("economy") || t.includes("gst") || t.includes("gdp") || t.includes("tax") || t.includes("finance") || t.includes("budget") || t.includes("trade") || t.includes("commerce") || t.includes("शेयर") || t.includes("बाजार") || t.includes("व्यापार")) {
    return "economy";
  }
  if (t.includes("sports") || t.includes("hockey") || t.includes("cricket") || t.includes("championship") || t.includes("medal") || t.includes("khelo") || t.includes("खेल") || t.includes("मैच") || t.includes("टीम")) {
    return "sports";
  }
  if (t.includes("health") || t.includes("ayushman") || t.includes("disease") || t.includes("medical") || t.includes("vaccine") || t.includes("स्वास्थ्य") || t.includes("अस्पताल") || t.includes("डॉक्टर")) {
    return "health";
  }
  if (t.includes("technology") || t.includes("digital") || t.includes("software") || t.includes("telecom") || t.includes("ai") || t.includes("स्मार्टफोन") || t.includes("लॉन्च")) {
    return "technology";
  }
  if (t.includes("space") || t.includes("isro") || t.includes("satellite") || t.includes("science") || t.includes("research") || t.includes("विज्ञान") || t.includes("अंतरिक्ष")) {
    return "science";
  }
  if (t.includes("entertainment") || t.includes("film") || t.includes("cinema") || t.includes("movie") || t.includes("actor") || t.includes("actress") || t.includes("मनोरंजन") || t.includes("फिल्म") || t.includes("सिनेमा")) {
    return "entertainment";
  }
  return defaultCat;
}

// Scrape full body from PIB release
async function scrapePibBody(prid: string): Promise<string> {
  const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return "";
    const html = await res.text();
    
    // Extract PdfDiv block using simple balancer or basic tag index
    const startTag = 'id="PdfDiv"';
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) return "";

    const startIndex = html.lastIndexOf("<div", startIdx);
    if (startIndex === -1) return "";

    const tagEndIndex = html.indexOf(">", startIdx);
    if (tagEndIndex === -1) return "";

    let depth = 1;
    let currentIndex = tagEndIndex + 1;

    while (depth > 0 && currentIndex < html.length) {
      const nextOpen = html.indexOf("<div", currentIndex);
      const nextClose = html.indexOf("</div>", currentIndex);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        currentIndex = nextOpen + 4;
      } else {
        depth--;
        currentIndex = nextClose + 6;
      }
    }

    let bodyHtml = html.substring(tagEndIndex + 1, currentIndex - 6).trim();

    // Sanitize and clean up formatting
    bodyHtml = bodyHtml
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<font[^>]*>/gi, "")
      .replace(/<\/font>/gi, "")
      .replace(/style=["'][^"']*(?:color|background)[^"']*["']/gi, "");

    return bodyHtml;
  } catch (e) {
    console.error("Failed to scrape PIB body for PRID:", prid, e);
  }
  return "";
}

// Ensure default scraper users exist in the database
async function ensureScraperUsers() {
  await db.user.upsert({
    where: { email: "pib-scraper@newsvarta.com" },
    create: {
      id: "pib-scraper",
      email: "pib-scraper@newsvarta.com",
      name: "पत्र सूचना कार्यालय (PIB)",
      passwordHash: "no-login-allowed",
      role: "EDITOR",
      status: "ACTIVE",
      jobTitle: "ऑटोमेटेड फीड",
    },
    update: {},
  });

  await db.user.upsert({
    where: { email: "hindustan-scraper@newsvarta.com" },
    create: {
      id: "hindustan-scraper",
      email: "hindustan-scraper@newsvarta.com",
      name: "लाइव हिन्दुस्तान",
      passwordHash: "no-login-allowed",
      role: "EDITOR",
      status: "ACTIVE",
      jobTitle: "ऑटोमेटेड फीड",
    },
    update: {},
  });
}

// Main run loop of the scraper
async function runScraper() {
  console.log(`[${new Date().toLocaleTimeString()}] Running automated news feed scraper...`);
  try {
    await ensureScraperUsers();

    for (const feed of FEEDS) {
      console.log(`Processing: ${feed.name}`);
      try {
        const res = await fetch(feed.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (!res.ok) {
          console.warn(`Failed to fetch feed ${feed.name}: ${res.status}`);
          continue;
        }

        const xml = await res.text();
        const parsed = await parser.parseString(xml);

        for (const item of parsed.items) {
          if (!item.title || !item.link) continue;

          // Generate unique slug
          let slug = "";
          let authorId = "";
          let body = "";
          let categorySlug = feed.defaultCategory || "national";
          let stateTags: string | null = null;
          let heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60"; // Default news image
          let heroCaption = feed.name;

          if (feed.source === "pib") {
            const pridMatch = item.link.match(/PRID=([0-9]+)/i);
            const prid = pridMatch ? pridMatch[1] : "";
            if (!prid) continue;
            slug = `pib-${prid}`;
            authorId = "pib-scraper";
            categorySlug = getCategoryFromText(item.title, "national");
            body = await scrapePibBody(prid);
          } else if (feed.source === "hindustan") {
            const hash = Buffer.from(item.link).toString("base64").substring(0, 16);
            slug = `hindustan-${hash}`;
            authorId = "hindustan-scraper";
            categorySlug = feed.defaultCategory || getCategoryFromText(item.title, "national");
            body = item.content || item.summary || item.description || "";
            // wrap basic description text in HTML tags if not raw HTML
            if (body && !body.includes("<p>")) {
              body = `<p>${body}</p>`;
            }
          }

          if (!slug || !body) continue;

          // Add state tag if regional feed
          if (feed.state) {
            stateTags = JSON.stringify([feed.state]);
          }

          // Check if article already exists
          const existing = await db.article.findUnique({
            where: { slug },
          });

          if (existing) continue; // Skip duplicates

          console.log(`Adding new article: ${item.title}`);
          const dateStr = item.pubDate || item.isoDate || new Date().toISOString();

          await db.article.create({
            data: {
              slug,
              title: item.title,
              standfirst: item.summary || item.description || item.title,
              body,
              categorySlug,
              tags: JSON.stringify(feed.source === "pib" ? ["PIB", "Official"] : ["Hindustan", "Latest"]),
              stateTags,
              authorId,
              status: "PUBLISHED",
              heroImage,
              heroCaption,
              heroCredit: feed.source === "pib" ? "PIB" : "Live Hindustan",
              readingTime: Math.max(3, Math.ceil(body.split(" ").length / 200)),
              publishedAt: new Date(dateStr),
              approvedAt: new Date(),
              submittedAt: new Date(),
            },
          });
        }
      } catch (err) {
        console.error(`Error scraping feed ${feed.name}:`, err);
      }
    }
    console.log(`[${new Date().toLocaleTimeString()}] Scraper run completed successfully.`);
  } catch (globalErr) {
    console.error("Global scraper crash:", globalErr);
  }
}

// Standard cron-loop: run every 10 minutes when script is executed in daemon mode
if (process.argv.includes("--daemon")) {
  runScraper();
  setInterval(runScraper, 10 * 60 * 1000); // 10 minutes
} else {
  runScraper().then(() => process.exit(0));
}

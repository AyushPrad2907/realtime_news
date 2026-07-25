import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";

const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const db = new PrismaClient({
  datasources: {
    db: {
      url: connectionUrl
        ? connectionUrl.includes("?")
          ? `${connectionUrl}&connection_limit=1`
          : `${connectionUrl}?connection_limit=1`
        : undefined,
    },
  },
});
const parser = new Parser();

interface FeedConfig {
  name: string;
  url: string;
  source: "pib" | "hindustan" | "general-rss";
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
  // --- Working General Feeds ---
  {
    name: "IRCTC News Blog Feed",
    url: "https://irctcnews.in/feed",
    source: "general-rss",
    defaultCategory: "national",
    lang: "en",
  },
  {
    name: "The Print Science Feed",
    url: "https://theprint.in/category/science/feed/",
    source: "general-rss",
    defaultCategory: "science",
    lang: "en",
  },
  {
    name: "ESPN Cricinfo India",
    url: "https://www.espncricinfo.com/rss/content/story/feeds/6.xml",
    source: "general-rss",
    defaultCategory: "sports",
    lang: "en",
  },
  {
    name: "India Today Sports",
    url: "https://www.indiatoday.in/rss/1206550",
    source: "general-rss",
    defaultCategory: "sports",
    lang: "en",
  },
  {
    name: "The Hindu Politics Feed",
    url: "https://www.thehindu.com/news/national/feeder/default.rss",
    source: "general-rss",
    defaultCategory: "politics",
    lang: "en",
  },
  {
    name: "The Print Politics Feed",
    url: "https://theprint.in/category/politics/feed/",
    source: "general-rss",
    defaultCategory: "politics",
    lang: "en",
  },
  {
    name: "Pinkvilla Entertainment",
    url: "https://www.pinkvilla.com/rss.xml",
    source: "general-rss",
    defaultCategory: "entertainment",
    lang: "en",
  },
  {
    name: "Koimoi Entertainment Feed",
    url: "https://www.koimoi.com/feed/",
    source: "general-rss",
    defaultCategory: "entertainment",
    lang: "en",
  },
  {
    name: "BollywoodHungama News",
    url: "https://www.bollywoodhungama.com/rss/news.xml",
    source: "general-rss",
    defaultCategory: "entertainment",
    lang: "en",
  },

  // --- Creative Commons (CC-BY) / Open Sources ---
  {
    name: "Global Voices (Hindi)",
    url: "https://hi.globalvoices.org/feed/",
    source: "general-rss",
    defaultCategory: "international",
    lang: "hi",
  },
  {
    name: "Global Voices (English)",
    url: "https://globalvoices.org/feed",
    source: "general-rss",
    defaultCategory: "international",
    lang: "en",
  },
  {
    name: "Mongabay India (English)",
    url: "https://india.mongabay.com/feed/",
    source: "general-rss",
    defaultCategory: "science",
    lang: "en",
  },
  {
    name: "The Conversation",
    url: "https://theconversation.com/articles.atom",
    source: "general-rss",
    defaultCategory: "national",
    lang: "en",
  },
  {
    name: "ProPublica",
    url: "https://www.propublica.org/feeds/propublica/main",
    source: "general-rss",
    defaultCategory: "politics",
    lang: "en",
  }
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

// Helper to extract specific search/topic tags from title and body text
function extractCustomTags(title: string, body: string): string[] {
  const tags: string[] = [];
  const text = `${title} ${body}`.toLowerCase();

  // PSC exam bodies
  if (text.includes("upsc") || text.includes("union public service") || text.includes("संघ लोक सेवा आयोग")) tags.push("UPSC");
  if (text.includes("mpsc") || text.includes("महाराष्ट्र लोक सेवा आयोग")) tags.push("MPSC");
  if (text.includes("bpsc") || text.includes("bihar public service") || text.includes("बिहार लोक सेवा आयोग")) tags.push("BPSC");
  if (text.includes("hpsc") || text.includes("haryana public service") || text.includes("हरियाणा लोक सेवा आयोग")) tags.push("HPSC");
  if (text.includes("rpsc") || text.includes("rajasthan public service") || text.includes("राजस्थान लोक सेवा आयोग")) tags.push("Rajasthan Public Service Commission");
  if (text.includes("ukpsc") || text.includes("uttarakhand public service") || text.includes("उत्तराखंड लोक सेवा आयोग")) tags.push("UKPSC");
  if (text.includes("cgpsc") || text.includes("chhattisgarh public service") || text.includes("छत्तीसगढ़ लोक सेवा आयोग")) tags.push("Chhattisgarh PSC");

  // Railways
  if (text.includes("railway") || text.includes("irctc") || text.includes("रेलवे") || text.includes("भारतीय रेल")) tags.push("Railways");

  // Banking
  if (text.includes("banking") || text.includes(" rbi") || text.includes("reserve bank") || text.includes("भारतीय रिजर्व बैंक")) tags.push("RBI");
  if (text.includes("ibps") || text.includes("ibpsc")) tags.push("IBPSC");
  if (text.includes("bank") || text.includes("बैंक")) tags.push("Banking");

  // SSC / Boards
  if (text.includes("bssc") || text.includes("bihar staff selection") || text.includes("बिहार कर्मचारी चयन")) tags.push("Bihar Staff Selection");
  if (text.includes("ugc") || text.includes("university grants") || text.includes("विश्वविद्यालय अनुदान")) tags.push("UGC");
  if (text.includes("ssc") || text.includes("staff selection commission") || text.includes("कर्मचारी चयन आयोग")) tags.push("SSC");

  // Space & Defence
  if (text.includes("isro") || text.includes("इसरो") || text.includes("space research")) tags.push("ISRO");
  if (text.includes("drdo") || text.includes("डीआरडीओ") || text.includes("defence research")) tags.push("DRDO");
  if (text.includes("barc") || text.includes("भाभा परमाणु") || text.includes("bhabha atomic")) tags.push("BARC");

  // Sports
  if (text.includes("bcci") || text.includes("cricket") || text.includes("क्रिकेट")) tags.push("BCCI");
  if (text.includes("hockey india") || text.includes("hockey federation") || text.includes("हॉकी")) tags.push("Hockey Federation of India");
  if (text.includes("olympic") || text.includes("ioa") || text.includes("ओलंपिक")) tags.push("Indian Olympic Committee");

  // Political Parties
  if (text.includes("bjp") || text.includes("भाजपा") || text.includes("भारतीय जनता पार्टी")) tags.push("BJP");
  if (text.includes("inc") || text.includes("congress") || text.includes("कांग्रेस")) tags.push("INC");
  if (text.includes("samajwadi") || text.includes("समाजवादी पार्टी") || text.includes(" sp ")) tags.push("Samajwadi Party");
  if (text.includes("rjd") || text.includes("राष्ट्रीय जनता दल")) tags.push("RJD");
  if (text.includes("jdu") || text.includes("zdy") || text.includes("j.d.u") || text.includes("janata dal (united)") || text.includes("जनता दल (यूनाइटेड)")) tags.push("JDU");
  if (text.includes("bjd") || text.includes("बीजू जनता दल")) tags.push("BJD");
  if (text.includes("dmk") || text.includes("द्रमुक")) tags.push("DMK");
  if (text.includes("aidmk") || text.includes("aiadmk") || text.includes("अन्नाद्रमुक")) tags.push("AIDMK");
  if (text.includes("ncp") || text.includes("राष्ट्रवादी कांग्रेस")) tags.push("NCP");
  if (text.includes("shiv sena") || text.includes("शिवसेना") || text.includes("shivsena")) tags.push("Shiv Sena");
  if (text.includes("mns") || text.includes("मनसे") || text.includes("maharashtra navnirman")) tags.push("MNS");

  // Personalities
  if (text.includes("byakti") || text.includes("personality") || text.includes("व्यक्ति")) tags.push("Byakti");

  // Cine World
  if (text.includes("bollywood") || text.includes("cinema") || text.includes("entertainment") || text.includes("film") || text.includes("movie") || text.includes("मनोरंजन") || text.includes("फिल्म") || text.includes("सिनेमा")) {
    tags.push("Cine World");
  }

  return tags;
}

// Scrape full body from PIB release
async function scrapePibBody(prid: string): Promise<string> {
  const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;
  let html = "";
  let retries = 3;
  let delay = 500;

  while (retries > 0) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          throw new Error(`HTTP status ${res.status}`);
        }
        return "";
      }
      html = await res.text();
      break;
    } catch (e: any) {
      retries--;
      if (retries === 0) {
        console.error(`Failed to scrape PIB body for PRID: ${prid} after retries. Error:`, e.message || e);
        return "";
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 3;
    }
  }

  try {
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

  await db.user.upsert({
    where: { email: "rss-scraper@newsvarta.com" },
    create: {
      id: "automated-rss-scraper",
      email: "rss-scraper@newsvarta.com",
      name: "न्यूज़वार्ता समाचार सेवा",
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

    // Cleanup old articles (older than 1 day)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleteResult = await db.article.deleteMany({
      where: {
        publishedAt: {
          lt: oneDayAgo,
        },
      },
    });
    console.log(`[Cleanup] Deleted ${deleteResult.count} articles older than 1 day.`);

    for (const feed of FEEDS) {
      console.log(`Processing: ${feed.name}`);
      try {
        let res;
        let retries = 3;
        let delay = 500;
        let fetchSuccess = false;

        while (retries > 0) {
          try {
            res = await fetch(feed.url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/xml, text/xml, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
              },
            });
            if (!res.ok) {
              if (res.status === 429 || res.status >= 500) {
                throw new Error(`HTTP status ${res.status}`);
              }
              console.warn(`Failed to fetch feed ${feed.name}: ${res.status}`);
              break;
            }
            fetchSuccess = true;
            break;
          } catch (fetchErr: any) {
            retries--;
            if (retries === 0) {
              console.warn(`Failed to fetch feed ${feed.name} after retries: ${fetchErr.message || fetchErr}`);
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 3;
          }
        }

        if (!fetchSuccess || !res) {
          continue;
        }

        const xml = await res.text();
        const trimmedXml = xml.trim();
        if (trimmedXml.startsWith("<!DOCTYPE html") || trimmedXml.startsWith("<html") || trimmedXml.startsWith("<!doctype html")) {
          console.warn(`Failed to parse feed ${feed.name}: Content is HTML, not XML.`);
          continue;
        }

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
        
        let parsed;
        try {
          parsed = await parser.parseString(cleanXml);
        } catch (parseErr: any) {
          console.warn(`Failed to parse feed ${feed.name}: ${parseErr.message || parseErr}`);
          continue;
        }

        for (const item of parsed.items) {
          if (!item.title || !item.link) continue;

          // Generate unique slug
          let slug = "";
          let authorId = "";
          let body = "";
          let categorySlug = feed.defaultCategory || "national";
          let stateTags: string | null = null;
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
            if (body && !body.includes("<p>")) {
              body = `<p>${body}</p>`;
            }
          } else {
            // General RSS feed handler
            const hash = Buffer.from(item.link).toString("base64").substring(0, 16);
            slug = `rss-${hash}`;
            authorId = "automated-rss-scraper";
            categorySlug = feed.defaultCategory || getCategoryFromText(item.title, "national");
            body = item.content || item.summary || item.description || "";
            if (body && !body.includes("<p>")) {
              body = `<p>${body}</p>`;
            }
          }

          if (!slug || !body) continue;

          // Extract image from RSS item metadata (enclosure, media:content, media:thumbnail)
          let rssImage: string | null = null;
          if (item.enclosure?.url) {
            rssImage = item.enclosure.url;
          } else {
            const mediaContent = (item as any)["media:content"] || (item as any).mediaContent;
            if (mediaContent) {
              if (Array.isArray(mediaContent) && mediaContent[0]?.$.url) {
                rssImage = mediaContent[0].$.url;
              } else if (mediaContent.$?.url) {
                rssImage = mediaContent.$.url;
              } else if (typeof mediaContent === "object" && mediaContent.url) {
                rssImage = mediaContent.url;
              }
            }
            if (!rssImage) {
              const mediaThumbnail = (item as any)["media:thumbnail"] || (item as any).mediaThumbnail;
              if (mediaThumbnail) {
                if (Array.isArray(mediaThumbnail) && mediaThumbnail[0]?.$.url) {
                  rssImage = mediaThumbnail[0].$.url;
                } else if (mediaThumbnail.$?.url) {
                  rssImage = mediaThumbnail.$.url;
                } else if (typeof mediaThumbnail === "object" && mediaThumbnail.url) {
                  rssImage = mediaThumbnail.url;
                }
              }
            }
          }

          let heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60";
          if (rssImage) {
            heroImage = rssImage;
          } else {
            // Fallback to extracting the first image from the article body HTML
            const imgMatch = body.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
            if (imgMatch) {
              let src = imgMatch[1];
              if (src.startsWith("/")) {
                try {
                  const origin = new URL(feed.url).origin;
                  src = `${origin}${src}`;
                } catch (e) {}
              } else if (src.startsWith("../")) {
                try {
                  const origin = new URL(feed.url).origin;
                  src = `${origin}/${src.replace(/^\.\.\//, "")}`;
                } catch (e) {}
              }
              heroImage = src;
            }
          }

          // Add state tag if regional feed
          if (feed.state) {
            stateTags = JSON.stringify([feed.state]);
          }

          // Check if article already exists
          const existing = await db.article.findUnique({
            where: { slug },
          });

          if (existing) continue; // Skip duplicates

          const dateStr = item.pubDate || item.isoDate || new Date().toISOString();
          const publishedAtDate = new Date(dateStr);
          if (publishedAtDate < oneDayAgo) {
            continue; // Skip articles older than 24 hours (would be immediately cleaned up anyway)
          }

          console.log(`Adding new article: ${item.title}`);

          // Extract custom search and topic tags
          const customTags = extractCustomTags(item.title, body);
          const baseTags = feed.source === "pib" ? ["PIB", "Official"] : feed.source === "hindustan" ? ["Hindustan", "Latest"] : ["News", feed.name];
          const allTags = Array.from(new Set([...baseTags, ...customTags]));

          await db.article.create({
            data: {
              slug,
              title: item.title,
              standfirst: item.summary || item.description || item.title,
              body,
              categorySlug,
              tags: JSON.stringify(allTags),
              stateTags,
              authorId,
              status: "PUBLISHED",
              heroImage,
              heroCaption,
              heroCredit: feed.source === "pib" ? "PIB" : feed.source === "hindustan" ? "Live Hindustan" : feed.name,
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

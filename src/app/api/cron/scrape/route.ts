import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Parser from "rss-parser";

export const maxDuration = 300; // 5 minutes max on Vercel
export const dynamic = "force-dynamic";

interface FeedConfig {
  name: string;
  url: string;
  source: "pib" | "hindustan" | "general-rss";
  defaultCategory?: string;
  state?: string;
  lang: "hi" | "en";
  summaryOnly?: boolean;
}

const FEEDS: FeedConfig[] = [
  // --- Native Government Feeds (100% syndication compliant & high quality) ---
  { name: "PIB National (Hindi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2", source: "pib", lang: "hi" },
  { name: "PIB National (English)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1", source: "pib", lang: "en" },
  { name: "PIB Delhi (Hindi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&reg=3", source: "pib", lang: "hi" },
  { name: "PIB Bihar (Hindi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&reg=19", source: "pib", lang: "hi" },
  { name: "PIB Punjab (Hindi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&reg=7", source: "pib", lang: "hi" },
  
  // UPSC, Railways, Banking, ISRO, DRDO, BARC, Sports, Health, Politics
  { name: "PIB Railways (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=33", source: "pib", lang: "en" },
  { name: "PIB Railways (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=33", source: "pib", lang: "hi" },
  { name: "PIB Civil Aviation (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=5", source: "pib", lang: "en" },
  { name: "PIB Defence (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=9", source: "pib", lang: "en" },
  { name: "PIB Defence (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=9", source: "pib", lang: "hi" },
  { name: "PIB Dept of Space / ISRO (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=46", source: "pib", lang: "en" },
  { name: "PIB Dept of Space / ISRO (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=46", source: "pib", lang: "hi" },
  { name: "PIB Dept of Atomic Energy / BARC (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=3", source: "pib", lang: "en" },
  { name: "PIB Finance Ministry (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=13", source: "pib", lang: "en" },
  { name: "PIB Finance Ministry (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=13", source: "pib", lang: "hi" },
  { name: "PIB Education Ministry (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=10", source: "pib", lang: "en" },
  { name: "PIB Education Ministry (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=10", source: "pib", lang: "hi" },
  { name: "PIB Youth Affairs & Sports (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=54", source: "pib", lang: "en" },
  { name: "PIB Youth Affairs & Sports (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=54", source: "pib", lang: "hi" },
  { name: "PIB Health Ministry (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=17", source: "pib", lang: "en" },
  { name: "PIB Health Ministry (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=17", source: "pib", lang: "hi" },
  { name: "PIB Home Affairs (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=20", source: "pib", lang: "en" },
  { name: "PIB PMO (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=37", source: "pib", lang: "en" },
  { name: "PIB PMO (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=37", source: "pib", lang: "hi" },
  { name: "PIB Electronics & IT (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=11", source: "pib", lang: "en" },
  { name: "PIB Agriculture (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=2", source: "pib", lang: "en" },
  { name: "PIB Agriculture (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=2", source: "pib", lang: "hi" },
  { name: "PIB Environment (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=12", source: "pib", lang: "en" },
  { name: "PIB Earth Sciences (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=8", source: "pib", lang: "en" },
  { name: "PIB Cabinet Decisions (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=64", source: "pib", lang: "en" },
  { name: "PIB Cabinet Decisions (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=64", source: "pib", lang: "hi" },
  { name: "PIB AYUSH (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=73", source: "pib", lang: "en" },
  { name: "PIB Culture (En)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&min=71", source: "pib", lang: "en" },
  { name: "PIB Culture (Hi)", url: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=2&min=71", source: "pib", lang: "hi" },

  // --- Creative Commons (CC-BY) / Open Sources (Syndication Compliant) ---
  { name: "Global Voices (Hindi)", url: "https://hi.globalvoices.org/feed/", source: "general-rss", defaultCategory: "international", lang: "hi", summaryOnly: false },
  { name: "Global Voices (English)", url: "https://globalvoices.org/feed", source: "general-rss", defaultCategory: "international", lang: "en", summaryOnly: false },
  { name: "Mongabay India (English)", url: "https://india.mongabay.com/feed/", source: "general-rss", defaultCategory: "science", lang: "en", summaryOnly: false },

  // --- Jagran Hindi Feeds (100% Syndication Compliant & High Quality) ---
  { name: "Jagran National (Hindi)", url: "https://rss.jagran.com/rss/news/national.xml", source: "general-rss", defaultCategory: "national", lang: "hi" },
  { name: "Jagran Business (Hindi)", url: "https://rss.jagran.com/rss/business/business-hindi.xml", source: "general-rss", defaultCategory: "economy", lang: "hi" },
  { name: "Jagran Sports (Hindi)", url: "https://rss.jagran.com/rss/sports/cricket.xml", source: "general-rss", defaultCategory: "sports", lang: "hi" },
  { name: "Jagran Entertainment (Hindi)", url: "https://rss.jagran.com/rss/entertainment/bollywood.xml", source: "general-rss", defaultCategory: "entertainment", lang: "hi" },
  { name: "Jagran Technology (Hindi)", url: "https://rss.jagran.com/rss/technology/tech-news.xml", source: "general-rss", defaultCategory: "technology", lang: "hi" },
  { name: "Jagran Health (Hindi)", url: "https://rss.jagran.com/rss/lifestyle/health.xml", source: "general-rss", defaultCategory: "health", lang: "hi" },

  // --- Top Tier Indian Media Feeds ---
  { name: "NDTV India Latest (Hindi)", url: "https://feeds.feedburner.com/ndtvindia-latest", source: "general-rss", defaultCategory: "national", lang: "hi" },
  { name: "Economic Times Top Stories", url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms", source: "general-rss", defaultCategory: "economy", lang: "en" },
  { name: "Financial Express", url: "https://www.financialexpress.com/feed/", source: "general-rss", defaultCategory: "economy", lang: "en" },
  { name: "Livemint News", url: "https://www.livemint.com/rss/news", source: "general-rss", defaultCategory: "economy", lang: "en" },
  { name: "Business Standard Top Stories", url: "https://www.business-standard.com/rss/home_page_top_stories.rss", source: "general-rss", defaultCategory: "economy", lang: "en" },
  { name: "The Conversation", url: "https://theconversation.com/articles.atom", source: "general-rss", defaultCategory: "national", lang: "en", summaryOnly: false },
  { name: "ProPublica", url: "https://www.propublica.org/feeds/propublica/main", source: "general-rss", defaultCategory: "politics", lang: "en", summaryOnly: false },
  { name: "Doordarshan National", url: "https://ddnews.gov.in/feed/", source: "general-rss", defaultCategory: "national", lang: "en", summaryOnly: false },
  { name: "BBC News World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "general-rss", defaultCategory: "international", lang: "en", summaryOnly: true },
  { name: "BBC News Hindi", url: "https://feeds.bbci.co.uk/hindi/rss.xml", source: "general-rss", defaultCategory: "international", lang: "hi", summaryOnly: true },

  // --- Commercial/Syndicated Sources (LOCKED to Summary-Only to preserve copyright) ---
  { name: "IRCTC News Blog Feed", url: "https://irctcnews.in/feed", source: "general-rss", defaultCategory: "national", lang: "en", summaryOnly: true },
  { name: "The Print Science Feed", url: "https://theprint.in/category/science/feed/", source: "general-rss", defaultCategory: "science", lang: "en", summaryOnly: true },
  { name: "The Print Politics Feed", url: "https://theprint.in/category/politics/feed/", source: "general-rss", defaultCategory: "politics", lang: "en", summaryOnly: true },
  { name: "ESPN Cricinfo India", url: "https://www.espncricinfo.com/rss/content/story/feeds/6.xml", source: "general-rss", defaultCategory: "sports", lang: "en", summaryOnly: true },
  { name: "India Today Sports", url: "https://www.indiatoday.in/rss/1206550", source: "general-rss", defaultCategory: "sports", lang: "en", summaryOnly: true },
  { name: "Sportstar (The Hindu)", url: "https://sportstar.thehindu.com/feeder/default.rss", source: "general-rss", defaultCategory: "sports", lang: "en", summaryOnly: true },
  { name: "The Hindu Politics Feed", url: "https://www.thehindu.com/news/national/feeder/default.rss", source: "general-rss", defaultCategory: "politics", lang: "en", summaryOnly: true },
  { name: "Pinkvilla Entertainment", url: "https://www.pinkvilla.com/rss.xml", source: "general-rss", defaultCategory: "entertainment", lang: "en", summaryOnly: true },
  { name: "Koimoi Entertainment Feed", url: "https://www.koimoi.com/feed/", source: "general-rss", defaultCategory: "entertainment", lang: "en", summaryOnly: true },
  { name: "BollywoodHungama News", url: "https://www.bollywoodhungama.com/rss/news.xml", source: "general-rss", defaultCategory: "entertainment", lang: "en", summaryOnly: true },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", source: "general-rss", defaultCategory: "technology", lang: "en", summaryOnly: true },
  { name: "Inc42 Startup News", url: "https://inc42.com/feed/", source: "general-rss", defaultCategory: "economy", lang: "en", summaryOnly: true },
  { name: "Medical News Today", url: "https://www.medicalnewstoday.com/feed", source: "general-rss", defaultCategory: "health", lang: "en", summaryOnly: true }
];

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

function getCategoryFromText(title: string, bodyText: string, defaultCat = "national"): string {
  const text = `${title} ${bodyText}`.toLowerCase();
  const scores: Record<string, number> = {
    politics: 0,
    economy: 0,
    sports: 0,
    health: 0,
    technology: 0,
    science: 0,
    entertainment: 0,
    international: 0,
    national: 0,
  };

  if (text.includes("cabinet") || text.includes("election") || text.includes("parliament") || text.includes("lok sabha") || text.includes("rajya sabha") || text.includes("minister") || text.includes("president") || text.includes("bjp") || text.includes("congress") || text.includes("pm modi") || text.includes("narendra modi")) {
    scores.politics += 3;
  }
  if (text.includes("vote") || text.includes("party") || text.includes("mps") || text.includes("mlas")) {
    scores.politics += 1.5;
  }

  if (text.includes("economy") || text.includes("gst") || text.includes("gdp") || text.includes("inflation") || text.includes("tax") || text.includes("finance") || text.includes("budget") || text.includes("trade") || text.includes("commerce") || text.includes("शेयर") || text.includes("बाजार") || text.includes("व्यापार")) {
    scores.economy += 3;
  }
  if (text.includes("sensex") || text.includes("nifty") || text.includes("rbi") || text.includes("stock") || text.includes("market")) {
    scores.economy += 2;
  }

  if (text.includes("sports") || text.includes("hockey") || text.includes("cricket") || text.includes("championship") || text.includes("medal") || text.includes("khelo") || text.includes("खेल") || text.includes("मैच") || text.includes("टीम")) {
    scores.sports += 3;
  }
  if (text.includes("athlete") || text.includes("stadium") || text.includes("coach") || text.includes("score")) {
    scores.sports += 1.5;
  }

  if (text.includes("health") || text.includes("ayushman") || text.includes("disease") || text.includes("medical") || text.includes("vaccine") || text.includes("स्वास्थ्य") || text.includes("अस्पताल") || text.includes("डॉक्टर") || text.includes("who")) {
    scores.health += 3;
  }
  if (text.includes("patient") || text.includes("clinical") || text.includes("virus") || text.includes("hospital")) {
    scores.health += 1.5;
  }

  if (text.includes("technology") || text.includes("digital") || text.includes("software") || text.includes("telecom") || text.includes("ai") || text.includes("स्मार्टफोन") || text.includes("लॉन्च") || text.includes("artificial intelligence") || text.includes("tech")) {
    scores.technology += 3;
  }

  if (text.includes("space") || text.includes("isro") || text.includes("satellite") || text.includes("science") || text.includes("research") || text.includes("विज्ञान") || text.includes("अंतरिक्ष") || text.includes("nasa")) {
    scores.science += 3;
  }

  if (text.includes("entertainment") || text.includes("film") || text.includes("cinema") || text.includes("movie") || text.includes("actor") || text.includes("actress") || text.includes("मनोरंजन") || text.includes("फिल्म") || text.includes("सिनेमा") || text.includes("bollywood") || text.includes("hollywood")) {
    scores.entertainment += 3;
  }

  if (text.includes("visit") || text.includes("international") || text.includes("bilateral") || text.includes("foreign") || text.includes("global") || text.includes("un ") || text.includes("united nations")) {
    scores.international += 3;
  }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return top[1] > 0 ? top[0] : defaultCat;
}

function cleanBody(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\uFFFD/g, "") // Strip UTF-8 replacement characters
    .replace(/<img[^>]*width=["']?1["']?[^>]*>/gi, "") // Remove 1px tracking pixels
    .replace(/\[…\]|\[\.{3}\]|Read more.*/gi, "")     // Remove read more text
    .replace(/<a[^>]*href=["'][^"']*utm_[^"']*["'][^>]*>.*?<\/a>/gi, "") // Remove UTM link tracking
    .trim();
}

function toPlainText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")      // Strip all tags
    .replace(/\s+/g, " ")          // Normalize whitespace
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
    .substring(0, 300);
}

function extractCustomTags(title: string, body: string): string[] {
  const tags: string[] = [];
  const text = `${title} ${body}`.toLowerCase();

  if (text.includes("upsc") || text.includes("union public service") || text.includes("संघ लोक सेवा आयोग")) tags.push("UPSC");
  if (text.includes("mpsc") || text.includes("महाराष्ट्र लोक सेवा आयोग")) tags.push("MPSC");
  if (text.includes("bpsc") || text.includes("bihar public service") || text.includes("बिहार लोक सेवा आयोग")) tags.push("BPSC");
  if (text.includes("hpsc") || text.includes("haryana public service") || text.includes("हरियाणा लोक सेवा आयोग")) tags.push("HPSC");
  if (text.includes("rpsc") || text.includes("rajasthan public service") || text.includes("राजस्थान लोक सेवा आयोग")) tags.push("Rajasthan Public Service Commission");
  if (text.includes("ukpsc") || text.includes("uttarakhand public service") || text.includes("उत्तराखंड लोक सेवा आयोग")) tags.push("UKPSC");
  if (text.includes("cgpsc") || text.includes("chhattisgarh public service") || text.includes("छत्तीसगढ़ लोक सेवा आयोग")) tags.push("Chhattisgarh PSC");

  if (text.includes("railway") || text.includes("irctc") || text.includes("रेलवे") || text.includes("भारतीय रेल")) tags.push("Railways");

  if (text.includes("banking") || text.includes(" rbi") || text.includes("reserve bank") || text.includes("भारतीय रिजर्व बैंक")) tags.push("RBI");
  if (text.includes("ibps") || text.includes("ibpsc")) tags.push("IBPSC");
  if (text.includes("bank") || text.includes("बैंक")) tags.push("Banking");

  if (text.includes("bssc") || text.includes("bihar staff selection") || text.includes("बिहार कर्मचारी चयन")) tags.push("Bihar Staff Selection");
  if (text.includes("ugc") || text.includes("university grants") || text.includes("विश्वविद्यालय अनुदान")) tags.push("UGC");
  if (text.includes("ssc") || text.includes("staff selection commission") || text.includes("कर्मचारी चयन आयोग")) tags.push("SSC");

  if (text.includes("isro") || text.includes("इसरो") || text.includes("space research")) tags.push("ISRO");
  if (text.includes("drdo") || text.includes("डीआरडीओ") || text.includes("defence research")) tags.push("DRDO");
  if (text.includes("barc") || text.includes("भाभा परमाणु") || text.includes("bhabha atomic")) tags.push("BARC");

  if (text.includes("bcci") || text.includes("cricket") || text.includes("क्रिकेट")) tags.push("BCCI");
  if (text.includes("hockey india") || text.includes("hockey federation") || text.includes("हॉकी")) tags.push("Hockey Federation of India");
  if (text.includes("olympic") || text.includes("ioa") || text.includes("ओलंपिक")) tags.push("Indian Olympic Committee");

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

  if (text.includes("celebrity") || text.includes("celebrities") || text.includes("superstar") || text.includes("famous") || text.includes("actor") || text.includes("actress") || text.includes("influencer")) {
    tags.push("Celebrity");
  }
  if (text.includes("bollywood") || text.includes("cinema") || text.includes("entertainment") || text.includes("film") || text.includes("movie") || text.includes("मनोरंजन") || text.includes("फिल्म") || text.includes("सिनेमा")) {
    tags.push("Cine World");
  }
  return tags;
}

function detectStates(title: string, body: string, feedState?: string): string | null {
  const states: string[] = [];
  if (feedState) states.push(feedState);

  const text = `${title} ${body}`.toLowerCase();
  const stateMappings = [
    { state: "Maharashtra", keywords: ["maharashtra", "mumbai", "pune", "nagpur", "महाराष्ट्र", "मुंबई"] },
    { state: "Delhi", keywords: ["delhi", "new delhi", "दिल्ली", "नई दिल्ली"] },
    { state: "Karnataka", keywords: ["karnataka", "bengaluru", "bangalore", "कर्नाटक", "बेंगलुरु"] },
    { state: "Tamil Nadu", keywords: ["tamil nadu", "chennai", "तमिलनाडु", "चेन्नई"] },
    { state: "West Bengal", keywords: ["west bengal", "kolkata", "पश्चिम बंगाल", "कोलकाता"] },
    { state: "Uttar Pradesh", keywords: ["uttar pradesh", "lucknow", "kanpur", "ayodhya", "varanasi", "उत्तर प्रदेश", "लखनऊ"] },
    { state: "Gujarat", keywords: ["gujarat", "ahmedabad", "gandhinagar", "गुजरात", "अहमदाबाद"] },
    { state: "Rajasthan", keywords: ["rajasthan", "jaipur", "राजस्थान", "जयपुर"] },
    { state: "Kerala", keywords: ["kerala", "kochi", "thiruvananthapuram", "केरल", "कोच्चि"] },
    { state: "Telangana", keywords: ["telangana", "hyderabad", "तेलंगाना", "हैदराबाद"] },
    { state: "Bihar", keywords: ["bihar", "patna", "बिहार", "पटना"] },
    { state: "Punjab", keywords: ["punjab", "amritsar", "ludhiana", "पंजाब", "अमृतसर", "chandigarh", "चंडीगढ़"] },
    { state: "Madhya Pradesh", keywords: ["madhya pradesh", "bhopal", "indore", "मध्य प्रदेश", "भोपाल"] },
    { state: "Odisha", keywords: ["odisha", "bhubaneswar", "ओडिशा", "भुवनेश्वर"] },
    { state: "Assam", keywords: ["assam", "guwahati", "असम", "गुवाहाटी"] }
  ];

  for (const mapping of stateMappings) {
    if (mapping.keywords.some(kw => text.includes(kw))) {
      states.push(mapping.state);
    }
  }
  const unique = Array.from(new Set(states));
  return unique.length > 0 ? JSON.stringify(unique) : null;
}

async function scrapePibBody(prid: string): Promise<string> {
  const url = `https://pib.gov.in/PressReleaseIframePage.aspx?PRID=${prid}`;
  let html = "";
  let retries = 3;
  let delay = 500;

  while (retries > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) throw new Error(`Status ${res.status}`);
        return "";
      }
      const buffer = await res.arrayBuffer();
      html = new TextDecoder("utf-8").decode(buffer);
      break;
    } catch (e: any) {
      retries--;
      if (retries === 0) return "";
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 3;
    }
  }

  try {
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
    bodyHtml = bodyHtml
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<font[^>]*>/gi, "")
      .replace(/<\/font>/gi, "")
      .replace(/style=["'][^"']*(?:color|background)[^"']*["']/gi, "");

    return bodyHtml;
  } catch (e) {
    console.error("Failed to parse PIB body HTML:", e);
  }
  return "";
}

function getFeedAuthorId(feedName: string): string {
  return feedName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").substring(0, 30);
}

async function ensureScraperUsers() {
  const standardScrapers = [
    { id: "pib-scraper", email: "pib-scraper@newsvarta.com", name: "पत्र सूचना कार्यालय (PIB)" },
    { id: "hindustan-scraper", email: "hindustan-scraper@newsvarta.com", name: "लाइव हिन्दुस्तान" },
    { id: "automated-rss-scraper", email: "rss-scraper@newsvarta.com", name: "न्यूज़वार्ता समाचार सेवा" }
  ];

  for (const scraper of standardScrapers) {
    await db.user.upsert({
      where: { email: scraper.email },
      create: {
        id: scraper.id,
        email: scraper.email,
        name: scraper.name,
        passwordHash: "no-login-allowed",
        role: "EDITOR",
        status: "ACTIVE",
        jobTitle: "ऑटोमेटेड फीड",
      },
      update: {},
    });
  }

  for (const feed of FEEDS) {
    if (feed.source === "pib" || feed.source === "hindustan") continue;
    const authorId = getFeedAuthorId(feed.name);
    const email = `${authorId}@newsvarta.com`;
    
    await db.user.upsert({
      where: { email },
      create: {
        id: authorId,
        email,
        name: feed.name,
        passwordHash: "no-login-allowed",
        role: "EDITOR",
        status: "ACTIVE",
        jobTitle: "ऑटोमेटेड फीड",
      },
      update: {},
    });
  }
}

// Clean up existing commercial articles in database retroactively
async function cleanupExistingCommercialArticles() {
  console.log("Cleaning up existing commercial articles to display summaries only...");
  const summaryOnlyAuthorIds = new Set(
    FEEDS.filter(f => f.summaryOnly).map(f => {
      if (f.source === "pib") return "pib-scraper";
      if (f.source === "hindustan") return "hindustan-scraper";
      return getFeedAuthorId(f.name);
    })
  );
  summaryOnlyAuthorIds.add("hindustan-scraper");

  const articles = await db.article.findMany({
    where: {
      authorId: {
        in: Array.from(summaryOnlyAuthorIds)
      }
    }
  });

  console.log(`Found ${articles.length} articles from commercial sources to process.`);
  let updatedCount = 0;
  for (const art of articles) {
    const plain = toPlainText(art.body);
    if (!art.body.includes("<") && art.body.endsWith("…")) {
      continue;
    }
    const truncatedBody = plain.substring(0, 200).trimEnd() + (plain.length > 200 ? "…" : "");
    if (art.body !== truncatedBody) {
      await db.article.update({
        where: { id: art.id },
        data: { body: truncatedBody }
      });
      updatedCount++;
    }
  }
  console.log(`Retroactively truncated ${updatedCount} commercial articles.`);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  let addedCount = 0;
  let deletedCount = 0;

  try {
    await ensureScraperUsers();
    await cleanupExistingCommercialArticles();

    // 1. Cleanup old articles (older than 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleteResult = await db.article.deleteMany({
      where: {
        publishedAt: {
          lt: oneDayAgo,
        },
      },
    });
    deletedCount = deleteResult.count;

    // 2. Fetch new feed items
    for (const feed of FEEDS) {
      try {
        let res;
        let retries = 3;
        let delay = 500;
        let fetchSuccess = false;

        while (retries > 0) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
            res = await fetch(feed.url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/xml, text/xml, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
              },
              next: { revalidate: 0 }
            });
            clearTimeout(timeoutId);
            if (!res.ok) {
              if (res.status === 429 || res.status >= 500) throw new Error(`HTTP status ${res.status}`);
              break;
            }
            fetchSuccess = true;
            break;
          } catch (fetchErr: any) {
            retries--;
            if (retries === 0) break;
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 3;
          }
        }

        if (!fetchSuccess || !res) continue;

        const buffer = await res.arrayBuffer();
        const xml = new TextDecoder("utf-8").decode(buffer);
        const trimmedXml = xml.trim();
        if (trimmedXml.startsWith("<!DOCTYPE html") || trimmedXml.startsWith("<html") || trimmedXml.startsWith("<!doctype html")) {
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
          continue;
        }

        for (const item of parsed.items) {
          if (!item.title || !item.link) continue;

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
            body = cleanBody(await scrapePibBody(prid));
            categorySlug = getCategoryFromText(item.title, body, "national");
          } else if (feed.source === "hindustan") {
            const hash = Buffer.from(item.link).toString("base64url");
            slug = `hindustan-${hash}`;
            authorId = "hindustan-scraper";
            const rawBody = (item as any)["content:encoded"] || item.content || item.summary || item.description || "";
            body = cleanBody(rawBody);
            categorySlug = feed.defaultCategory || getCategoryFromText(item.title, body, "national");
            if (body && !body.includes("<p>")) {
              body = `<p>${body}</p>`;
            }
          } else {
            const hash = Buffer.from(item.link).toString("base64url");
            slug = `rss-${hash}`;
            authorId = getFeedAuthorId(feed.name);
            const rawBody = (item as any)["content:encoded"] || item.content || item.summary || item.description || "";
            body = cleanBody(rawBody);
            categorySlug = feed.defaultCategory || getCategoryFromText(item.title, body, "national");
            if (body && !body.includes("<p>")) {
              body = `<p>${body}</p>`;
            }
          }

          if (feed.summaryOnly && body) {
            const plain = toPlainText(body);
            body = plain.substring(0, 200).trimEnd() + (plain.length > 200 ? "…" : "");
          }

          if (!slug || !body) continue;

          // Extract image from RSS item metadata or body fields
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
                (item as any).description || "",
                body || ""
              ];
              for (const field of searchFields) {
                const imgMatch = field.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
                if (imgMatch) {
                  let src = imgMatch[1];
                  const ignoredKeywords = ["azadikaamritmahotsav", "piblogo", "emblem", "banner", "g20", "header", "footer", "logo", "75_"];
                  if (ignoredKeywords.some(kw => src.toLowerCase().includes(kw))) {
                    continue;
                  }
                  if (!src.startsWith("http") && !src.startsWith("//")) {
                    if (feed.source === "pib") {
                      if (src.startsWith("/")) src = src.substring(1);
                      src = `https://static.pib.gov.in/${src}`;
                    } else {
                      try {
                        const origin = new URL(feed.url).origin;
                        if (src.startsWith("/")) {
                          src = `${origin}${src}`;
                        } else {
                          src = `${origin}/${src.replace(/^\.\.\//, "")}`;
                        }
                      } catch (e) {}
                    }
                  } else if (src.startsWith("//")) {
                    src = `https:${src}`;
                  }
                  heroImage = src;
                  break;
                }
              }
            }
          }

          stateTags = detectStates(item.title, body, feed.state);

          const existing = await db.article.findUnique({ where: { slug } });
          if (existing) {
            if (existing.heroImage.startsWith("https://images.unsplash.com") && !heroImage.startsWith("https://images.unsplash.com")) {
              await db.article.update({
                where: { id: existing.id },
                data: { heroImage },
              });
            }
            continue;
          }

          const dateStr = item.pubDate || item.isoDate || new Date().toISOString();
          const publishedAtDate = new Date(dateStr);
          if (publishedAtDate < oneDayAgo) {
            continue;
          }

          const customTags = extractCustomTags(item.title, body);
          const baseTags = feed.source === "pib" ? ["PIB", "Official"] : feed.source === "hindustan" ? ["Hindustan", "Latest"] : ["News", feed.name];
          const allTags = Array.from(new Set([...baseTags, ...customTags]));

          await db.article.create({
            data: {
              slug,
              title: item.title,
              standfirst: toPlainText(item.summary || item.description || item.title),
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
              publishedAt: publishedAtDate,
              approvedAt: new Date(),
              submittedAt: new Date(),
            },
          });
          addedCount++;
        }
      } catch (err) {
        console.error(`Cron error scraping feed ${feed.name}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      added: addedCount,
      deleted: deletedCount,
    });
  } catch (error: any) {
    console.error("Cron global error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

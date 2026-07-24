import type {
  Article,
  Author,
  Category,
  Job,
  LiveUpdate,
  PodcastEpisode,
  PodcastSeries,
} from "./types";

export const CATEGORIES: Category[] = [
  { slug: "national", name: "National", description: "Stories shaping the nation.", colorVar: "var(--cat-national)" },
  { slug: "international", name: "International", description: "Global developments, contextualised.", colorVar: "var(--cat-international)" },
  { slug: "politics", name: "Politics", description: "Power, policy, and the people who hold both.", colorVar: "var(--cat-politics)" },
  { slug: "economy", name: "Economy", description: "Markets, money, and the movements in between.", colorVar: "var(--cat-economy)" },
  { slug: "sports", name: "Sports", description: "The game, on and off the field.", colorVar: "var(--cat-sports)" },
  { slug: "health", name: "Health", description: "Public health, medicine, and well-being.", colorVar: "var(--cat-health)" },
  { slug: "technology", name: "Technology", description: "The products, platforms, and ideas redefining how we live.", colorVar: "var(--cat-technology)" },
  { slug: "science", name: "Science", description: "Discoveries, climate, and the cosmos.", colorVar: "var(--cat-science)" },
  { slug: "entertainment", name: "Entertainment", description: "Film, music, books, and culture.", colorVar: "var(--cat-entertainment)" },
];

export const INDIAN_STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal",
  "Uttar Pradesh", "Gujarat", "Rajasthan", "Kerala", "Telangana",
  "Bihar", "Punjab", "Madhya Pradesh", "Odisha", "Assam",
];

export const AUTHORS: Author[] = [
  {
    id: "a1",
    name: "Anjali Mehta",
    role: "Senior Political Correspondent",
    bio: "Anjali has covered four general elections and three changes of government. She reports from Parliament House on policy, governance, and the politics that shape them.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face&q=80",
  },
  {
    id: "a2",
    name: "Rahul Verma",
    role: "Economics Editor",
    bio: "Rahul writes on monetary policy, fiscal strategy, and the macro forces that move Indian markets. Previously at the Reserve Bank research division.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&q=80",
  },
  {
    id: "a3",
    name: "Priya Nair",
    role: "Technology Correspondent",
    bio: "Priya covers the platforms, founders, and policy debates shaping India's digital economy. She has reported from Bengaluru for over a decade.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&q=80",
  },
  {
    id: "a4",
    name: "Vikram Singh",
    role: "Sports Editor",
    bio: "Vikram has reported from six Olympic Games, three World Cups, and every major cricket series of the last fifteen years.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&q=80",
  },
  {
    id: "a5",
    name: "Sara Khan",
    role: "Foreign Correspondent",
    bio: "Sara reports from across South and Southeast Asia, with a focus on geopolitics, conflict, and climate displacement.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&q=80",
  },
  {
    id: "a6",
    name: "Dr. Arvind Rao",
    role: "Health & Science Correspondent",
    bio: "Dr. Arvind holds a medical degree from AIIMS and writes on public health, infectious disease, and the science shaping medicine.",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face&q=80",
  },
];

export const ARTICLES_LIST: Article[] = [];
export const ARTICLES = ARTICLES_LIST;

export const BREAKING_NEWS: string[] = [];

export const TRENDING_TOPICS = [
  "डिजिटल सार्वजनिक अवसंरचना विधेयक",
  "आरबीआई मौद्रिक नीति",
  "भारतएलएम-1 एआई मॉडल",
  "केरल बाढ़",
  "आईपीएल मेगा नीलामी",
  "विश्व एथलेटिक्स चैंपियनशिप",
  "इसरो पुन: प्रयोज्य प्रक्षेपण यान",
  "डेंगू वैक्सीन परीक्षण",
];

export const LIVE_UPDATES: LiveUpdate[] = [];

export const PODCAST_SERIES: PodcastSeries[] = [
  {
    id: "newsvarta-main",
    name: "न्यूज़वार्ता वीडियो",
    description: "न्यूज़वार्ता के YouTube चैनल से नवीनतम वीडियो और समाचार।",
    coverImage: "https://ui-avatars.com/api/?name=NV&size=600&background=DC2626&color=fff",
    episodes: 0,
    category: "समाचार",
  },
];

export const PODCAST_EPISODES: PodcastEpisode[] = [];

export const JOBS: Job[] = [];

export const AD_FORMATS = [
  { name: "Display Banner", dimensions: "728×90, 300×250, 320×50", placement: "Homepage, Article, Category pages", description: "Standard IAB display units in multiple sizes. Reserved in advance." },
  { name: "Native / Sponsored Article", dimensions: "Article format", placement: "Latest News feed, Top Stories grid", description: "Article-card format, clearly labelled as sponsored. 1 per 6 articles maximum." },
  { name: "Video Pre-roll", dimensions: "Up to 30 seconds", placement: "Live section, embedded video in articles", description: "Skippable after 6 seconds. Brand-safe contextual placement." },
  { name: "Podcast Sponsor Mention", dimensions: "30-60 second read", placement: "Mid-roll and pre-roll across our podcast network", description: "Live-read by the host, with a follow-up mention in the show notes." },
  { name: "Newsletter Banner", dimensions: "600×100, 300×250", placement: "Daily and weekly newsletters", description: "Direct, high-engagement placement with our most loyal readers." },
  { name: "Homepage Takeover", dimensions: "Multiple placements", placement: "Full homepage for 24 hours", description: "Coordinated multi-unit campaign across all homepage placements. Limited to one per week." },
];

export const ADVERTISE_FAQ = [
  { q: "What is the minimum campaign length?", a: "We accept campaigns starting from one week for most placements. Homepage takeovers are booked in 24-hour slots and limited to one per week to preserve reader experience." },
  { q: "Do you offer targeting by geography or interest?", a: "Yes. We support geographic targeting at the state and city level, and contextual targeting by category. Audience-interest targeting based on reading behaviour is available for direct-sold campaigns." },
  { q: "What reporting do advertisers receive?", a: "All advertisers receive a campaign report within five business days of campaign end, including impressions, click-through rates, viewability, and (for video) completion rates. Direct-sold campaigns receive weekly interim reports." },
  { q: "What content restrictions apply to sponsored articles?", a: "Sponsored articles must adhere to our editorial standards for accuracy and may not promote products or services in categories we consider restricted, including tobacco, weapons, and certain financial products. All sponsored content is clearly labelled." },
  { q: "What is the typical turnaround time from inquiry to launch?", a: "For standard display campaigns, the typical turnaround is 5-7 business days from inquiry confirmation to launch. Custom and native placements may require 2-3 weeks for creative development and editorial review." },
  { q: "Do you work with agencies or only direct?", a: "Both. We work with media agencies on behalf of their clients, and we work with brands directly. Agency commissions are honoured as per industry norms." },
];

export const AUDIENCE_STATS = [
  { value: "12M+", label: "Monthly unique readers" },
  { value: "38M", label: "Monthly page views" },
  { value: "4.2M", label: "Newsletter subscribers" },
  { value: "8m 24s", label: "Average session duration" },
];

export const ADVERTISE_BENEFITS = [
  { title: "A premium audience", description: "Our readers are educated, high-income, and engaged. They come to us for serious journalism and stay to read it." },
  { title: "Editorial credibility", description: "Your brand appears in a brand-safe environment, alongside reporting that readers trust. We do not run autoplay audio or intrusive formats." },
  { title: "National and regional reach", description: "Reach readers across the country and in every state, with the option to target by geography down to the city level." },
  { title: "Multiple formats", description: "From display banners to native articles, podcast mentions, and newsletter sponsorships — choose the format that fits your objective." },
  { title: "Transparent reporting", description: "Clear, independent reporting on every campaign. Viewability, completion rates, and post-campaign analysis included as standard." },
  { title: "A dedicated team", description: "A named account manager from inquiry to campaign close. No call centres, no ticket queues." },
];

export const ADVERTISE_PROCESS = [
  { step: "1", title: "Submit an inquiry", description: "Fill out the form on this page with your campaign objectives and rough budget. We will get back to you within one business day." },
  { step: "2", title: "We get in touch", description: "Your account manager will set up a call to understand your goals, your audience, and the formats that fit best." },
  { step: "3", title: "Choose format and dates", description: "We will send a tailored proposal with recommended placements, creative requirements, and a firm quote." },
  { step: "4", title: "Go live", description: "Creative is reviewed, scheduled, and goes live on the agreed dates. You receive weekly reports and a post-campaign wrap." },
];

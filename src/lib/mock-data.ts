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
    bio: "Arvind holds a medical degree from AIIMS and writes on public health, infectious disease, and the science shaping medicine.",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face&q=80",
  },
];

const ARTICLE_BODY_EXAMPLE = `<p>The Parliament on Tuesday cleared the long-debated Digital Public Infrastructure Bill by a comfortable margin, ending nearly eighteen months of cross-committee deliberation and public consultation that drew submissions from over two hundred civil society organisations.</p>

<p>The legislation, which frames digital identity, payments, and data exchange as core public goods, will now move to the President for assent. The rollout is expected to begin in phases from the next financial year, with the Ministry of Electronics and Information Technology scheduled to publish implementation rules within ninety days.</p>

<h2>What the Bill changes</h2>

<p>At its core, the Bill grants statutory backing to three existing digital platforms — the national identity layer, the unified payments interface, and the data-empowerment architecture — and creates a new oversight authority to govern them. Until now, each has operated under executive notification and circulars, a framework critics have long argued left too much discretion in the hands of the executive.</p>

<blockquote>The Bill, in effect, converts an administrative architecture into a constitutional one — bringing it under judicial review and parliamentary oversight for the first time.</blockquote>

<p>The new oversight authority, to be chaired by a person of the rank of a sitting or retired High Court judge, will have the power to audit, suspend, and recommend amendments to any of the three platforms. Its decisions will be appealable before the Supreme Court.</p>

<div class="key-points"><div class="key-points-title">Key Points</div><ul><li>The Bill grants statutory backing to three digital platforms: identity, payments, and data exchange.</li><li>A new oversight authority, chaired by a judicial officer, will govern the platforms.</li><li>Implementation will begin in phases from the next financial year.</li><li>Rules of implementation are to be notified within ninety days of the Bill becoming law.</li></ul></div>

<h2>The debate that shaped it</h2>

<p>Through the day's discussion, members across the aisle returned repeatedly to a single question: whether the new authority would have the independence to act against the government of the day. The Minister of Electronics and Information Technology, in his reply, pointed to the authority's composition — a judicial chair, two sectoral experts, and the Cabinet Secretary as an ex-officio member — as evidence of structural balance.</p>

<p>Several opposition members, however, questioned the presence of the Cabinet Secretary on the body, describing it as a conflict of interest. The Minister defended the inclusion, arguing that the Cabinet Secretary's role would be limited to administrative coordination and would carry no voting power on substantive matters.</p>

<h2>What industry is watching for</h2>

<p>The technology industry, which had largely welcomed the Bill's intent, has been waiting for clarity on two operational questions: the liability of platform operators for downstream misuse, and the timelines within which the new authority would adjudicate disputes. The Bill addresses the first by codifying a safe-harbour regime for platforms that meet prescribed security standards; it is silent on the second, leaving it to the rules.</p>

<p>Industry associations, in initial reactions, described the passage as a "defining moment" but cautioned that the real test would lie in the implementation. "The architecture is sound," said one senior policy executive, who requested anonymity because his organisation is yet to issue a formal statement. "Whether it works in practice will depend on whether the rules are written in the spirit of the Bill or against it."</p>

<h2>What happens next</h2>

<p>The Bill now goes to the President for assent, a formality expected within two weeks. Once it receives assent, the Ministry will begin the process of constituting the oversight authority, a step that itself could take three to six months given the consultation required for the judicial appointment.</p>

<p>In the interim, the three platforms will continue to operate under their existing frameworks. Officials familiar with the matter said that no immediate changes to user experience are expected — the Bill is, by design, an architectural reform rather than an operational one. Its impact, they said, would be felt in the years to come, as the new authority begins to set the rules of the road.</p>`;

const ARTICLES: Article[] = [
  {
    id: "pib-gov-1",
    slug: "cabinet-approves-pm-pranam-fertilizer-scheme",
    title: "Union Cabinet Approves PM-PRANAM Scheme to Promote Alternative Fertilizers",
    standfirst: "The Union Cabinet has approved the new PM-PRANAM scheme to incentivize states to promote alternative, organic fertilizers and reduce chemical usage.",
    category: "politics",
    tags: ["Cabinet Decisions", "Agriculture", "Policy", "PM-PRANAM"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-20T10:30:00Z",
    readingTime: 3,
    views: 12000,
    heroImage: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Union Cabinet meeting chaired by the Prime Minister in New Delhi.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The Cabinet Committee on Economic Affairs (CCEA), chaired by Prime Minister Narendra Modi, has approved the PM Programme for Restoration, Awareness, Generation, Nourishment and Amelioration of Mother Earth (PM-PRANAM). The scheme aims to incentivize States and Union Territories to promote alternative fertilizers and balanced use of chemical fertilizers.</p>
    <p>Under the scheme, 50% of the fertilizer subsidy savings will be passed on to the respective state governments as a grant to promote organic and bio-fertilizer infrastructure and awareness campaigns at the grassroots level.</p>`,
    isFeatured: true,
    isBreaking: true,
  },
  {
    id: "pib-gov-2",
    slug: "gst-revenue-collection-growth-report",
    title: "GST Revenue Collections Touch ₹1.82 Lakh Crore, Showing 11.5% Annual Growth",
    standfirst: "India's Goods and Services Tax revenue collection reached a milestone of ₹1.82 lakh crore, driven by strong domestic economic activity and compliance.",
    category: "economy",
    tags: ["GST", "Revenue Collection", "Finance Ministry", "Economic Growth"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-19T09:00:00Z",
    readingTime: 4,
    views: 15400,
    heroImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Ministry of Finance, New Delhi.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>Gross Goods and Services Tax (GST) revenue collection grew 11.5% year-on-year to hit ₹1.82 lakh crore. The robust growth reflects resilient domestic economic activity and improved tax compliance mechanisms implemented by the GST Council.</p>
    <p>Out of the total gross collection, CGST accounted for ₹34,200 crore, SGST accounted for ₹42,100 crore, and IGST stood at ₹91,300 crore (including collections on import of goods).</p>`,
    isFeatured: false,
    isBreaking: false,
  },
  {
    id: "pib-gov-3",
    slug: "fit-india-movement-anniversary-celebrated",
    title: "Fit India Movement Celebrates Anniversary with National Fitness Interactive Campaigns",
    standfirst: "The Fit India Movement marked its anniversary with nation-wide fitness challenges and virtual interactive sessions with leading sports personalities.",
    category: "sports",
    tags: ["Fit India", "Sports Ministry", "Fitness Campaign", "Youth Affairs"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-18T14:00:00Z",
    readingTime: 3,
    views: 9800,
    heroImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Participants performing physical activities during a Fit India event.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The Fit India Movement celebrated its anniversary with school challenges and interactive virtual sessions led by the Ministry of Youth Affairs and Sports. Sports icons joined citizens to share fitness tips and routines.</p>
    <p>Over three lakh schools across the country participated in the week-long celebrations, organizing yoga sessions, athletic meets, and nutrition awareness camps.</p>`,
    isFeatured: false,
    isBreaking: false,
  },
  {
    id: "pib-gov-4",
    slug: "president-presents-national-panchayat-awards",
    title: "President of India Presents National Panchayat Awards to Best Performing Local Bodies",
    standfirst: "President Droupadi Murmu presented the National Panchayat Awards in New Delhi, urging local bodies to drive sustainable rural development.",
    category: "national",
    tags: ["President of India", "Panchayati Raj", "National Awards", "Rural Development"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-17T11:30:00Z",
    readingTime: 4,
    views: 11200,
    heroImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Rashtrapati Bhavan, New Delhi.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The President of India, Smt. Droupadi Murmu, presented the National Panchayat Awards in New Delhi. She commended the winning local bodies for their initiatives in sanitation, education, and drinking water availability in rural regions.</p>
    <p>The President highlighted that Panchayats are the pillars of grassroot democracy and play a vital role in building self-reliant, sustainable rural communities.</p>`,
    isFeatured: false,
    isBreaking: true,
  },
  {
    id: "pib-gov-5",
    slug: "india-un-sustainable-development-framework-signed",
    title: "India and United Nations Sign Sustainable Development Cooperation Framework 2023-2027",
    standfirst: "NITI Aayog and the United Nations in India signed the Government of India-UN Sustainable Development Cooperation Framework focusing on rapid economic growth.",
    category: "international",
    tags: ["NITI Aayog", "United Nations", "International Cooperation", "Sustainable Development"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-16T12:00:00Z",
    readingTime: 5,
    views: 8700,
    heroImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Signing ceremony at NITI Aayog, New Delhi.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>NITI Aayog and the United Nations in India signed the Government of India - United Nations Sustainable Development Cooperation Framework (GoI-UNSDCF) 2023-2027. The framework aligns UN agencies to support India's national development priorities and the Sustainable Development Goals (SDGs).</p>
    <p>The cooperation focuses on key pillars: Gender Equality, Youth Empowerment, Sustainable Environment, Quality Education, and Health Systems strengthening.</p>`,
    isFeatured: false,
    isBreaking: false,
  },
  {
    id: "pib-gov-6",
    slug: "meity-launches-bhashini-translation-platform",
    title: "Ministry of Electronics & IT Launches Digital India Bhashini Translation Platform",
    standfirst: "The Ministry of Electronics and IT has launched Bhashini, an AI-powered language translation platform to enable voice-based internet access in regional languages.",
    category: "technology",
    tags: ["MeitY", "Digital India", "Bhashini AI", "Language Technology"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-15T15:00:00Z",
    readingTime: 4,
    views: 14200,
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Digital India showcase highlighting translation technologies.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The Ministry of Electronics and IT (MeitY) has officially launched 'Bhashini', India's AI-led language translation platform. It aims to break language barriers by providing real-time text-to-speech and translation services in 22 official Indian languages.</p>
    <p>Bhashini will enable citizens to access public services, education, and banking portals in their mother tongues, boosting digital inclusion in tier-2 and tier-3 regions.</p>`,
    isFeatured: false,
    isBreaking: false,
  },
  {
    id: "pib-gov-7",
    slug: "isro-successfully-launches-chandrayaan-mission",
    title: "ISRO Successfully Launches Lunar Exploration Mission from Sriharikota Spaceport",
    standfirst: "The Indian Space Research Organisation (ISRO) successfully launched the Chandrayaan mission, aiming to land a rover on the lunar South Pole.",
    category: "science",
    tags: ["ISRO", "Space Research", "Chandrayaan", "Science & Tech"],
    states: ["Andhra Pradesh"],
    authorId: "pib",
    publishedAt: "2026-07-14T10:45:00Z",
    readingTime: 4,
    views: 29800,
    heroImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The GSLV rocket carrying the lunar spacecraft lifting off from Sriharikota.",
    heroCredit: "Photo: ISRO / PIB",
    body: `<p>The Indian Space Research Organisation (ISRO) successfully launched its lunar mission from the Satish Dhawan Space Centre in Sriharikota. The spacecraft entered the planned orbit, beginning its journey towards the Moon's unexplored South Pole region.</p>
    <p>The mission aims to demonstrate safe soft-landing capability and conduct in-situ scientific experiments on the lunar surface using its rover payload.</p>`,
    isFeatured: false,
    isBreaking: false,
  },
  {
    id: "pib-gov-8",
    slug: "ayushman-bharat-hospital-admissions-milestone",
    title: "Ayushman Bharat PM-JAY Completes Milestone of 5 Crore Free Hospital Admissions",
    standfirst: "The National Health Authority announced that the Ayushman Bharat PM-JAY scheme has crossed 5 crore hospital admissions, providing cashless healthcare to citizens.",
    category: "health",
    tags: ["Health Ministry", "Ayushman Bharat", "Healthcare", "PM-JAY"],
    states: ["Delhi"],
    authorId: "pib",
    publishedAt: "2026-07-13T08:30:00Z",
    readingTime: 3,
    views: 18900,
    heroImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Ayushman Bharat wellness clinic providing patient care services.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The National Health Authority (NHA) announced that the Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) has successfully crossed the milestone of 5 crore hospital admissions, providing over ₹61,500 crore worth of free cashless treatments.</p>
    <p>The scheme targets over 12 crore poor and vulnerable families, offering health insurance coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.</p>`,
    isFeatured: false,
    isBreaking: false,
  },
];

export const ARTICLES_LIST = ARTICLES;

export const BREAKING_NEWS = [
  "संसद ने ऐतिहासिक मतदान में डिजिटल सार्वजनिक अवसंरचना विधेयक को मंजूरी दी",
  "केरल बाढ़: नदियां खतरे के निशान को पार कर गईं, 12,000 लोगों को राहत शिविरों में भेजा गया",
  "आरबीआई ने रेपो दर 6.25% पर बरकरार रखी, मुद्रास्फीति पर सतर्कता के संकेत दिए",
  "भारत ने ऑस्ट्रेलिया के खिलाफ टेस्ट सीरीज का निर्णायक मैच 17 रन से जीता",
  "आसियान शिखर सम्मेलन समुद्री सुरक्षा समझौते और व्यापार प्रतिज्ञा के साथ समाप्त हुआ",
];

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

export const LIVE_UPDATES: LiveUpdate[] = [
  { id: "u1", timestamp: "पूर्वाह्न 11:42", text: "डिजिटल सार्वजनिक अवसंरचना विधेयक पारित होने के बाद संसद अनिश्चित काल के लिए स्थगित। सत्र में 19 दिनों में 14 बैठकें हुईं।" },
  { id: "u2", timestamp: "पूर्वाह्न 11:15", text: "प्रधानमंत्री ने विधेयक पारित होने के बाद राष्ट्र को संबोधित किया, इसे \"डिजिटल भारत के लिए एक महत्वपूर्ण क्षण\" कहा।" },
  { id: "u3", timestamp: "पूर्वाह्न 10:30", text: "विधेयक पक्ष में 312 और विरोध में 184 मतों के साथ पारित हुआ। विपक्ष द्वारा लाए गए तीन संशोधन मतविभाजन में खारिज हो गए।" },
  { id: "u4", timestamp: "पूर्वाह्न 09:48", text: "इलेक्ट्रॉनिक्स और आईटी मंत्री ने बहस का जवाब देना शुरू किया। निगरानी प्राधिकरण में कैबिनेट सचिव को शामिल करने का बचाव किया।" },
  { id: "u5", timestamp: "पूर्वाह्न 09:05", text: "डिजिटल सार्वजनिक अवसंरचना विधेयक पर चर्चा छठे घंटे में प्रवेश कर गई। विपक्ष के छह सदस्यों सहित अब तक बारह सदस्यों ने बात की है।" },
  { id: "u6", timestamp: "पूर्वाह्न 08:20", text: "संसद मानसून सत्र के अंतिम दिन के लिए एकत्रित हुई। डिजिटल सार्वजनिक अवसंरचना विधेयक आज पारित होने के लिए सूचीबद्ध।" },
];

export const PODCAST_SERIES: PodcastSeries[] = [
  {
    id: "s1",
    name: "The Daily Dispatch",
    description: "A twenty-minute morning briefing on the day's top stories, every weekday at 7 AM. Hosted by the editorial team.",
    coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80",
    episodes: 248,
    category: "News",
  },
  {
    id: "s2",
    name: "Policy & Power",
    description: "A weekly deep-dive into the policy decisions shaping the country. Interviews with ministers, bureaucrats, and the analysts who track them.",
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop&q=80",
    episodes: 96,
    category: "Analysis",
  },
  {
    id: "s3",
    name: "Long Form",
    description: "Hour-long conversations with the people behind the stories — writers, scientists, athletes, and the occasional politician.",
    coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=600&fit=crop&q=80",
    episodes: 142,
    category: "Interviews",
  },
  {
    id: "s4",
    name: "The Climate Beat",
    description: "A special series on the climate crisis — the science, the policy, the people. New episodes every Thursday.",
    coverImage: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=600&fit=crop&q=80",
    episodes: 38,
    category: "Special Series",
  },
  {
    id: "s5",
    name: "Markets Minutes",
    description: "A daily seven-minute wrap of the markets — what moved, why, and what to watch tomorrow.",
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=600&fit=crop&q=80",
    episodes: 412,
    category: "News",
  },
  {
    id: "s6",
    name: "Field Notes",
    description: "Reporting from the ground — our correspondents share the stories behind the headlines, from across the country and the world.",
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=600&fit=crop&q=80",
    episodes: 74,
    category: "Special Series",
  },
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "e1",
    slug: "daily-dispatch-what-the-digital-infrastructure-bill-changes",
    seriesId: "s1",
    title: "What the Digital Infrastructure Bill Actually Changes",
    description:
      "A constitutional scholar walks us through the architecture of the new Bill — what it changes, what it preserves, and what to watch in the implementation rules.",
    publishedAt: "2025-07-23T07:00:00Z",
    duration: "21:14",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=600&fit=crop&q=80",
    episodeNumber: 248,
    showNotes: [
      { time: "00:00", label: "Introduction and the architecture of the Bill" },
      { time: "04:12", label: "What the oversight authority can and cannot do" },
      { time: "10:30", label: "The Cabinet Secretary question — the debate explained" },
      { time: "16:45", label: "What to watch in the implementation rules" },
      { time: "19:20", label: "What this means for ordinary users" },
    ],
  },
  {
    id: "e2",
    slug: "policy-power-the-federal-bargain-on-gst",
    seriesId: "s2",
    title: "The Federal Bargain on GST, Explained",
    description:
      "We unpack the six-month extension of the GST compensation mechanism — the politics, the economics, and what it tells us about the state of the federal compact.",
    publishedAt: "2025-07-21T07:00:00Z",
    duration: "44:08",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop&q=80",
    episodeNumber: 96,
    showNotes: [
      { time: "00:00", label: "The original GST bargain" },
      { time: "08:20", label: "Why the compensation mechanism was controversial" },
      { time: "22:15", label: "The states' case for an extension" },
      { time: "34:00", label: "What the compromise tells us about federal politics" },
    ],
  },
  {
    id: "e3",
    slug: "long-form-the-scientist-behind-the-dengue-vaccine",
    seriesId: "s3",
    title: "The Scientist Behind the Dengue Vaccine",
    description:
      "An hour-long conversation with the principal investigator of the dengue vaccine trial — on the science, the setbacks, and what it took to get here.",
    publishedAt: "2025-07-19T07:00:00Z",
    duration: "58:32",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=600&fit=crop&q=80",
    episodeNumber: 142,
    showNotes: [
      { time: "00:00", label: "How the trial began" },
      { time: "12:40", label: "The challenge of a tetravalent vaccine" },
      { time: "28:15", label: "The setbacks along the way" },
      { time: "44:00", label: "What the results mean for public health" },
      { time: "52:10", label: "What's next" },
    ],
  },
  {
    id: "e4",
    slug: "climate-beat-the-monsoon-is-changing",
    seriesId: "s4",
    title: "The Monsoon Is Changing. Indian Agriculture Hasn't Caught Up.",
    description:
      "A climate scientist and an agricultural economist explain why this year's monsoon has been so erratic — and why the country's farming patterns haven't adapted.",
    publishedAt: "2025-07-18T07:00:00Z",
    duration: "37:22",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverImage: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&h=600&fit=crop&q=80",
    episodeNumber: 38,
    showNotes: [
      { time: "00:00", label: "The science of a changing monsoon" },
      { time: "11:30", label: "What the data shows over thirty years" },
      { time: "23:45", label: "Why farming patterns haven't adapted" },
      { time: "32:00", label: "What policymakers can do" },
    ],
  },
  {
    id: "e5",
    slug: "markets-minutes-the-rbi-pause-explained",
    seriesId: "s5",
    title: "The RBI Pause, Explained in Seven Minutes",
    description:
      "Why the central bank held rates, what changed in its inflation forecast, and what it means for borrowers, savers, and the markets tomorrow morning.",
    publishedAt: "2025-07-23T16:30:00Z",
    duration: "07:48",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=600&fit=crop&q=80",
    episodeNumber: 412,
    showNotes: [
      { time: "00:00", label: "The decision and the vote" },
      { time: "02:15", label: "What changed in the inflation forecast" },
      { time: "05:00", label: "What it means for borrowers and savers" },
    ],
  },
  {
    id: "e6",
    slug: "field-notes-from-the-kerala-floods",
    seriesId: "s6",
    title: "Field Notes: Reporting from the Kerala Floods",
    description:
      "Our correspondent on the ground describes what she has seen over 48 hours of rescue operations — and the long recovery that lies ahead.",
    publishedAt: "2025-07-23T12:00:00Z",
    duration: "28:55",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=600&fit=crop&q=80",
    episodeNumber: 74,
    showNotes: [
      { time: "00:00", label: "Arriving in the affected district" },
      { time: "08:00", label: "The relief camps" },
      { time: "18:30", label: "The long recovery ahead" },
    ],
  },
];

export const JOBS: Job[] = [
  {
    id: "j1",
    slug: "senior-political-correspondent-delhi",
    title: "Senior Political Correspondent",
    department: "Editorial",
    location: "New Delhi",
    type: "Full-time",
    description:
      "We are seeking an experienced political correspondent to lead our coverage of national politics from the Parliament press gallery. You will be the publication's lead voice on policy, governance, and the politics that shape them.",
    responsibilities: [
      "Lead daily coverage of Parliament, the government, and the opposition.",
      "Break original stories and develop sources across the political spectrum.",
      "Write analytical pieces that contextualise the day's political developments.",
      "Contribute to the publication's podcasts and video programming.",
      "Mentor junior reporters on the political desk.",
    ],
    requirements: [
      "Eight or more years of experience in political journalism, with a strong portfolio of original reporting.",
      "Deep familiarity with the workings of Parliament and the central government.",
      "An established network of sources across political parties and the bureaucracy.",
      "Exceptional writing and analytical skills.",
      "Willingness to work irregular hours during parliamentary sessions.",
    ],
    niceToHaves: [
      "Experience reporting from a state bureau.",
      "A degree in political science, law, or public policy.",
      "On-camera experience for video programming.",
    ],
    benefits: [
      "Competitive salary commensurate with experience.",
      "Comprehensive health insurance for you and your dependents.",
      "30 days of paid leave, plus public holidays.",
      "Annual training and development budget.",
      "Editorial independence and the support of a senior editorial team.",
    ],
  },
  {
    id: "j2",
    slug: "data-investigations-reporter",
    title: "Data & Investigations Reporter",
    department: "Editorial",
    location: "Bengaluru (Hybrid)",
    type: "Full-time",
    description:
      "We are expanding our investigations team and looking for a reporter who can find stories in data — and tell them with the rigour they deserve. You will work closely with the investigations editor and the data visualisation team.",
    responsibilities: [
      "Identify, pitch, and execute data-driven investigations across beats.",
      "File Right to Information requests and analyse the responses.",
      "Build and maintain datasets to support ongoing reporting.",
      "Collaborate with reporters across the newsroom on joint investigations.",
      "Ensure all data work is replicable and methodologically sound.",
    ],
    requirements: [
      "Four or more years of investigative or data reporting experience.",
      "Fluency in SQL and at least one data analysis tool (Python, R, or similar).",
      "Experience with RTI filings and public records research.",
      "Strong writing and storytelling skills.",
      "A demonstrated commitment to accuracy and methodological rigour.",
    ],
    niceToHaves: [
      "Experience with data visualisation tools (Datawrapper, Flourish, D3).",
      "A background in social science research methods.",
    ],
    benefits: [
      "Competitive salary and performance bonuses.",
      "Modern, light-filled office in Bengaluru's tech corridor.",
      "Flexible hybrid working (3 days in office).",
      "Annual training budget for tools and conferences.",
      "Mentorship and career progression support.",
    ],
  },
  {
    id: "j3",
    slug: "frontend-engineer-news-platform",
    title: "Senior Frontend Engineer — News Platform",
    department: "Tech",
    location: "Remote (India)",
    type: "Full-time",
    description:
      "We are rebuilding the publishing platform that powers our journalism. As a senior frontend engineer, you will work on the reader-facing experience and the tools that our editors use every day.",
    responsibilities: [
      "Build and maintain the reader-facing website with a focus on performance, accessibility, and readability.",
      "Develop the editor tools and workflows that the newsroom relies on.",
      "Collaborate with designers and editorial stakeholders on new features.",
      "Mentor junior engineers and contribute to code review culture.",
      "Own end-to-end delivery of features, from architecture to deployment.",
    ],
    requirements: [
      "Six or more years of professional frontend experience.",
      "Deep expertise in React, TypeScript, and modern CSS.",
      "Strong understanding of web performance, accessibility, and SEO.",
      "Experience with content management or publishing systems.",
      "Excellent communication skills.",
    ],
    niceToHaves: [
      "Experience with Next.js and the App Router.",
      "A portfolio of editorial or content-driven projects.",
      "Familiarity with the constraints of newsroom workflows.",
    ],
    benefits: [
      "Competitive salary and equity.",
      "Fully remote within India, with quarterly offsites.",
      "Comprehensive health insurance.",
      "Annual learning and development budget.",
      "A culture that protects focus time.",
    ],
  },
  {
    id: "j4",
    slug: "advertising-sales-manager-mumbai",
    title: "Advertising Sales Manager — West",
    department: "Sales",
    location: "Mumbai",
    type: "Full-time",
    description:
      "We are looking for an experienced advertising sales manager to lead our relationships with agencies and direct clients in the western region. You will be responsible for both revenue and the long-term health of the relationships that drive it.",
    responsibilities: [
      "Own revenue targets for the western region across display, native, and podcast inventory.",
      "Develop and maintain relationships with media agencies and direct clients.",
      "Work with the editorial and product teams on custom solutions for key clients.",
      "Forecast pipeline and report on performance weekly.",
      "Identify and pursue new business opportunities across categories.",
    ],
    requirements: [
      "Six or more years of advertising sales experience, with at least two in digital.",
      "An established network of agency and client relationships in the western region.",
      "A track record of consistently meeting or exceeding revenue targets.",
      "Strong presentation and negotiation skills.",
      "Willingness to travel within the region.",
    ],
    benefits: [
      "Competitive base salary with performance-linked variable pay.",
      "Health insurance and other standard benefits.",
      "Travel allowance and expense account.",
      "Annual sales incentive trips.",
    ],
  },
  {
    id: "j5",
    slug: "editorial-internship-2025",
    title: "Editorial Internship Programme 2025",
    department: "Editorial",
    location: "Multiple Cities",
    type: "Internship",
    description:
      "Our editorial internship programme is a six-month, paid opportunity for early-career journalists to work alongside our editorial teams across beats. Interns who perform well are considered for full-time roles at the end of the programme.",
    responsibilities: [
      "Support reporters across beats with research, fact-checking, and reporting.",
      "Pitch and write stories for the publication's website and newsletters.",
      "Assist with podcast production and social media distribution.",
      "Participate in editorial meetings and contribute to story development.",
    ],
    requirements: [
      "A degree in journalism, mass communication, or a related field (graduating students welcome).",
      "A demonstrated interest in news and current affairs.",
      "Strong writing and research skills.",
      "A portfolio of published work (college publications acceptable).",
      "Availability for the full six-month programme.",
    ],
    benefits: [
      "Monthly stipend.",
      "Mentorship from senior journalists.",
      "Bylined publication opportunities.",
      "Possibility of a full-time role at the end of the programme.",
    ],
  },
];

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

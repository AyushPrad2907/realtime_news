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
    id: "1",
    slug: "parliament-clears-digital-public-infrastructure-bill",
    title: "Parliament Clears Digital Public Infrastructure Bill in Landmark Vote",
    standfirst:
      "The legislation grants statutory backing to the country's identity, payments, and data-sharing architecture, creating a new oversight authority and ending eighteen months of cross-committee deliberation.",
    category: "politics",
    tags: ["Parliament", "Digital India", "Policy", "Governance"],
    states: ["Delhi"],
    authorId: "a1",
    publishedAt: "2025-07-23T08:30:00Z",
    updatedAt: "2025-07-23T11:15:00Z",
    readingTime: 7,
    views: 48230,
    heroImage:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600&h=900&fit=crop&q=80",
    heroCaption:
      "The Lok Sabha during the final reading of the Digital Public Infrastructure Bill on Tuesday.",
    heroCredit: "Photo: Press Information Bureau",
    body: ARTICLE_BODY_EXAMPLE,
    isFeatured: true,
    isBreaking: true,
    hasAudio: true,
    audioDuration: "11:42",
    keyPoints: [
      "Statutory backing granted to identity, payments, and data exchange platforms.",
      "A new oversight authority, chaired by a judicial officer, will govern the platforms.",
      "Implementation begins in phases from the next financial year.",
      "Rules of implementation to be notified within ninety days.",
    ],
  },
  {
    id: "2",
    slug: "rbi-holds-rates-cites-inflation-risk",
    title: "RBI Holds Repo Rate Steady, Signals Caution on Inflation",
    standfirst:
      "The monetary policy committee voted unanimously to keep the policy rate unchanged at 6.25%, citing food inflation and global uncertainty as key risks to the outlook.",
    category: "economy",
    tags: ["RBI", "Monetary Policy", "Inflation", "Markets"],
    states: ["Maharashtra"],
    authorId: "a2",
    publishedAt: "2025-07-23T06:00:00Z",
    readingTime: 5,
    views: 32110,
    heroImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The Reserve Bank of India headquarters in Mumbai.",
    heroCredit: "Photo: Bloomberg",
    body: `<p>The Reserve Bank of India's monetary policy committee voted unanimously on Wednesday to hold the repo rate at 6.25%, marking the third consecutive pause in this cycle and reinforcing the central bank's cautious posture on inflation.</p>

<p>Governor Sanjay Malhotra, in his post-decision remarks, pointed to two factors that weighed on the committee's thinking: the persistent stickiness in food inflation, particularly in vegetables and pulses, and the uncertain global environment shaped by ongoing trade realignments.</p>

<h2>The inflation calculus</h2>

<p>Headline consumer price inflation eased to 4.8% in June, the lowest reading in seven months, but the central bank's own projections suggest the path ahead is unlikely to be linear. The committee revised its forecast for the July-September quarter upward by 20 basis points, citing pressure from cereal prices and an unfavourable base effect.</p>

<blockquote>We are not yet at the point where we can confidently say that the disinflation trajectory is firmly on track to the four per cent target.</blockquote>

<p>The central bank's stance on accommodation was retained, with the governor describing it as a "deliberate choice" that preserves the option to act if conditions warrant.</p>

<h2>Markets react</h2>

<p>The benchmark 10-year government bond yield rose two basis points to 6.94% after the decision, while the Nifty 50 closed 0.3% lower, led by declines in rate-sensitive sectors. The rupee weakened marginally against the dollar, ending the session at 83.42.</p>`,
    isBreaking: false,
    hasAudio: false,
  },
  {
    id: "3",
    slug: "india-launches-indigenous-ai-foundation-model",
    title: "India Launches First Indigenous AI Foundation Model Trained on 22 Languages",
    standfirst:
      "The model, developed by a consortium of public research institutions and private labs, is positioned as a sovereign alternative to foreign systems for government and enterprise use.",
    category: "technology",
    tags: ["AI", "Research", "Government", "Languages"],
    states: ["Karnataka", "Telangana"],
    authorId: "a3",
    publishedAt: "2025-07-22T14:20:00Z",
    readingTime: 6,
    views: 51890,
    heroImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A research lab at the Indian Institute of Science, Bengaluru.",
    heroCredit: "Photo: IISc",
    body: `<p>A consortium of public research institutions and private laboratories on Tuesday unveiled what it described as India's first fully indigenous foundation model — a 70-billion parameter system trained on twenty-two scheduled languages and positioned as a sovereign alternative to foreign systems for government and enterprise use.</p>

<p>The model, named BharatLM-1, was developed over eighteen months by a team drawn from the Indian Institute of Science, the Indian Institutes of Technology at Madras and Bombay, and a private partner. The Ministry of Electronics and Information Technology provided the compute infrastructure through the national AI mission.</p>

<h2>Why a sovereign model matters</h2>

<p>Officials involved in the project said the case for an indigenous model rested on three considerations: data sovereignty, the inclusion of Indian languages that foreign models handle poorly, and the strategic imperative of not depending on external providers for critical government applications.</p>

<div class="key-points"><div class="key-points-title">Key Points</div><ul><li>BharatLM-1 is a 70-billion parameter foundation model trained on 22 scheduled languages.</li><li>Developed over 18 months by a consortium of public institutions and a private partner.</li><li>The model will be available to government departments and enterprises via API.</li><li>An open-weights version for academic research is planned for release later this year.</li></ul></div>

<h2>Performance and benchmarks</h2>

<p>On standardised benchmarks for Indian languages, the consortium reported that BharatLM-1 outperformed several open-weight foreign models of comparable size, particularly on tasks involving code-mixing and regional dialects. On English-language reasoning tasks, it trailed the leading proprietary systems but was competitive with open-weight peers.</p>

<p>The consortium has released an evaluation paper alongside the model, and an open-weights version for academic research is planned for release later this year.</p>`,
    isFeatured: false,
    hasAudio: true,
    audioDuration: "9:18",
  },
  {
    id: "4",
    slug: "india-beat-australia-test-series-decider",
    title: "India Clinch Series Decider Against Australia in Final-Session Thriller",
    standfirst:
      "A late-order partnership and a five-wicket haul from the young spinner sealed a famous home series win, with the visitors falling seventeen runs short of a record chase.",
    category: "sports",
    tags: ["Cricket", "Test Cricket", "India vs Australia"],
    states: ["Tamil Nadu"],
    authorId: "a4",
    publishedAt: "2025-07-22T18:45:00Z",
    readingTime: 4,
    views: 87650,
    heroImage:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The crowd at the MA Chidambaram Stadium erupts as the final wicket falls.",
    heroCredit: "Photo: Sportzpics",
    body: `<p>India sealed a memorable home series win against Australia on Tuesday, prevailing by seventeen runs in a decider that swung three times in the final session before a five-wicket haul from the young off-spinner settled the contest in the hosts' favour.</p>

<p>Chasing 287 for a record-breaking series win, the visitors were well placed at 198 for four when the second new ball was taken. From there, the innings unravelled — six wickets falling for 71 runs in a passage of play that will be replayed for years to come.</p>

<h2>The decisive spell</h2>

<p>The turnaround was engineered by the 22-year-old off-spinner, who finished with figures of five for 48 from 24 overs, including a triple-wicket maiden that broke the back of the chase. His control of length and the sharp turn he extracted from a wearing pitch left the lower order with no answers.</p>

<blockquote>The plan was simple — bowl to the field and let the pitch do the rest. I just had to be patient.</blockquote>

<p>The victory gives India their fourth consecutive home series win against Australia and consolidates their position at the top of the World Test Championship table.</p>`,
  },
  {
    id: "5",
    slug: "asean-summit-maritime-security-accord",
    title: "ASEAN Summit Ends with Maritime Security Accord, Trade Pledge",
    standfirst:
      "Leaders of the ten-member grouping committed to a new framework on maritime conduct and pledged to accelerate negotiations on a long-delayed regional trade update.",
    category: "international",
    tags: ["ASEAN", "Diplomacy", "Trade", "Maritime"],
    authorId: "a5",
    publishedAt: "2025-07-22T09:10:00Z",
    readingTime: 6,
    views: 28450,
    heroImage:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Leaders pose for the traditional family photograph at the ASEAN Summit.",
    heroCredit: "Photo: ASEAN Secretariat",
    body: `<p>The ten-member Association of Southeast Asian Nations concluded its annual summit on Tuesday with a new framework agreement on maritime conduct in the South China Sea and a renewed commitment to conclude long-delayed negotiations on a regional trade update.</p>

<p>The maritime framework, three years in the making, establishes confidence-building measures including hotlines between coast guards and a code of conduct for fishing vessels. It stops short of a binding dispute-resolution mechanism — a concession that critics say dilutes its effectiveness but that proponents defend as the best achievable consensus.</p>

<h2>A measured outcome</h2>

<p>Officials involved in the negotiations described the framework as a "floor, not a ceiling" — a baseline of cooperation that reduces the risk of accidental escalation without resolving the underlying territorial disputes. The framework will be reviewed every two years.</p>

<p>On trade, leaders pledged to conclude negotiations on an update to the ASEAN Trade in Goods Agreement by the end of next year, three years behind the original schedule.</p>`,
  },
  {
    id: "6",
    slug: "monsoon-session-key-bills-list",
    title: "Monsoon Session: The Five Bills the Government Wants Passed",
    standfirst:
      "From the digital infrastructure law to amendments on labour and coastal regulation, the session's legislative agenda is the heaviest in two years.",
    category: "politics",
    tags: ["Parliament", "Legislation", "Session Preview"],
    states: ["Delhi"],
    authorId: "a1",
    publishedAt: "2025-07-21T07:00:00Z",
    readingTime: 5,
    views: 19840,
    heroImage:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The Central Hall of Parliament ahead of the monsoon session.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>When Parliament convenes for the monsoon session on Monday, the government will face one of its heaviest legislative agendas in two years — five bills across digital infrastructure, labour, coastal regulation, banking, and data protection.</p>

<p>The standout item is the Digital Public Infrastructure Bill, which grants statutory backing to the country's identity, payments, and data-sharing platforms. The Bill has been in cross-committee consultation for eighteen months and is widely expected to be passed in this session.</p>

<h2>The full agenda</h2>

<p>Beyond the digital infrastructure law, the government has listed four other bills for consideration and passing: amendments to the labour code, a coastal regulation update, a banking law amendment, and a revised data protection framework.</p>

<p>Opposition parties have indicated they will press for discussions on each, suggesting that the session will be a busy one even if the government's numerical majority ensures passage.</p>`,
  },
  {
    id: "7",
    slug: "bengaluru-metro-phase-three-approved",
    title: "Bengaluru Metro Phase Three Approved, Construction to Begin Next Year",
    standfirst:
      "The Union Cabinet has cleared the ₹16,000-crore expansion, adding 58 kilometres of new line and connecting the airport to the city's tech corridor.",
    category: "national",
    tags: ["Infrastructure", "Urban", "Bengaluru", "Transport"],
    states: ["Karnataka"],
    authorId: "a3",
    publishedAt: "2025-07-21T13:30:00Z",
    readingTime: 4,
    views: 22670,
    heroImage:
      "https://images.unsplash.com/photo-1581262177000-8139a463e531?w=1600&h=900&fit=crop&q=80",
    heroCaption: "An existing metro line in Bengaluru.",
    heroCredit: "Photo: BMRCL",
    body: `<p>The Union Cabinet on Monday approved the long-pending Phase Three expansion of the Bengaluru metro, clearing ₹16,000 crore in investment for 58 kilometres of new line that will connect the international airport to the city's technology corridor.</p>

<p>The expansion, expected to be completed in seven years, will add two new corridors and extend two existing lines. It will more than double the network's current length and, by the project's own projections, take 1.2 million daily commuters off the city's congested roads.</p>

<h2>A city held back by traffic</h2>

<p>Bengaluru's traffic has become a chronic constraint on the city's growth, with several independent studies estimating the annual economic cost of congestion at over ₹20,000 crore. The metro expansion is the most significant infrastructure intervention yet attempted to address it.</p>

<p>Construction is scheduled to begin in the second half of next year, with the first sections expected to be operational by 2030.</p>`,
  },
  {
    id: "8",
    slug: "dengue-vaccine-trial-results-published",
    title: "Phase Three Trial of Indigenous Dengue Vaccine Shows 85% Efficacy",
    standfirst:
      "Results published in a leading medical journal indicate the vaccine is effective against all four serotypes, with no serious adverse events recorded in the trial.",
    category: "health",
    tags: ["Health", "Vaccine", "Research", "Dengue"],
    authorId: "a6",
    publishedAt: "2025-07-20T16:00:00Z",
    readingTime: 5,
    views: 41280,
    heroImage:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A research laboratory working on vector-borne disease vaccines.",
    heroCredit: "Photo: ICMR",
    body: `<p>An indigenous tetravalent dengue vaccine developed by an Indian pharmaceutical company in collaboration with the Indian Council of Medical Research has demonstrated 85% efficacy against symptomatic dengue in a phase three trial, with protection observed across all four serotypes of the virus.</p>

<p>The results, published on Friday in The Lancet Infectious Diseases, are based on a trial involving 22,000 participants across ten sites in India. No serious vaccine-related adverse events were recorded during the 24-month follow-up period.</p>

<h2>A disease on the rise</h2>

<p>Dengue has expanded its geographic range in India over the last decade, with cases now reported from every state. An effective vaccine has long been a public health priority, but earlier candidates have shown variable efficacy by serotype and prior exposure.</p>

<div class="key-points"><div class="key-points-title">Key Points</div><ul><li>The vaccine showed 85% efficacy against symptomatic dengue in a 22,000-person trial.</li><li>Protection was observed across all four serotypes of the virus.</li><li>No serious vaccine-related adverse events were recorded.</li><li>The company plans to file for regulatory approval by the end of the year.</li></ul></div>

<p>The company plans to file for regulatory approval with the Central Drugs Standard Control Organisation by the end of the year. If approved, the vaccine would be the first indigenously developed dengue vaccine to reach the market.</p>`,
    hasAudio: true,
    audioDuration: "7:32",
  },
  {
    id: "9",
    slug: "isro-reusable-launch-vehicle-test-success",
    title: "ISRO's Reusable Launch Vehicle Completes Successful Landing Test",
    standfirst:
      "The space agency demonstrated the autonomous landing of its reusable launch vehicle prototype, a critical milestone on the path to lowering the cost of access to space.",
    category: "science",
    tags: ["ISRO", "Space", "Technology", "Research"],
    states: ["Karnataka"],
    authorId: "a6",
    publishedAt: "2025-07-20T11:00:00Z",
    readingTime: 4,
    views: 65430,
    heroImage:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The reusable launch vehicle prototype on the runway after landing.",
    heroCredit: "Photo: ISRO",
    body: `<p>The Indian Space Research Organisation on Sunday successfully demonstrated the autonomous landing of its reusable launch vehicle prototype, a critical milestone on the agency's path to developing a fully reusable rocket that could dramatically lower the cost of access to space.</p>

<p>The prototype, designated RLV-TD, was released from a helicopter at an altitude of 4.5 kilometres and landed autonomously on a runway at the Aeronautical Test Range in Chitradurga. The entire descent, including approach and touchdown, was conducted without human intervention.</p>

<h2>Why reusability matters</h2>

<p>Reusable launch vehicles are widely seen as the most significant lever for reducing the cost of space access. The first stage of a conventional rocket, which accounts for the majority of its cost, is typically discarded after a single use.</p>

<p>ISRO has been working on reusable technology for over a decade, but the landing demonstration had been delayed multiple times by technical issues and weather. With Sunday's success, the agency will now move to the next phase of the programme: an orbital flight test within the next three years.</p>`,
  },
  {
    id: "10",
    slug: "mumbai-film-festival-lineup-announced",
    title: "Mumbai Film Festival Announces Competition Lineup, Opens with a Debut Feature",
    standfirst:
      "The 25th edition of the festival will screen 180 films across 18 languages, with a focus on first-time filmmakers and a new strand dedicated to climate cinema.",
    category: "entertainment",
    tags: ["Film", "Festival", "Mumbai", "Culture"],
    states: ["Maharashtra"],
    authorId: "a5",
    publishedAt: "2025-07-19T17:30:00Z",
    readingTime: 3,
    views: 16980,
    heroImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A screening at last year's Mumbai Film Festival.",
    heroCredit: "Photo: MAMI",
    body: `<p>The Mumbai Academy of Moving Image on Friday announced the competition lineup for the 25th edition of the Mumbai Film Festival, with 180 films across 18 languages set to screen over eight days beginning October 25.</p>

<p>The festival will open with the world premiere of a debut feature by a young Marathi filmmaker, and will close with the South Asian premiere of an eagerly awaited international film. The international competition section features 14 films, half of them by first-time directors.</p>

<h2>A new climate strand</h2>

<p>This year's edition introduces a new strand dedicated to climate cinema, featuring eight documentaries and fiction films that address the environmental crisis. The strand is curated in partnership with a leading environmental research institute.</p>

<p>Festival organisers said the edition would also expand its industry platform, with a co-production market and a works-in-progress lab aimed at supporting films in post-production.</p>`,
  },
  {
    id: "11",
    slug: "kerala-floods-rescue-operations-continue",
    title: "Kerala Floods: Rescue Operations Continue as Rivers Cross Danger Marks",
    standfirst:
      "The state government has deployed the National Disaster Response Force across five districts, with over 12,000 people moved to relief camps in the last 48 hours.",
    category: "national",
    tags: ["Kerala", "Floods", "Disaster", "Weather"],
    states: ["Kerala"],
    authorId: "a5",
    publishedAt: "2025-07-23T05:30:00Z",
    readingTime: 3,
    views: 38920,
    heroImage:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&h=900&fit=crop&q=80",
    heroCaption: "Rescue personnel evacuating residents from a flooded neighbourhood.",
    heroCredit: "Photo: PTI",
    body: `<p>Rescue operations continued through Wednesday morning across five districts of Kerala as major rivers crossed danger marks following three days of intense rainfall, with the state government deploying the National Disaster Response Force and moving over 12,000 people to relief camps in the last 48 hours.</p>

<p>The India Meteorological Department has issued a red alert for three districts and an orange alert for four others, predicting heavy to very heavy rainfall through Friday. The state's chief minister chaired an emergency review meeting late on Tuesday night.</p>

<h2>The districts affected</h2>

<p>The worst-affected districts are in the northern and central parts of the state, where several rivers have crossed their danger marks. Landslides have been reported from three locations in the high-range Idukki district, blocking key roads.</p>

<p>The state government has announced an immediate relief package and appealed to the central government for additional NDRF deployments.</p>`,
    isBreaking: true,
  },
  {
    id: "12",
    slug: "indian-startups-funding-turnaround",
    title: "Indian Startups See Funding Turnaround as Megarounds Return",
    standfirst:
      "Venture funding in the first half of the year rose 22% year-on-year, with eight companies crossing the billion-dollar valuation mark — the highest in two years.",
    category: "economy",
    tags: ["Startups", "Funding", "Venture Capital"],
    states: ["Karnataka", "Maharashtra", "Delhi"],
    authorId: "a3",
    publishedAt: "2025-07-18T10:00:00Z",
    readingTime: 5,
    views: 24560,
    heroImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A startup office in Bengaluru's Koramangala neighbourhood.",
    heroCredit: "Photo: Mint",
    body: `<p>Indian startups raised $6.8 billion in venture funding in the first half of the year, a 22% increase over the same period last year, with eight companies crossing the billion-dollar valuation mark — the highest number in any six-month period in two years.</p>

<p>The data, compiled by a research firm and reviewed by this publication, suggests that the funding winter that defined 2023 and 2024 may be ending, though the recovery is uneven and concentrated in a small number of sectors.</p>

<h2>Where the money went</h2>

<p>More than half of the funding went to three sectors: artificial intelligence, financial technology, and electric vehicles. The largest single round was a $850 million raise by an AI infrastructure company, the country's largest ever in the sector.</p>

<p>Investors cautioned, however, that the recovery is not broad-based. Early-stage deal volume remains below the peaks of 2021, and several growth-stage companies continue to face valuation pressure.</p>`,
  },
  {
    id: "13",
    slug: "centre-state-gst-sharing-deal",
    title: "Centre, States Reach Consensus on GST Compensation Extension",
    standfirst:
      "The GST Council approved a six-month extension of the compensation mechanism, ending a standoff that had threatened to disrupt state budgets.",
    category: "economy",
    tags: ["GST", "Taxation", "Centre-State", "Governance"],
    states: ["Delhi"],
    authorId: "a2",
    publishedAt: "2025-07-17T19:00:00Z",
    readingTime: 4,
    views: 15340,
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The GST Council meeting in progress at Vigyan Bhawan.",
    heroCredit: "Photo: Press Information Bureau",
    body: `<p>The Goods and Services Tax Council on Thursday approved a six-month extension of the compensation mechanism for states, ending a weeks-long standoff that had threatened to disrupt state budgets and testing the federal architecture of the tax regime.</p>

<p>The decision, taken at a meeting of the Council in New Delhi, will extend the compensation window — originally scheduled to end this month — until the end of the financial year. The compensation will be funded through a cess on luxury and sin goods.</p>

<h2>The federal bargain</h2>

<p>The compensation mechanism was a central feature of the original GST bargain, designed to protect states from revenue shortfalls during the transition to the new tax. With revenue growth having normalised, the central government had argued that the mechanism had served its purpose.</p>

<p>Several states, however, had pushed back, pointing to ongoing revenue gaps in specific sectors. The six-month extension is being read as a compromise that allows both sides to claim a win.</p>`,
  },
  {
    id: "14",
    slug: "telecom-relief-package-approved",
    title: "Cabinet Approves Telecom Relief Package, Aims to Stabilise Sector",
    standfirst:
      "The package includes a moratorium on spectrum dues and a reduction in the bank guarantees required for auctions, providing breathing room for the struggling sector.",
    category: "economy",
    tags: ["Telecom", "Policy", "Sector Relief"],
    authorId: "a2",
    publishedAt: "2025-07-16T14:00:00Z",
    readingTime: 4,
    views: 9870,
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A telecom transmission tower against the evening sky.",
    heroCredit: "Photo: Bloomberg",
    body: `<p>The Union Cabinet on Wednesday approved a relief package for the telecom sector, including a moratorium on spectrum dues and a reduction in the bank guarantees required for participation in future auctions, in a move aimed at stabilising a sector that has been under financial stress for several years.</p>

<p>The package, recommended by the sector regulator last year, had been pending with the government for over nine months. Officials familiar with the deliberations said the decision was accelerated by the deteriorating financial position of one of the major operators.</p>

<h2>What the package includes</h2>

<p>The moratorium on spectrum dues will run for four years, with the option for operators to convert the deferred amount into equity at the end of the period. The bank guarantee requirement for auctions will be reduced by 50%, lowering the working capital pressure on operators.</p>

<p>The package is expected to provide immediate relief to the sector, though analysts cautioned that the structural challenges — including the high debt burden and the low tariffs — remain unresolved.</p>`,
  },
  {
    id: "15",
    slug: "world-athletics-india-medal-tally",
    title: "India Ends World Athletics with Three Medals, Best-Ever Tally",
    standfirst:
      "A historic gold in the javelin and silvers in the long jump and the 4x400 relay marked the country's best performance at the World Athletics Championships.",
    category: "sports",
    tags: ["Athletics", "World Championships", "Javelin", "Medal"],
    authorId: "a4",
    publishedAt: "2025-07-15T22:00:00Z",
    readingTime: 3,
    views: 54210,
    heroImage:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The Indian javelin thrower on the podium after winning gold.",
    heroCredit: "Photo: AP",
    body: `<p>India ended its campaign at the World Athletics Championships on Tuesday with three medals — a historic gold in the javelin, a silver in the long jump, and a silver in the 4x400 metre relay — marking the country's best-ever performance at the event.</p>

<p>The javelin gold, won with a throw of 89.45 metres, is the first world championship gold for an Indian in any athletics discipline. The silver in the long jump came with a personal best of 8.32 metres, while the relay team's silver was secured in a national record time of 2 minutes 58.12 seconds.</p>

<h2>A statement of intent</h2>

<p>The performance is being seen as a statement of intent from a country that has historically struggled in track and field. The sports ministry announced a cash award of ₹50 lakh for each gold medallist and ₹25 lakh for each silver medallist.</p>

<p>The athletes will return to a formal reception in the capital on Friday, before resuming training for the Asian Games later this year.</p>`,
  },
  {
    id: "16",
    slug: "supreme-court-data-protection-ruling",
    title: "Supreme Court Upholds Right to Be Forgotten in Landmark Ruling",
    standfirst:
      "A five-judge bench ruled that individuals can request the removal of search results that are inaccurate or no longer relevant, with safeguards for press freedom.",
    category: "national",
    tags: ["Supreme Court", "Privacy", "Data Protection", "Law"],
    states: ["Delhi"],
    authorId: "a1",
    publishedAt: "2025-07-15T10:30:00Z",
    readingTime: 6,
    views: 31420,
    heroImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The Supreme Court of India.",
    heroCredit: "Photo: PTI",
    body: `<p>The Supreme Court on Tuesday recognised the right to be forgotten as a facet of the right to privacy, ruling that individuals can request the removal of search results that are inaccurate, inadequate, or no longer relevant, while imposing safeguards to protect press freedom and the public interest.</p>

<p>The ruling, delivered by a five-judge constitution bench, frames the right as a qualified one — to be exercised through a structured mechanism that balances individual privacy against the public's right to information.</p>

<h2>A balanced verdict</h2>

<p>The court held that the right cannot be used to remove accurate reporting on matters of public interest, including historical events, public figures acting in their official capacity, and criminal proceedings where the conviction is recorded. It can, however, be invoked to remove information that is factually incorrect, outdated, or where its continued availability causes disproportionate harm.</p>

<blockquote>The right to be forgotten is not a right to rewrite history. It is a right to be free from the indefinite amplification of information that no longer reflects the truth.</blockquote>

<p>The court directed the government to establish a statutory mechanism, within 18 months, through which individuals can make such requests. Until then, the Data Protection Board will adjudicate requests on a case-by-case basis.</p>`,
  },
  {
    id: "17",
    slug: "bhopal-heritage-conservation-project",
    title: "Bhopal's Heritage Quarter Gets a Conservation Plan After Two Decades",
    standfirst:
      "The state government has approved a ₹240-crore conservation plan for the city's colonial-era quarter, with a focus on adaptive reuse and community participation.",
    category: "national",
    tags: ["Heritage", "Conservation", "Bhopal", "Urban"],
    states: ["Madhya Pradesh"],
    authorId: "a5",
    publishedAt: "2025-07-14T12:00:00Z",
    readingTime: 4,
    views: 7240,
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&h=900&fit=crop&q=80",
    heroCaption: "A heritage building in Bhopal's colonial-era quarter.",
    heroCredit: "Photo: MP Tourism",
    body: `<p>The Madhya Pradesh government has approved a ₹240-crore conservation plan for Bhopal's colonial-era heritage quarter, ending two decades of deliberation over the future of a neighbourhood that has steadily deteriorated despite its architectural significance.</p>

<p>The plan, prepared by a conservation architecture firm in consultation with local residents, focuses on adaptive reuse — converting several heritage structures into cultural spaces, libraries, and small museums — while preserving the residential character of the quarter.</p>

<h2>A community-led approach</h2>

<p>Unlike earlier proposals that envisaged large-scale redevelopment, the approved plan emphasises community participation. A residents' committee will have a formal role in the implementation, and a grant programme will support the restoration of privately owned heritage homes.</p>

<p>Work is expected to begin in October and be completed in five phases over seven years.</p>`,
  },
  {
    id: "18",
    slug: "ipl-auction-mega-deal-preview",
    title: "IPL Mega Auction: The Five Players Who Could Break the ₹20-Crore Mark",
    standfirst:
      "With the auction pool expanded and several franchises rebuilding, this year's mega auction is set to be the most lucrative in the league's history.",
    category: "sports",
    tags: ["IPL", "Cricket", "Auction"],
    authorId: "a4",
    publishedAt: "2025-07-13T15:00:00Z",
    readingTime: 5,
    views: 92340,
    heroImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&h=900&fit=crop&q=80",
    heroCaption: "The IPL trophy on display ahead of the auction.",
    heroCredit: "Photo: Sportzpics",
    body: `<p>The Indian Premier League's mega auction, scheduled for late next month, is set to be the most lucrative in the league's history, with several franchises in full rebuild mode and at least five players widely expected to cross the ₹20-crore mark.</p>

<p>This year's auction pool has been expanded to 280 players, up from 204 in the last mega auction. The salary cap for franchises has been raised by ₹15 crore, and several franchises have significant purse after releasing high-earning players in the retention window.</p>

<h2>The marquee names</h2>

<p>The five players expected to draw the biggest bids include two all-rounders, two top-order batters, and a fast bowler. Each brings a specific skillset that is in short supply in the auction pool, and several franchises are expected to enter aggressive bidding wars.</p>

<p>The auction will be conducted over two days in Bengaluru, with the marquee set going under the hammer on the morning of the first day.</p>`,
  },
];

export const ARTICLES_LIST = ARTICLES;

export const BREAKING_NEWS = [
  "Parliament clears Digital Public Infrastructure Bill in landmark vote",
  "Kerala floods: 12,000 moved to relief camps as rivers cross danger marks",
  "RBI holds repo rate at 6.25%, signals caution on inflation",
  "India clinch Test series decider against Australia by 17 runs",
  "ASEAN summit ends with maritime security accord and trade pledge",
];

export const TRENDING_TOPICS = [
  "Digital Public Infrastructure Bill",
  "RBI Monetary Policy",
  "BharatLM-1 AI Model",
  "Kerala Floods",
  "IPL Mega Auction",
  "World Athletics Championships",
  "ISRO Reusable Launch Vehicle",
  "Dengue Vaccine Trial",
];

export const LIVE_UPDATES: LiveUpdate[] = [
  { id: "u1", timestamp: "11:42 AM", text: "Parliament adjourns sine die after passage of the Digital Public Infrastructure Bill. The session saw 14 sittings over 19 days." },
  { id: "u2", timestamp: "11:15 AM", text: "Prime Minister addresses the nation following the Bill's passage, calling it \"a defining moment for digital India.\"" },
  { id: "u3", timestamp: "10:30 AM", text: "The Bill passed with 312 votes in favour and 184 against. Three amendments moved by the opposition were defeated in division." },
  { id: "u4", timestamp: "09:48 AM", text: "Minister of Electronics and IT begins his reply to the debate. Defends the inclusion of the Cabinet Secretary on the oversight authority." },
  { id: "u5", timestamp: "09:05 AM", text: "Discussion on the Digital Public Infrastructure Bill enters its sixth hour. Twelve members have spoken so far, including six from the opposition." },
  { id: "u6", timestamp: "08:20 AM", text: "Parliament convenes for the final day of the monsoon session. The Digital Public Infrastructure Bill listed for passage today." },
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

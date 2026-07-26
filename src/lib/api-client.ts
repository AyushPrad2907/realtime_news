"use client";

import type {
  Article,
  Author,
  Category,
  PodcastEpisode,
  PodcastSeries,
  Job,
  LiveUpdate,
} from "@/lib/types";

// ── Public endpoints ─────────────────────────────────────────────────────

export async function fetchArticles(params: {
  category?: string;
  state?: string;
  breaking?: boolean;
  featured?: boolean;
  limit?: number;
  sort?: "newest" | "popular";
  date?: string; // YYYY-MM-DD
  lang?: "en" | "hi";
} = {}): Promise<Article[]> {
  const q = new URLSearchParams();
  if (params.category) q.set("category", params.category);
  if (params.state) q.set("state", params.state);
  if (params.breaking) q.set("breaking", "true");
  if (params.featured) q.set("featured", "true");
  if (params.limit) q.set("limit", String(params.limit));
  if (params.sort) q.set("sort", params.sort);
  if (params.date) q.set("date", params.date);
  if (params.lang) q.set("lang", params.lang);
  const res = await fetch(`/api/articles?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch articles");
  const data = await res.json();
  return data.articles as Article[];
}

export async function fetchArticle(slug: string): Promise<{
  article: Article;
  author: Author;
} | null> {
  const res = await fetch(`/api/articles/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`/api/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories as Category[];
}

export async function fetchPodcasts(): Promise<{
  series: (PodcastSeries & { episodes: number })[];
  episodes: PodcastEpisode[];
}> {
  const res = await fetch(`/api/podcasts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch podcasts");
  return res.json();
}

export async function fetchPodcastEpisode(slug: string): Promise<{
  episode: PodcastEpisode;
  series: PodcastSeries;
  otherEpisodes: PodcastEpisode[];
} | null> {
  const res = await fetch(`/api/podcasts/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`/api/jobs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  return data.jobs as Job[];
}

export async function fetchJob(slug: string): Promise<Job | null> {
  const res = await fetch(`/api/jobs/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.job as Job;
}

export async function fetchLive(): Promise<{
  isLive: boolean;
  viewerCount: number;
  startedAt: string | null;
  programTitle: string;
  programDesc: string;
  youtubeUrl: string;
  nextBroadcastAt: string | null;
  showOnHomepage: boolean;
  updates: LiveUpdate[];
}> {
  const res = await fetch(`/api/live`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch live");
  return res.json();
}

export async function fetchBreaking(lang: "en" | "hi" = "en"): Promise<string[]> {
  const res = await fetch(`/api/breaking?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as string[];
}

export async function fetchSearch(query: string): Promise<{
  articles: Article[];
  podcasts: PodcastEpisode[];
  total: number;
}> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });
  if (!res.ok) return { articles: [], podcasts: [], total: 0 };
  return res.json();
}

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const res = await fetch(`/api/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.ok;
}

export async function submitAdvertiseInquiry(data: {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  websiteUrl?: string;
  formats: string[];
  budget?: string;
  startDate?: string;
  message?: string;
}): Promise<boolean> {
  const res = await fetch(`/api/advertise/inquire`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function submitContact(data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const res = await fetch(`/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function submitJobApplication(
  slug: string,
  data: {
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resumePath: string;
    coverLetter?: string;
    source?: string;
  }
): Promise<boolean> {
  const res = await fetch(`/api/jobs/${slug}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

// ── Session ─────────────────────────────────────────────────────────────

export async function fetchSession(): Promise<{
  user: { id: string; email: string; name: string; role: "EDITOR" | "ADMIN" } | null;
}> {
  const res = await fetch(`/api/session`, { cache: "no-store" });
  if (!res.ok) return { user: null };
  return res.json();
}

export async function signIn(email: string, password: string): Promise<boolean> {
  // Get CSRF token
  const csrfRes = await fetch(`/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();

  // Submit credentials
  const formData = new URLSearchParams();
  formData.set("email", email);
  formData.set("password", password);
  formData.set("csrfToken", csrfToken);
  formData.set("callbackUrl", "/api/session");
  formData.set("json", "true");

  const res = await fetch(`/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
    redirect: "manual",
  });
  return res.ok || res.status === 302;
}

export async function signOut(): Promise<void> {
  const csrfRes = await fetch(`/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const formData = new URLSearchParams();
  formData.set("csrfToken", csrfToken);
  formData.set("callbackUrl", "/");
  formData.set("json", "true");
  await fetch(`/api/auth/signout`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
}

// ── Editor endpoints ────────────────────────────────────────────────────

export async function fetchEditorArticles(): Promise<Article[]> {
  const res = await fetch(`/api/editor/articles`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles as Article[];
}

export async function createArticle(data: any): Promise<Article | null> {
  const res = await fetch(`/api/editor/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const d = await res.json();
  return d.article as Article;
}

export async function updateArticle(id: string, data: any): Promise<Article | null> {
  const res = await fetch(`/api/editor/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const d = await res.json();
  return d.article as Article;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const res = await fetch(`/api/editor/articles/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function submitArticleForReview(id: string): Promise<boolean> {
  const res = await fetch(`/api/editor/articles/${id}/submit`, { method: "POST" });
  return res.ok;
}

export async function uploadFile(file: File): Promise<{ url: string; filename: string } | null> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/editor/upload`, { method: "POST", body: formData });
  if (!res.ok) return null;
  return res.json();
}

// ── Admin endpoints ─────────────────────────────────────────────────────

export async function adminFetchArticles(params: { status?: string; category?: string } = {}) {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.category) q.set("category", params.category);
  const res = await fetch(`/api/admin/articles?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.articles as Article[];
}

export async function adminApproveArticle(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/articles/${id}/approve`, { method: "POST" });
  return res.ok;
}

export async function adminRejectArticle(id: string, note?: string): Promise<boolean> {
  const res = await fetch(`/api/admin/articles/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: note ?? "" }),
  });
  return res.ok;
}

export async function adminFetchEditors() {
  const res = await fetch(`/api/admin/editors`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.users as Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    jobTitle: string | null;
    avatar: string | null;
    createdAt: string;
    _count: { articles: number };
  }>;
}

export async function adminCreateEditor(data: {
  name: string;
  email: string;
  password: string;
  role?: "EDITOR" | "ADMIN";
  jobTitle?: string;
  bio?: string;
}) {
  const res = await fetch(`/api/admin/editors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateEditor(id: string, data: any) {
  const res = await fetch(`/api/admin/editors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminDeleteEditor(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/editors/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchAds() {
  const res = await fetch(`/api/admin/ads`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.ads as Array<any>;
}

export async function adminCreateAd(data: any) {
  const res = await fetch(`/api/admin/ads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateAd(id: string, data: any) {
  const res = await fetch(`/api/admin/ads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminDeleteAd(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchLive() {
  const res = await fetch(`/api/admin/live`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateLive(data: any) {
  const res = await fetch(`/api/admin/live`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminFetchCareers() {
  const res = await fetch(`/api/admin/careers`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.jobs as Array<any>;
}

export async function adminCreateCareer(data: any) {
  const res = await fetch(`/api/admin/careers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateCareer(id: string, data: any) {
  const res = await fetch(`/api/admin/careers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminDeleteCareer(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/careers/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchAnalytics(days = 30) {
  const res = await fetch(`/api/admin/analytics?days=${days}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function adminFetchLayout() {
  const res = await fetch(`/api/admin/layout`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateLayout(data: { featuredId?: string; orderedIds?: string[] }) {
  const res = await fetch(`/api/admin/layout`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
}

// ── Admin: Messages, Inquiries, Applications, Subscribers, Breaking, Live Updates ──

export async function adminFetchMessages(status?: string) {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  const res = await fetch(`/api/admin/messages?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.messages as Array<any>;
}

export async function adminUpdateMessageStatus(id: string, status: string) {
  const res = await fetch(`/api/admin/messages`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  return res.ok;
}

export async function adminDeleteMessage(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchInquiries(status?: string) {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  const res = await fetch(`/api/admin/inquiries?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.inquiries as Array<any>;
}

export async function adminUpdateInquiryStatus(id: string, status: string) {
  const res = await fetch(`/api/admin/inquiries`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  return res.ok;
}

export async function adminDeleteInquiry(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchApplications(jobId?: string) {
  const q = new URLSearchParams();
  if (jobId) q.set("jobId", jobId);
  const res = await fetch(`/api/admin/applications?${q.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.applications as Array<any>;
}

export async function adminDeleteApplication(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/applications?id=${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchSubscribers() {
  const res = await fetch(`/api/admin/subscribers`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.subscribers as Array<any>;
}

export async function adminDeleteSubscriber(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchBreaking() {
  const res = await fetch(`/api/admin/breaking`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as Array<any>;
}

export async function adminCreateBreaking(text: string, isActive = true) {
  const res = await fetch(`/api/admin/breaking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, isActive }),
  });
  return res.ok;
}

export async function adminUpdateBreaking(id: string, data: { text?: string; isActive?: boolean; order?: number }) {
  const res = await fetch(`/api/admin/breaking`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  return res.ok;
}

export async function adminDeleteBreaking(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/breaking/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function adminFetchLiveUpdates() {
  const res = await fetch(`/api/admin/live-updates`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.updates as Array<any>;
}

export async function adminCreateLiveUpdate(text: string, timestamp?: string) {
  const res = await fetch(`/api/admin/live-updates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, timestamp }),
  });
  return res.ok;
}

export async function adminUpdateLiveUpdate(id: string, data: { text?: string; timestamp?: string }) {
  const res = await fetch(`/api/admin/live-updates`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  return res.ok;
}

export async function adminDeleteLiveUpdate(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/live-updates/${id}`, { method: "DELETE" });
  return res.ok;
}

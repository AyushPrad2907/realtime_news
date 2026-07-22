"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import {
  adminFetchArticles,
  adminApproveArticle,
  adminRejectArticle,
  adminFetchEditors,
  adminCreateEditor,
  adminUpdateEditor,
  adminDeleteEditor,
  adminFetchAds,
  adminCreateAd,
  adminUpdateAd,
  adminDeleteAd,
  adminFetchLive,
  adminUpdateLive,
  adminFetchCareers,
  adminCreateCareer,
  adminUpdateCareer,
  adminDeleteCareer,
  adminFetchAnalytics,
} from "@/lib/api-client";
import { PanelShell, ADMIN_NAV } from "./PanelShell";
import { CATEGORIES } from "@/lib/mock-data";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Plus,
  Edit3,
  Trash2,
  Save,
  ExternalLink,
  Users,
  FileText,
  Megaphone,
  Radio,
  Briefcase,
  TrendingUp,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Article } from "@/lib/types";

type AdminView =
  | "dashboard"
  | "articles"
  | "editors"
  | "ads"
  | "live"
  | "careers"
  | "layout"
  | "analytics";

const STATUS_META: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "text-ink-tertiary bg-muted" },
  PENDING: { label: "Pending", color: "text-amber-700 bg-amber-100 dark:bg-amber-900/30" },
  PUBLISHED: { label: "Published", color: "text-success bg-success/10" },
  REJECTED: { label: "Rejected", color: "text-destructive bg-destructive/10" },
  ARCHIVED: { label: "Archived", color: "text-ink-tertiary bg-muted" },
};

export function AdminPanel({ view }: { view?: AdminView }) {
  const { user, navigate } = useStore();
  const activeView = view ?? "dashboard";

  return (
    <PanelShell
      role="ADMIN"
      items={ADMIN_NAV}
      active={activeView}
      onSelect={(id) => navigate({ type: "admin", view: id as AdminView })}
      user={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "ADMIN",
      }}
    >
      {activeView === "dashboard" && <AdminDashboard />}
      {activeView === "articles" && <AdminArticles />}
      {activeView === "editors" && <AdminEditors />}
      {activeView === "ads" && <AdminAds />}
      {activeView === "live" && <AdminLive />}
      {activeView === "careers" && <AdminCareers />}
      {activeView === "layout" && <AdminLayout />}
      {activeView === "analytics" && <AdminAnalytics />}
    </PanelShell>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

function AdminDashboard() {
  const { navigate } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      adminFetchAnalytics(7).then((d) => {
        setStats(d);
        setLoading(false);
      });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  const cards = [
    { label: "Total articles", value: stats.summary.totalArticles, Icon: FileText, color: "text-brand" },
    { label: "Pending review", value: stats.summary.pendingArticles, Icon: AlertCircle, color: "text-amber-600" },
    { label: "Total editors", value: stats.summary.totalEditors, Icon: Users, color: "text-foreground" },
    { label: "Active ads", value: stats.summary.activeAds, Icon: Megaphone, color: "text-success" },
    { label: "Total views", value: stats.summary.totalViews.toLocaleString(), Icon: TrendingUp, color: "text-brand" },
    { label: "Published", value: stats.summary.publishedArticles, Icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Welcome back.</h2>
        <p className="font-ui text-sm text-ink-secondary mt-1">
          Here&rsquo;s what&rsquo;s happening across the publication.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-lg border border-border bg-card">
            <c.Icon className={`h-5 w-5 ${c.color} mb-3`} />
            <p className="font-display text-3xl font-extrabold">{c.value}</p>
            <p className="font-ui text-xs text-ink-tertiary mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-display text-lg font-bold mb-3">Quick actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate({ type: "admin", view: "articles" })}
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="font-ui text-sm">Review pending articles</span>
              {stats.summary.pendingArticles > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  {stats.summary.pendingArticles}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate({ type: "admin", view: "editors" })}
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="font-ui text-sm">Manage editors</span>
              <Users className="h-4 w-4 text-ink-tertiary" />
            </button>
            <button
              onClick={() => navigate({ type: "admin", view: "ads" })}
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="font-ui text-sm">Manage advertisements</span>
              <Megaphone className="h-4 w-4 text-ink-tertiary" />
            </button>
            <button
              onClick={() => navigate({ type: "admin", view: "live" })}
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="font-ui text-sm">Manage live broadcast</span>
              <Radio className="h-4 w-4 text-ink-tertiary" />
            </button>
            <button
              onClick={() => navigate({ type: "admin", view: "analytics" })}
              className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
            >
              <span className="font-ui text-sm">View analytics</span>
              <TrendingUp className="h-4 w-4 text-ink-tertiary" />
            </button>
          </div>
        </div>

        {/* Recent articles */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-display text-lg font-bold mb-3">Top stories by views</h3>
          <ol className="space-y-2">
            {stats.topArticles.slice(0, 5).map((a: any, i: number) => (
              <li key={a.id} className="flex items-baseline gap-3">
                <span className="font-display text-lg font-extrabold text-ink-tertiary/40 tabular-nums w-6">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-sm line-clamp-1">{a.title}</p>
                  <p className="font-ui text-[11px] text-ink-tertiary">
                    {a.authorName} · {a.views.toLocaleString()} views
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─── Articles review queue ────────────────────────────────────────────────

function AdminArticles() {
  const { navigate } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("PENDING");

  const load = async () => {
    setLoading(true);
    const data = await adminFetchArticles({ status: filter });
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, [filter]);

  const onApprove = async (id: string) => {
    const ok = await adminApproveArticle(id);
    if (ok) {
      toast.success("Article approved and published.");
      load();
    } else {
      toast.error("Failed to approve.");
    }
  };

  const onReject = async (id: string) => {
    const note = prompt("Reason for rejection (will be visible to the editor):");
    if (note === null) return;
    const ok = await adminRejectArticle(id, note);
    if (ok) {
      toast.success("Article rejected.");
      load();
    } else {
      toast.error("Failed to reject.");
    }
  };

  const tabs = [
    { key: "PENDING", label: "Pending" },
    { key: "PUBLISHED", label: "Published" },
    { key: "DRAFT", label: "Drafts" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`shrink-0 px-3 py-1.5 rounded-md font-ui text-xs font-medium transition-colors ${
              filter === t.key
                ? "bg-foreground text-background"
                : "bg-muted text-ink-secondary hover:bg-muted/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center bg-card border border-dashed border-border rounded-lg">
          <FileText className="h-10 w-10 text-ink-tertiary mx-auto mb-3" />
          <p className="font-display text-lg font-bold">No {filter.toLowerCase()} articles</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {articles.map((a: any, i) => {
            const sm = STATUS_META[a.status] ?? STATUS_META.DRAFT;
            return (
              <div
                key={a.id}
                className={`p-4 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${sm.color}`}>
                        {sm.label}
                      </span>
                      <span className="font-ui text-[10px] text-ink-tertiary uppercase tracking-wide">
                        {a.category}
                      </span>
                      {a.isFeatured && (
                        <span className="text-[10px] text-brand font-semibold uppercase">★ Featured</span>
                      )}
                    </div>
                    <p className="font-display text-base font-bold line-clamp-1">{a.title}</p>
                    <p className="font-serif text-sm text-ink-secondary line-clamp-2 mt-1">
                      {a.standfirst}
                    </p>
                    <p className="font-ui text-[11px] text-ink-tertiary mt-2">
                      By {a.authorName ?? "Unknown"} · updated{" "}
                      {new Date(a.updatedAt ?? a.publishedAt).toLocaleDateString()}
                      {a.rejectionNote && ` · rejected: ${a.rejectionNote}`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => navigate({ type: "article", slug: a.slug })}
                      className="p-2 rounded-md hover:bg-muted"
                      aria-label="Preview"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {a.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove(a.id)}
                          className="p-2 rounded-md hover:bg-success/10 text-success"
                          aria-label="Approve"
                          title="Approve & publish"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onReject(a.id)}
                          className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                          aria-label="Reject"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Editors management ───────────────────────────────────────────────────

function AdminEditors() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
    jobTitle: "",
    bio: "",
    status: "ACTIVE",
  });
  const { user: currentUser } = useStore();

  const load = async () => {
    setLoading(true);
    const data = await adminFetchEditors();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "EDITOR",
      jobTitle: "",
      bio: "",
      status: "ACTIVE",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const onSave = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }
    try {
      if (editingId) {
        const payload: any = { ...form };
        if (!payload.password) delete payload.password;
        await adminUpdateEditor(editingId, payload);
        toast.success("Editor updated.");
      } else {
        if (!form.password) {
          toast.error("Password is required for new users.");
          return;
        }
        await adminCreateEditor(form);
        toast.success("Editor created.");
      }
      resetForm();
      load();
    } catch (e) {
      toast.error("Failed to save.");
    }
  };

  const onDelete = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    if (!confirm("Delete this user? Their articles will be preserved.")) return;
    const ok = await adminDeleteEditor(id);
    if (ok) {
      toast.success("User deleted.");
      load();
    } else {
      toast.error("Failed to delete.");
    }
  };

  const onEdit = (u: any) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      jobTitle: u.jobTitle ?? "",
      bio: "",
      status: u.status,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Editors</h2>
          <p className="font-ui text-xs text-ink-tertiary mt-0.5">
            Manage editor and admin accounts.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New User
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold">
              {editingId ? "Edit user" : "Create new user"}
            </h3>
            <button onClick={resetForm} className="p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <input
              type="text"
              placeholder={editingId ? "New password (leave blank to keep)" : "Password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <input
              type="text"
              placeholder="Job title"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              {editingId ? "Save changes" : "Create user"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {users.map((u: any, i) => (
            <div
              key={u.id}
              className={`p-4 flex items-center gap-4 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="h-10 w-10 rounded-full bg-brand/15 text-brand flex items-center justify-center font-display font-bold shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-ui text-sm font-semibold">{u.name}</p>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                      u.role === "ADMIN"
                        ? "bg-brand/15 text-brand"
                        : "bg-muted text-ink-secondary"
                    }`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                      u.status === "ACTIVE"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
                <p className="font-ui text-[11px] text-ink-tertiary mt-0.5">
                  {u.email} · {u.jobTitle ?? "No title"} · {u._count?.articles ?? 0} articles
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(u)}
                  className="p-2 rounded-md hover:bg-muted"
                  aria-label="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(u.id)}
                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Ads management ──────────────────────────────────────────────────────

function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "leaderboard",
    placement: "homepage-top",
    imageUrl: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    status: "SCHEDULED",
  });

  const load = async () => {
    setLoading(true);
    const data = await adminFetchAds();
    setAds(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      type: "leaderboard",
      placement: "homepage-top",
      imageUrl: "",
      linkUrl: "",
      startDate: "",
      endDate: "",
      status: "SCHEDULED",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const onSave = async () => {
    if (!form.name) {
      toast.error("Name is required.");
      return;
    }
    try {
      if (editingId) {
        await adminUpdateAd(editingId, form);
        toast.success("Ad updated.");
      } else {
        await adminCreateAd(form);
        toast.success("Ad created.");
      }
      resetForm();
      load();
    } catch {
      toast.error("Failed to save ad.");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const ok = await adminDeleteAd(id);
    if (ok) {
      toast.success("Ad deleted.");
      load();
    }
  };

  const onEdit = (ad: any) => {
    setEditingId(ad.id);
    setForm({
      name: ad.name,
      type: ad.type,
      placement: ad.placement,
      imageUrl: ad.imageUrl ?? "",
      linkUrl: ad.linkUrl ?? "",
      startDate: ad.startDate?.slice(0, 10) ?? "",
      endDate: ad.endDate?.slice(0, 10) ?? "",
      status: ad.status,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Advertisements</h2>
          <p className="font-ui text-xs text-ink-tertiary mt-0.5">
            Manage ad placements across the site.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Ad
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold">
              {editingId ? "Edit ad" : "Create new ad"}
            </h3>
            <button onClick={resetForm} className="p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Ad name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option value="leaderboard">Leaderboard (728×90)</option>
              <option value="rectangle">Rectangle (300×250)</option>
              <option value="mobile-banner">Mobile banner (320×50)</option>
              <option value="native">Native</option>
            </select>
            <select
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option value="homepage-top">Homepage top</option>
              <option value="article-inline">Article inline</option>
              <option value="sidebar">Sidebar</option>
              <option value="footer">Footer</option>
            </select>
            <input
              type="text"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            />
            <input
              type="text"
              placeholder="Link URL"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            />
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              {editingId ? "Save changes" : "Create ad"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : ads.length === 0 ? (
        <div className="py-12 text-center bg-card border border-dashed border-border rounded-lg">
          <Megaphone className="h-10 w-10 text-ink-tertiary mx-auto mb-3" />
          <p className="font-display text-lg font-bold">No ads yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {ads.map((ad: any, i) => (
            <div key={ad.id} className={`p-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-start gap-4">
                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt=""
                    className="h-12 w-16 object-cover rounded shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-ui text-sm font-semibold">{ad.name}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                        ad.status === "ACTIVE"
                          ? "bg-success/10 text-success"
                          : ad.status === "PAUSED"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-muted text-ink-secondary"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </div>
                  <p className="font-ui text-[11px] text-ink-tertiary">
                    {ad.type} · {ad.placement} · {ad.impressions.toLocaleString()} impressions · {ad.clicks.toLocaleString()} clicks
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(ad)}
                    className="p-2 rounded-md hover:bg-muted"
                    aria-label="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(ad.id)}
                    className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Live management ──────────────────────────────────────────────────────

function AdminLive() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await adminFetchLive();
    setConfig(data?.config);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const onSave = async () => {
    setSaving(true);
    await adminUpdateLive({
      youtubeUrl: config.youtubeUrl,
      programTitle: config.programTitle,
      programDesc: config.programDesc,
      isLive: config.isLive,
      viewerCount: config.viewerCount,
      showOnHomepage: config.showOnHomepage,
    });
    toast.success("Live settings saved.");
    setSaving(false);
  };

  if (loading || !config) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Live broadcast</h2>
        <p className="font-ui text-xs text-ink-tertiary mt-0.5">
          Configure the live stream shown on the homepage and /live page.
        </p>
      </div>

      <div className="p-5 rounded-lg border border-border bg-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-ui text-sm font-semibold">Live status</p>
            <p className="font-ui text-xs text-ink-tertiary mt-0.5">
              Toggle to start/stop the broadcast.
            </p>
          </div>
          <button
            onClick={() => setConfig({ ...config, isLive: !config.isLive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.isLive ? "bg-live" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                config.isLive ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-1.5">
              YouTube Live URL
            </label>
            <input
              type="url"
              value={config.youtubeUrl ?? ""}
              onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=…"
              className="w-full h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-1.5">
              Program title
            </label>
            <input
              type="text"
              value={config.programTitle ?? ""}
              onChange={(e) => setConfig({ ...config, programTitle: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-1.5">
              Program description
            </label>
            <textarea
              rows={3}
              value={config.programDesc ?? ""}
              onChange={(e) => setConfig({ ...config, programDesc: e.target.value })}
              className="w-full p-3 rounded-md border border-border bg-background font-ui text-sm resize-none"
            />
          </div>
          <div>
            <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary mb-1.5">
              Viewer count
            </label>
            <input
              type="number"
              value={config.viewerCount ?? 0}
              onChange={(e) =>
                setConfig({ ...config, viewerCount: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 font-ui text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={config.showOnHomepage ?? true}
                onChange={(e) =>
                  setConfig({ ...config, showOnHomepage: e.target.checked })
                }
                className="h-4 w-4 accent-brand"
              />
              Show on homepage
            </label>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save settings
        </button>
      </div>
    </div>
  );
}

// ─── Careers management ──────────────────────────────────────────────────

function AdminCareers() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    department: "Editorial",
    location: "",
    type: "Full-time",
    description: "",
    responsibilities: "",
    requirements: "",
    niceToHaves: "",
    benefits: "",
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    const data = await adminFetchCareers();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      department: "Editorial",
      location: "",
      type: "Full-time",
      description: "",
      responsibilities: "",
      requirements: "",
      niceToHaves: "",
      benefits: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const onSave = async () => {
    if (!form.title || !form.location) {
      toast.error("Title and location are required.");
      return;
    }
    const payload = {
      ...form,
      responsibilities: form.responsibilities.split("\n").filter(Boolean),
      requirements: form.requirements.split("\n").filter(Boolean),
      niceToHaves: form.niceToHaves ? form.niceToHaves.split("\n").filter(Boolean) : null,
      benefits: form.benefits.split("\n").filter(Boolean),
    };
    try {
      if (editingId) {
        await adminUpdateCareer(editingId, payload);
        toast.success("Job updated.");
      } else {
        await adminCreateCareer(payload);
        toast.success("Job created.");
      }
      resetForm();
      load();
    } catch {
      toast.error("Failed to save job.");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return;
    const ok = await adminDeleteCareer(id);
    if (ok) {
      toast.success("Job deleted.");
      load();
    }
  };

  const onEdit = (job: any) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      responsibilities: (job.responsibilities ?? []).join("\n"),
      requirements: (job.requirements ?? []).join("\n"),
      niceToHaves: (job.niceToHaves ?? []).join("\n"),
      benefits: (job.benefits ?? []).join("\n"),
      isActive: job.isActive,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Careers</h2>
          <p className="font-ui text-xs text-ink-tertiary mt-0.5">
            Post and manage open positions.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Job
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-lg border border-border bg-card space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">
              {editingId ? "Edit job" : "Create new job posting"}
            </h3>
            <button onClick={resetForm} className="p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Job title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            />
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option>Editorial</option>
              <option>Tech</option>
              <option>Sales</option>
              <option>Operations</option>
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="h-10 px-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="p-3 rounded-md border border-border bg-background font-ui text-sm sm:col-span-2 resize-none"
            />
            <textarea
              placeholder="Responsibilities (one per line)"
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              rows={4}
              className="p-3 rounded-md border border-border bg-background font-ui text-sm resize-none"
            />
            <textarea
              placeholder="Requirements (one per line)"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              rows={4}
              className="p-3 rounded-md border border-border bg-background font-ui text-sm resize-none"
            />
            <textarea
              placeholder="Nice-to-haves (one per line)"
              value={form.niceToHaves}
              onChange={(e) => setForm({ ...form, niceToHaves: e.target.value })}
              rows={3}
              className="p-3 rounded-md border border-border bg-background font-ui text-sm resize-none"
            />
            <textarea
              placeholder="Benefits (one per line)"
              value={form.benefits}
              onChange={(e) => setForm({ ...form, benefits: e.target.value })}
              rows={3}
              className="p-3 rounded-md border border-border bg-background font-ui text-sm resize-none"
            />
          </div>
          <label className="flex items-center gap-2 font-ui text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 accent-brand"
            />
            Active (visible to applicants)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              {editingId ? "Save changes" : "Create job"}
            </button>
            <button
              onClick={resetForm}
              className="px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {jobs.map((job: any, i) => (
            <div key={job.id} className={`p-4 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-ui text-sm font-semibold">{job.title}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-muted text-ink-secondary">
                      {job.department}
                    </span>
                    {!job.isActive && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-destructive/10 text-destructive">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="font-ui text-[11px] text-ink-tertiary">
                    {job.location} · {job.type} · {job.applicationCount ?? 0} applications
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(job)}
                    className="p-2 rounded-md hover:bg-muted"
                    aria-label="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Homepage layout manager ─────────────────────────────────────────────

function AdminLayout() {
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await adminFetchLayout();
    setLayout(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const setFeatured = async (id: string) => {
    setSaving(true);
    await import("@/lib/api-client").then((m) => m.adminUpdateLayout({ featuredId: id }));
    setSaving(false);
    toast.success("Featured story updated.");
    load();
  };

  if (loading || !layout) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold">Homepage layout</h2>
        <p className="font-ui text-xs text-ink-tertiary mt-0.5">
          Choose the featured story that appears at the top of the homepage.
        </p>
      </div>

      {layout.featured && (
        <div className="p-4 rounded-lg border-2 border-brand bg-brand/5">
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand mb-1">
            ★ Currently featured
          </p>
          <p className="font-display text-base font-bold line-clamp-2">{layout.featured.title}</p>
          <p className="font-ui text-xs text-ink-tertiary mt-1">
            {layout.featured.category} · {layout.featured.readingTime} min read
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-3 border-b border-border bg-muted/50">
          <p className="font-ui text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
            Published articles — click to feature
          </p>
        </div>
        {layout.topStories.map((a: any, i: number) => (
          <button
            key={a.id}
            onClick={() => setFeatured(a.id)}
            className={`w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center gap-3 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <span className="font-display text-lg font-extrabold text-ink-tertiary/40 w-6 shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-ui text-sm font-medium line-clamp-1">{a.title}</p>
              <p className="font-ui text-[11px] text-ink-tertiary mt-0.5">
                {a.category} · {a.readingTime} min · {a.views.toLocaleString()} views
              </p>
            </div>
          </button>
        ))}
      </div>

      {saving && (
        <p className="font-ui text-xs text-ink-tertiary flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
        </p>
      )}
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────

function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const id = setTimeout(() => {
      adminFetchAnalytics(days).then((d) => {
        setData(d);
        setLoading(false);
      });
    }, 0);
    return () => clearTimeout(id);
  }, [days]);

  if (loading || !data) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  const maxDaily = Math.max(...data.dailyViews.map((d: any) => d.views), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Analytics</h2>
          <p className="font-ui text-xs text-ink-tertiary mt-0.5">
            Performance across the publication.
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => {
            setLoading(true);
            setDays(parseInt(e.target.value, 10));
          }}
          className="h-9 px-3 rounded-md border border-border bg-card font-ui text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Daily views chart */}
      <div className="p-5 rounded-lg border border-border bg-card">
        <h3 className="font-display text-base font-bold mb-4">Daily views (last {days} days)</h3>
        <div className="flex items-end gap-0.5 h-40">
          {data.dailyViews.map((d: any, i: number) => (
            <div
              key={i}
              className="flex-1 bg-brand/70 hover:bg-brand rounded-t transition-colors"
              style={{ height: `${(d.views / maxDaily) * 100}%`, minHeight: "2px" }}
              title={`${d.date}: ${d.views.toLocaleString()} views`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 font-ui text-[10px] text-ink-tertiary">
          <span>{data.dailyViews[0]?.date}</span>
          <span>{data.dailyViews[data.dailyViews.length - 1]?.date}</span>
        </div>
      </div>

      {/* Two-column: top articles + categories */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-display text-base font-bold mb-3">Top articles</h3>
          <ol className="space-y-2">
            {data.topArticles.slice(0, 8).map((a: any, i: number) => (
              <li key={a.id} className="flex items-baseline gap-2.5">
                <span className="font-display text-base font-extrabold text-ink-tertiary/40 w-5 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-ui text-xs line-clamp-1">{a.title}</p>
                  <p className="font-ui text-[10px] text-ink-tertiary">
                    {a.authorName} · {a.views.toLocaleString()} views
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-display text-base font-bold mb-3">Category performance</h3>
          <div className="space-y-2.5">
            {data.categoryPerformance.map((c: any) => {
              const max = data.categoryPerformance[0]?.views ?? 1;
              const pct = (c.views / max) * 100;
              return (
                <div key={c.category}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-ui text-xs font-semibold capitalize">{c.category}</span>
                    <span className="font-ui text-[10px] text-ink-tertiary">
                      {c.views.toLocaleString()} · {c.count} articles
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

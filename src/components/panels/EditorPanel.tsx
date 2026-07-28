"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import {
  fetchEditorArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticleForReview,
  uploadFile,
} from "@/lib/api-client";
import { CATEGORIES } from "@/lib/mock-data";
import { PanelShell, EDITOR_NAV } from "./PanelShell";
import { Article } from "@/lib/types";
import {
  Plus,
  Edit3,
  Trash2,
  Send,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Save,
  Image as ImageIcon,
  Headphones,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryBadge } from "@/components/cards/CategoryBadge";

type EditorView = "dashboard" | "new-article" | "edit-article";

const STATUS_META: Record<string, { label: string; color: string; Icon: typeof Clock }> = {
  DRAFT: { label: "Draft", color: "text-ink-tertiary bg-muted", Icon: FileText },
  PENDING: { label: "Pending Review", color: "text-amber-700 bg-amber-100 dark:bg-amber-900/30", Icon: Clock },
  PUBLISHED: { label: "Published", color: "text-success bg-success/10", Icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-destructive bg-destructive/10", Icon: XCircle },
  ARCHIVED: { label: "Archived", color: "text-ink-tertiary bg-muted", Icon: FileText },
};

export function EditorPanel({ view, articleId }: { view?: EditorView; articleId?: string }) {
  const { user, navigate } = useStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchEditorArticles();
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    // Defer to avoid setState-in-effect lint rule (load is async + setStateful)
    const id = setTimeout(() => {
      loadArticles();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const activeView = view ?? "dashboard";

  return (
    <PanelShell
      role="EDITOR"
      items={EDITOR_NAV}
      active={activeView === "edit-article" ? "submissions" : activeView}
      onSelect={(id) => {
        if (id === "new-article") navigate({ type: "editor", view: "new-article" });
        else if (id === "submissions") navigate({ type: "editor", view: "dashboard" });
        else navigate({ type: "editor", view: "dashboard" });
      }}
      user={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "EDITOR",
      }}
    >
      {activeView === "dashboard" && (
        <DashboardView articles={articles} loading={loading} onRefresh={loadArticles} />
      )}
      {activeView === "new-article" && (
        <ArticleEditor
          onSave={async (data) => {
            const a = await createArticle(data);
            if (a) {
              toast.success("Draft saved.");
              await loadArticles();
              navigate({ type: "editor", view: "edit-article", articleId: a.id });
            } else {
              toast.error("Failed to save draft.");
            }
            return a;
          }}
          onCancel={() => navigate({ type: "editor", view: "dashboard" })}
        />
      )}
      {activeView === "edit-article" && articleId && (
        <ArticleEditor
          articleId={articleId}
          onSave={async (data) => {
            const a = await updateArticle(articleId, data);
            if (a) {
              toast.success("Saved.");
              await loadArticles();
            } else {
              toast.error("Failed to save.");
            }
            return a;
          }}
          onSubmit={async () => {
            const ok = await submitArticleForReview(articleId);
            if (ok) {
              toast.success("Submitted for review!");
              await loadArticles();
              navigate({ type: "editor", view: "dashboard" });
            } else {
              toast.error("Failed to submit.");
            }
          }}
          onDelete={async () => {
            const ok = await deleteArticle(articleId);
            if (ok) {
              toast.success("Article deleted.");
              await loadArticles();
              navigate({ type: "editor", view: "dashboard" });
            }
          }}
          onCancel={() => navigate({ type: "editor", view: "dashboard" })}
        />
      )}
    </PanelShell>
  );
}

function DashboardView({
  articles,
  loading,
  onRefresh,
}: {
  articles: Article[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { navigate } = useStore();
  const stats = {
    total: articles.length,
    drafts: articles.filter((a) => (a as any).status === "DRAFT").length,
    pending: articles.filter((a) => (a as any).status === "PENDING").length,
    published: articles.filter((a) => (a as any).status === "PUBLISHED").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Drafts", value: stats.drafts, color: "text-ink-tertiary" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "Published", value: stats.published, color: "text-success" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-lg border border-border bg-card">
            <p className="font-ui text-[11px] uppercase tracking-wider text-ink-tertiary">
              {s.label}
            </p>
            <p className={`font-display text-2xl font-extrabold mt-1 ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">My submissions</h2>
          <p className="font-ui text-xs text-ink-tertiary mt-0.5">
            Drafts, pending reviews, and published articles.
          </p>
        </div>
        <button
          onClick={() => navigate({ type: "editor", view: "new-article" })}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New Article
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed border-border rounded-lg">
          <FileText className="h-10 w-10 text-ink-tertiary mx-auto mb-3" />
          <p className="font-display text-lg font-bold">No articles yet</p>
          <p className="font-ui text-sm text-ink-secondary mt-1 mb-4">
            Get started by creating your first article.
          </p>
          <button
            onClick={() => navigate({ type: "editor", view: "new-article" })}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Create Article
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {articles.map((a: any, i) => {
            const sm = STATUS_META[a.status] ?? STATUS_META.DRAFT;
            return (
              <div
                key={a.id}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${sm.color}`}
                    >
                      <sm.Icon className="h-2.5 w-2.5" />
                      {sm.label}
                    </span>
                    {a.isFeatured && (
                      <span className="text-[10px] text-brand font-semibold uppercase">★ Featured</span>
                    )}
                  </div>
                  <p className="font-display text-base font-bold line-clamp-1">{a.title}</p>
                  <p className="font-ui text-xs text-ink-tertiary mt-0.5">
                    {a.category} · updated {new Date(a.updatedAt ?? a.publishedAt).toLocaleDateString()}
                    {a.rejectionNote && ` · rejected: ${a.rejectionNote}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() =>
                      navigate({ type: "article", slug: a.slug })
                    }
                    className="p-2 rounded-md hover:bg-muted"
                    aria-label="Preview"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate({ type: "editor", view: "edit-article", articleId: a.id })
                    }
                    className="p-2 rounded-md hover:bg-muted"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArticleEditor({
  articleId,
  onSave,
  onSubmit,
  onDelete,
  onCancel,
}: {
  articleId?: string;
  onSave: (data: any) => Promise<Article | null>;
  onSubmit?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [standfirst, setStandfirst] = useState("");
  const [category, setCategory] = useState("politics");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroCaption, setHeroCaption] = useState("");
  const [heroCredit, setHeroCredit] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState("");
  const [status, setStatus] = useState<string>("DRAFT");
  const [rejectionNote, setRejectionNote] = useState<string | null>(null);

  // Load existing article
  useEffect(() => {
    if (!articleId) return;
    const id = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/editor/articles/${articleId}`);
      if (res.ok) {
        const { article } = await res.json();
        setTitle(article.title);
        setStandfirst(article.standfirst);
        setCategory(article.category);
        setBody(article.body);
        setTags(Array.isArray(article.tags) ? article.tags.join(", ") : "");
        setHeroImage(article.heroImage);
        setHeroCaption(article.heroCaption ?? "");
        setHeroCredit(article.heroCredit ?? "");
        setHasAudio(article.hasAudio);
        setAudioUrl(article.audioUrl ?? "");
        setAudioDuration(article.audioDuration ?? "");
        setStatus(article.status);
        setRejectionNote(article.rejectionNote);
      }
      setLoading(false);
    }, 0);
    return () => clearTimeout(id);
  }, [articleId]);

  const handleUpload = async (file: File, kind: "image" | "audio") => {
    const result = await uploadFile(file);
    if (!result) {
      toast.error("Upload failed.");
      return;
    }
    if (kind === "image") {
      setHeroImage(result.url);
      toast.success("Image uploaded.");
    } else {
      setAudioUrl(result.url);
      setHasAudio(true);
      toast.success("Audio uploaded.");
    }
  };

  const buildPayload = () => ({
    title,
    standfirst,
    body,
    categorySlug: category,
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    heroImage,
    heroCaption: heroCaption || null,
    heroCredit: heroCredit || null,
    hasAudio,
    audioUrl: audioUrl || null,
    audioDuration: audioDuration || null,
  });

  const save = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return null;
    }
    setSaving(true);
    const a = await onSave(buildPayload());
    setSaving(false);
    return a;
  };

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required before submitting.");
      return;
    }
    setSubmitting(true);
    // Save first if there are unsaved changes
    await onSave(buildPayload());
    if (onSubmit) await onSubmit();
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Rejection note */}
      {rejectionNote && status === "REJECTED" && (
        <div className="p-4 rounded-md bg-destructive/10 border border-destructive/30 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-ui text-xs font-bold uppercase tracking-wide text-destructive mb-1">
              Article was rejected
            </p>
            <p className="font-serif text-sm text-foreground">{rejectionNote}</p>
            <p className="font-ui text-xs text-ink-tertiary mt-1">
              Make your edits and re-submit for review.
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
          Headline
        </label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          placeholder="Write a clear, specific headline…"
          className="w-full p-3 rounded-md border border-border bg-card font-display text-2xl md:text-3xl font-bold leading-tight focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        />
      </div>

      {/* Standfirst */}
      <div>
        <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
          Standfirst / Sub-headline
        </label>
        <textarea
          value={standfirst}
          onChange={(e) => setStandfirst(e.target.value)}
          rows={2}
          placeholder="One or two sentences summarising the story…"
          className="w-full p-3 rounded-md border border-border bg-card font-serif text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        />
      </div>

      {/* Category + tags */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 px-3 rounded-md border border-border bg-card font-ui text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Parliament, Budget2025, Economy"
            className="w-full h-11 px-3 rounded-md border border-border bg-card font-ui text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Hero image */}
      <div>
        <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
          Hero image
        </label>
        {heroImage ? (
          <div className="relative rounded-md overflow-hidden border border-border">
            <img src={heroImage} alt="" referrerPolicy="no-referrer" className="w-full aspect-[16/9] object-cover" />
            <button
              onClick={() => setHeroImage("")}
              className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
            <ImageIcon className="h-6 w-6 text-ink-tertiary" />
            <span className="font-ui text-sm text-ink-secondary">
              Click to upload an image
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f, "image");
              }}
            />
          </label>
        )}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input
            type="text"
            value={heroCaption}
            onChange={(e) => setHeroCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="h-9 px-3 rounded-md border border-border bg-card font-ui text-xs"
          />
          <input
            type="text"
            value={heroCredit}
            onChange={(e) => setHeroCredit(e.target.value)}
            placeholder="Photo credit (optional)"
            className="h-9 px-3 rounded-md border border-border bg-card font-ui text-xs"
          />
        </div>
      </div>

      {/* Body */}
      <div>
        <label className="block font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-1.5">
          Article body (HTML supported)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={20}
          placeholder="<p>The story begins here…</p>"
          className="w-full p-3 rounded-md border border-border bg-card font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand resize-y"
        />
        <p className="font-ui text-[11px] text-ink-tertiary mt-1.5">
          Use HTML tags: <code>&lt;p&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>,{" "}
          <code>&lt;blockquote&gt;</code>, <code>&lt;ul&gt;&lt;li&gt;</code>, <code>&lt;a href&gt;</code>.
          For key-points box:{" "}
          <code>
            &lt;div class="key-points"&gt;&lt;div class="key-points-title"&gt;Key Points&lt;/div&gt;&lt;ul&gt;…&lt;/ul&gt;&lt;/div&gt;
          </code>
        </p>
      </div>

      {/* Audio */}
      <div>
        <label className="flex items-center gap-2 font-ui text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={hasAudio}
            onChange={(e) => setHasAudio(e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          This article has an audio version
        </label>
        {hasAudio && (
          <div className="mt-3 space-y-2">
            {audioUrl ? (
              <div className="flex items-center gap-2">
                <audio src={audioUrl} controls className="flex-1 h-9" />
                <button
                  onClick={() => {
                    setAudioUrl("");
                    setHasAudio(false);
                  }}
                  className="p-2 rounded-md hover:bg-muted text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-border hover:bg-muted cursor-pointer font-ui text-xs">
                <Headphones className="h-3.5 w-3.5" />
                Upload audio
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f, "audio");
                  }}
                />
              </label>
            )}
            <input
              type="text"
              value={audioDuration}
              onChange={(e) => setAudioDuration(e.target.value)}
              placeholder="Duration (e.g. 11:42)"
              className="w-48 h-9 px-3 rounded-md border border-border bg-card font-ui text-xs"
            />
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="sticky bottom-0 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-card/95 backdrop-blur border-t border-border flex items-center gap-2">
        <button
          onClick={onCancel}
          className="px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
        >
          Cancel
        </button>
        <div className="flex-1" />
        {onDelete && (
          <button
            onClick={() => {
              if (confirm("Delete this article? This cannot be undone.")) {
                onDelete();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 font-ui text-sm font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save draft
        </button>
        {status !== "PUBLISHED" && (
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {status === "PENDING" ? "Re-submit" : "Submit for review"}
          </button>
        )}
      </div>
    </div>
  );
}

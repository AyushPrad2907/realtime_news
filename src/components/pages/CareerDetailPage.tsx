"use client";

import { useStore } from "@/lib/store";
import { JOBS } from "@/lib/mock-data";
import { fetchJob, submitJobApplication } from "@/lib/api-client";
import {
  MapPin,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Job } from "@/lib/types";

interface CareerDetailPageProps {
  slug: string;
}

export function CareerDetailPage({ slug }: CareerDetailPageProps) {
  const { navigate, back, canGoBack } = useStore();
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    source: "",
  });
  const [resumePath, setResumePath] = useState("");

  // Start with mock data for instant render, refresh from API in background
  const mockJob = JOBS.find((j) => j.slug === slug);
  const [job, setJob] = useState<Job | null>(mockJob ?? null);
  const [loading, setLoading] = useState(!mockJob);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      fetchJob(slug).then((data) => {
        if (cancelled) return;
        if (data) setJob(data);
        else setJob(null);
        setLoading(false);
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [slug]);

  useEffect(() => {
    if (job) {
      document.title = `${job.title} — Careers — The National Dispatch`;
    }
    return () => {
      document.title = "The National Dispatch";
    };
  }, [job]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-tertiary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Position not found</h1>
        <button
          onClick={() => navigate({ type: "careers" })}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
        >
          Browse all positions
        </button>
      </div>
    );
  }

  const onApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumePath) {
      toast.error("Please attach your resume.");
      return;
    }
    setSubmitting(true);
    const ok = await submitJobApplication(slug, {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
      city: form.city || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      portfolioUrl: form.portfolioUrl || undefined,
      resumePath,
      coverLetter: form.coverLetter || undefined,
      source: form.source || undefined,
    });
    setSubmitting(false);
    if (ok) {
      setApplied(true);
      toast.success("Application submitted! We'll be in touch within 2 weeks.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Upload resume via editor upload endpoint (admin/editor only — but we'll
  // use a public-ish approach: store as a data URL since this is a demo)
  const onUploadResume = async (file: File) => {
    // For demo: we just store the file name. In production we'd POST to a
    // dedicated public upload endpoint and store the file on S3/local disk.
    setResumePath(file.name);
    toast.success(`Resume "${file.name}" attached.`);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-4 md:pt-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 font-ui text-xs text-ink-tertiary mb-4">
        <button
          onClick={() => navigate({ type: "careers" })}
          className="hover:text-brand transition-colors"
        >
          Careers
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-secondary line-clamp-1">{job.title}</span>
      </nav>

      {canGoBack() && (
        <button
          onClick={back}
          className="inline-flex items-center gap-1 font-ui text-xs text-ink-secondary hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">
        {/* Main */}
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white bg-foreground">
                {job.department}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-muted text-ink-secondary">
                {job.type}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-ui text-sm text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {job.type}
              </span>
            </div>
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold mb-3 border-b border-border pb-2">
              About the role
            </h2>
            <p className="font-serif text-base text-ink leading-relaxed">
              {job.description}
            </p>
          </section>

          {/* Responsibilities */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold mb-3 border-b border-border pb-2">
              What you&rsquo;ll do
            </h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-2.5 font-serif text-base leading-relaxed">
                  <span className="text-brand mt-1.5 shrink-0">
                    <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold mb-3 border-b border-border pb-2">
              What we&rsquo;re looking for
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex gap-2.5 font-serif text-base leading-relaxed">
                  <Check className="h-4 w-4 text-brand mt-1 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Nice-to-haves */}
          {job.niceToHaves && job.niceToHaves.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display text-xl font-bold mb-3 border-b border-border pb-2">
                Nice to have
              </h2>
              <ul className="space-y-2">
                {job.niceToHaves.map((r, i) => (
                  <li key={i} className="flex gap-2.5 font-serif text-base leading-relaxed text-ink-secondary">
                    <span className="text-ink-tertiary mt-1.5 shrink-0">
                      <span className="block h-1.5 w-1.5 rounded-full bg-ink-tertiary" />
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-bold mb-3 border-b border-border pb-2">
              What we offer
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {job.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-md bg-surface-alt"
                >
                  <Check className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <span className="font-serif text-sm leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Application form */}
          <section id="apply" className="mt-12 pt-8 border-t border-border">
            <h2 className="font-display text-2xl font-bold mb-2">Apply for this role</h2>
            <p className="font-serif text-base text-ink-secondary mb-6">
              Fill out the form below. We&rsquo;ll review your application and
              respond within two weeks.
            </p>

            {applied ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-lg border border-border bg-surface-alt text-center"
              >
                <div className="h-14 w-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">
                  Application received.
                </h3>
                <p className="font-serif text-base text-ink-secondary max-w-md mx-auto">
                  Thank you for applying for the {job.title} position. We&rsquo;ll
                  review your application and respond within two weeks. In the
                  meantime, please check your email for a confirmation.
                </p>
                <button
                  onClick={() => navigate({ type: "careers" })}
                  className="mt-6 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
                >
                  Browse more positions
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={onApply}
                className="p-6 md:p-8 rounded-lg border border-border bg-surface-alt"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Full name" required>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                  <FormField label="Email address" required>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                  <FormField label="Phone number">
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                  <FormField label="City / Location">
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                  <FormField label="LinkedIn profile URL">
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedinUrl}
                      onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                  <FormField label="Portfolio URL">
                    <input
                      type="url"
                      placeholder="https://"
                      value={form.portfolioUrl}
                      onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
                      className="career-input"
                    />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField label="Resume / CV (PDF, max 5MB)" required>
                    <div className="career-input flex items-center justify-between cursor-pointer hover:border-foreground/30 transition-colors relative">
                      <span className="text-ink-tertiary text-sm truncate">
                        {resumePath || "Choose a file or drag it here"}
                      </span>
                      <span className="px-3 py-1 rounded border border-border bg-background font-ui text-xs font-semibold shrink-0">
                        Browse
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        required
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) onUploadResume(f);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField label="Cover letter">
                    <textarea
                      rows={5}
                      placeholder="Tell us why you'd be a great fit for this role."
                      value={form.coverLetter}
                      onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                      className="career-input resize-none h-auto"
                    />
                  </FormField>
                </div>

                <div className="mt-4">
                  <FormField label="How did you hear about us?">
                    <select
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value })}
                      className="career-input"
                    >
                      <option value="">Select…</option>
                      <option>Our website</option>
                      <option>LinkedIn</option>
                      <option>Twitter / X</option>
                      <option>From a current employee</option>
                      <option>Other</option>
                    </select>
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 inline-flex items-center gap-2 px-6 h-12 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit application
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="font-ui text-[11px] text-ink-tertiary mt-3">
                  By submitting, you agree to our privacy policy. We&rsquo;ll only
                  use this information to evaluate your application.
                </p>
              </form>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-4">
            <div className="p-5 rounded-lg border border-border bg-surface-alt">
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                Role summary
              </p>
              <dl className="space-y-3 font-ui text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-tertiary">Department</dt>
                  <dd className="font-medium text-right">{job.department}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-tertiary">Location</dt>
                  <dd className="font-medium text-right">{job.location}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-tertiary">Type</dt>
                  <dd className="font-medium text-right">{job.type}</dd>
                </div>
              </dl>
              <button
                onClick={() =>
                  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors"
              >
                Apply now
              </button>
            </div>

            <div className="p-5 rounded-lg border border-border">
              <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                Other open positions
              </p>
              <ul className="space-y-2">
                {JOBS.filter((j) => j.id !== job.id).slice(0, 4).map((j) => (
                  <li key={j.id}>
                    <button
                      onClick={() => navigate({ type: "career-detail", slug: j.slug })}
                      className="group block w-full text-left p-2 -mx-2 rounded hover:bg-muted transition-colors"
                    >
                      <p className="font-display text-sm font-bold leading-tight group-hover:text-brand transition-colors line-clamp-1">
                        {j.title}
                      </p>
                      <p className="font-ui text-[11px] text-ink-tertiary mt-0.5">
                        {j.department} · {j.location}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky apply button */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 p-3 bg-background/95 backdrop-blur border-t border-border">
        <button
          onClick={() =>
            document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
          }
          className="w-full h-12 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors"
        >
          Apply for this role
        </button>
      </div>

      <style jsx global>{`
        .career-input {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border-radius: 6px;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--foreground);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        textarea.career-input {
          height: auto;
          padding: 10px 12px;
          line-height: 1.5;
        }
        .career-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.2);
        }
        .career-input::placeholder {
          color: var(--ink-tertiary);
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}

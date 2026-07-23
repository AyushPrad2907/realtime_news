"use client";

import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/store";
import { JOBS } from "@/lib/mock-data";
import { fetchJobs } from "@/lib/api-client";
import { ArrowRight, MapPin, Briefcase, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Job } from "@/lib/types";

const DEPARTMENTS = ["All", "Editorial", "Tech", "Sales", "Operations"] as const;
const TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"] as const;

export function CareersPage() {
  const { navigate } = useStore();
  const [department, setDepartment] = useState<(typeof DEPARTMENTS)[number]>("All");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [jobs, setJobs] = useState<Job[]>(JOBS);

  // Fetch from API in background
  useEffect(() => {
    const id = setTimeout(() => {
      fetchJobs().then((data) => {
        if (data.length > 0) setJobs(data);
      });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (department !== "All" && j.department !== department) return false;
      if (type !== "All" && j.type !== type) return false;
      return true;
    });
  }, [jobs, department, type]);


  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1600&h=900&fit=crop&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 py-16 md:py-24">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light mb-4">
            Careers
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.05]">
            Join our team.
          </h1>
          <p className="font-serif text-lg md:text-xl text-background/75 mt-5 max-w-2xl">
            We&rsquo;re building the country&rsquo;s most trusted newsroom — one
            story at a time. If you believe in serious journalism, in
            independence, and in the work of getting it right, we&rsquo;d love
            to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-ui text-sm text-background/80">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {JOBS.length} open positions
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              Editorial · Tech · Sales · Operations
            </span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-background">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                title: "Independence",
                body: "Our editorial is independent — from owners, advertisers, and the powerful. Our reporters answer only to their editors, and our editors to our readers.",
              },
              {
                title: "Rigour",
                body: "We take accuracy seriously. Every fact is checked, every claim sourced, every correction published. The work is hard because the work matters.",
              },
              {
                title: "Generosity",
                body: "We invest in our people — in training, in mentorship, in the time it takes to do the work well. We measure success in decades, not quarters.",
              },
            ].map((v) => (
              <div key={v.title}>
                <h3 className="font-display text-xl font-bold mb-2">{v.title}</h3>
                <p className="font-serif text-base text-ink-secondary leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-12 md:py-16 bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold">
              Open positions
            </h2>
            <span className="font-ui text-sm text-ink-secondary">
              {filtered.length} {filtered.length === 1 ? "role" : "roles"} available
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-background">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDepartment(d)}
                  className={cn(
                    "px-3 py-1.5 rounded font-ui text-xs font-medium transition-colors",
                    department === d
                      ? "bg-foreground text-background"
                      : "text-ink-secondary hover:text-foreground"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-background">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "px-3 py-1.5 rounded font-ui text-xs font-medium transition-colors",
                    type === t
                      ? "bg-foreground text-background"
                      : "text-ink-secondary hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-ui text-sm text-ink-secondary">
                  No positions match these filters right now.
                </p>
                <button
                  onClick={() => {
                    setDepartment("All");
                    setType("All");
                  }}
                  className="mt-3 px-4 h-10 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filtered.map((job) => (
                <button
                  key={job.id}
                  onClick={() => navigate({ type: "career-detail", slug: job.slug })}
                  className="group w-full text-left p-5 md:p-6 rounded-lg border border-border bg-background hover:border-foreground/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white bg-foreground">
                          {job.department}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-muted text-ink-secondary">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="font-display text-lg md:text-xl font-bold leading-tight group-hover:text-brand transition-colors">
                        {job.title}
                      </h3>
                      <p className="font-serif text-sm text-ink-secondary mt-1.5 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 font-ui text-xs text-ink-tertiary">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-ink-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Speculative */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Don&rsquo;t see your role?
          </h2>
          <p className="font-serif text-base text-ink-secondary mb-6">
            We&rsquo;re always interested in hearing from talented journalists,
            engineers, designers, and operators — even if there&rsquo;s no open
            position that fits. Send us a note and we&rsquo;ll be in touch if
            something comes up.
          </p>
          <button
            onClick={() => navigate({ type: "contact" })}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
          >
            Send us a note
          </button>
        </div>
      </section>
    </div>
  );
}

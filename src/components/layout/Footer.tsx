"use client";

import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/mock-data";
import { Twitter, Facebook, Instagram, Youtube, Send, Rss } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/api-client";
import { useT } from "@/hooks/use-t";

export function Footer() {
  const { navigate } = useStore();
  const t = useT();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const ok = await subscribeNewsletter(email);
    setSubmitting(false);
    if (ok) {
      toast.success("You're in! Check your inbox.");
      setEmail("");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="mt-16 md:mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-12 md:py-16">
        {/* Top: brand + newsletter mini */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-extrabold">
              News<span className="text-brand-light">varta</span>
            </div>
            <p className="mt-3 font-ui text-sm text-white/70 leading-relaxed max-w-xs">
              Trusted journalism, every hour. Independent reporting on the stories that shape the nation — and the world beyond it.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {[
                { Icon: Twitter, label: "Twitter / X" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Send, label: "Telegram" },
                { Icon: Rss, label: "RSS" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-display text-lg font-bold mb-1">
              Never Miss a Story.
            </h4>
            <p className="font-ui text-sm text-white/70 mb-4">
              The morning briefing, every weekday at 7 AM. Free, no spam.
            </p>
            <form
              onSubmit={onSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 h-11 px-4 rounded-md bg-white/5 border border-white/15 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-5 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting ? "…" : t("misc.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Middle: nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-white/10">
          <div>
            <h5 className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50 mb-3">
              {t("misc.more")}
            </h5>
            <ul className="space-y-2">
              {[
                { label: t("misc.aboutUs"), view: { type: "about" as const } },
                { label: t("misc.contact"), view: { type: "contact" as const } },
                { label: t("misc.advertise"), view: { type: "advertise" as const } },
                { label: t("misc.careers"), view: { type: "careers" as const } },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="font-ui text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50 mb-3">
              {t("misc.sections")}
            </h5>
            <ul className="space-y-2">
              {[
                { label: t("nav.live"), view: { type: "section" as const, slug: "live" as const } },
                { label: t("nav.breaking"), view: { type: "section" as const, slug: "breaking" as const } },
                { label: t("nav.national"), view: { type: "section" as const, slug: "national" as const } },
                { label: t("nav.international"), view: { type: "section" as const, slug: "international" as const } },
                { label: t("nav.podcasts"), view: { type: "section" as const, slug: "podcasts" as const } },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="font-ui text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50 mb-3">
              Categories
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => navigate({ type: "category", slug: c.slug })}
                    className="font-ui text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-ui text-[11px] font-bold uppercase tracking-wider text-white/50 mb-3">
              Legal
            </h5>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", view: { type: "privacy" as const } },
                { label: "Terms of Service", view: { type: "terms" as const } },
                { label: "Editorial Policy", view: { type: "about" as const } },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="font-ui text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="font-ui text-xs text-white/60">
            © {new Date().getFullYear()} Newsvarta. All rights reserved.
          </p>
          <p className="font-ui text-xs text-white/60">
            A demo news portal interface — built for illustrative purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

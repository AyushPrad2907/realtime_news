"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

export function Newsletter() {
  const t = useT();
  const mounted = useHydrated();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    const ok = await subscribeNewsletter(email);
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
      toast.success(t("misc.subscribeSuccess"));
    } else {
      toast.error(t("misc.subscribeError"));
    }
  };

  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-foreground text-background rounded-xl p-6 md:p-12 text-center">
        <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
          {t("misc.newsletterTitle")}
        </h2>
        <p className="font-serif text-base md:text-lg text-background/75 mt-3 max-w-xl mx-auto">
          {t("misc.newsletterDesc")}
        </p>

        {submitted ? (
          <div className="mt-6 max-w-md mx-auto">
            <p className="font-display text-xl font-bold text-background">
              {t("misc.subscribeSuccess")}
            </p>
            <p className="font-ui text-sm text-background/70 mt-2">
              {t("misc.confirmationSent")} <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("misc.emailPlaceholder")}
              aria-label="Email address"
              className="flex-1 h-12 px-4 rounded-md bg-white/10 border border-white/15 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-brand-light font-ui text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="h-12 px-6 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("misc.subscribing")}
                </>
              ) : (
                t("misc.subscribe")
              )}
            </button>
          </form>
        )}

        <p className="font-ui text-[11px] text-background/50 mt-4">
          {t("misc.noSpam")}
        </p>
      </div>
    </section>
  );
}

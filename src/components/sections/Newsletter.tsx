"use client";

import { useState } from "react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    toast.success("You're in! Check your inbox.");
  };

  return (
    <section className="mb-12 md:mb-16">
      <div className="bg-foreground text-background rounded-xl p-6 md:p-12 text-center">
        <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight">
          Never Miss a Story.
        </h2>
        <p className="font-serif text-base md:text-lg text-background/75 mt-3 max-w-xl mx-auto">
          The morning briefing, delivered to your inbox every weekday at 7 AM.
          The day&rsquo;s top stories, contextualised by our editors — in twenty
          minutes or less.
        </p>

        {submitted ? (
          <div className="mt-6 max-w-md mx-auto">
            <p className="font-display text-xl font-bold text-background">
              You&rsquo;re in! Check your inbox.
            </p>
            <p className="font-ui text-sm text-background/70 mt-2">
              We&rsquo;ve sent a confirmation link to <strong>{email}</strong>.
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
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 h-12 px-4 rounded-md bg-white/10 border border-white/15 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-brand-light font-ui text-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="font-ui text-[11px] text-background/50 mt-4">
          Free, no spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

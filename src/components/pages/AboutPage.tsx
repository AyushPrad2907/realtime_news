"use client";

import { useStore } from "@/lib/store";
import { AUTHORS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export function AboutPage() {
  const { navigate } = useStore();

  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-16 md:py-24">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light mb-4">
            About Us
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.05]">
            Journalism that holds power to account — and the reader above all.
          </h1>
          <p className="font-serif text-lg md:text-xl text-background/75 mt-6 max-w-2xl">
            The National Dispatch is an independent news organisation reporting on
            the stories that shape the nation. We are owned by no conglomerate,
            aligned with no party, and answerable — above all — to our readers.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-3xl font-bold mb-4">Our mission</h2>
          <div className="font-serif text-lg leading-relaxed space-y-5">
            <p>
              We believe that serious journalism — patient, accurate, and
              independent — is a public good. It holds power to account, gives
              voice to the voiceless, and equips citizens to make informed
              decisions about their lives and their country.
            </p>
            <p>
              We exist to do that work, every day, without compromise. Our
              reporters are given the time to dig, the resources to travel, and
              the editorial support to get it right. We are not interested in
              the heat of the moment — we are interested in the truth of the
              story.
            </p>
            <p>
              We are independent — from owners, advertisers, and the powerful.
              Our editorial is decided by our editors, not by our business team,
              not by our board, and not by the government of the day. Our
              corrections are public, our standards are published, and our
              funding model is transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "2014", label: "Founded" },
              { value: "180+", label: "Journalists" },
              { value: "12M+", label: "Monthly readers" },
              { value: "4.2M", label: "Newsletter subscribers" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl md:text-4xl font-extrabold">
                  {s.value}
                </div>
                <div className="font-ui text-xs text-ink-secondary mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial team */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <h2 className="font-display text-3xl font-bold mb-2 text-center">
            Our editorial team
          </h2>
          <p className="font-serif text-lg text-ink-secondary text-center mb-10 max-w-2xl mx-auto">
            Senior journalists leading our coverage across beats.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTHORS.map((author) => (
              <div
                key={author.id}
                className="p-5 rounded-lg border border-border bg-surface-alt"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-16 w-16 rounded-full object-cover mb-3"
                />
                <h3 className="font-display text-lg font-bold">{author.name}</h3>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-brand mb-2">
                  {author.role}
                </p>
                <p className="font-serif text-sm text-ink-secondary leading-relaxed">
                  {author.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-12 md:py-16 bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-3xl font-bold mb-4">Our standards</h2>
          <div className="font-serif text-lg leading-relaxed space-y-5">
            <p>
              We publish our editorial standards — and we hold ourselves to
              them. They cover sourcing, conflicts of interest, corrections,
              and the line between news and opinion.
            </p>
            <ul className="space-y-2 font-ui text-base pl-0">
              {[
                "We attribute every claim to a named source wherever possible.",
                "We publish corrections promptly and prominently.",
                "We do not accept payment for coverage, in any form.",
                "Our opinion section is clearly separated from our news reporting.",
                "We disclose any potential conflicts of interest to our readers.",
                "We do not publish unverified information, regardless of competitive pressure.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-brand mt-2 shrink-0">
                    <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 md:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Support our journalism.
          </h2>
          <p className="font-serif text-base text-ink-secondary mb-6">
            Independent journalism depends on the support of its readers.
            Subscribe to our newsletter, share our stories, or get in touch
            with our team.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate({ type: "home" })}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold"
            >
              Read our reporting
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate({ type: "contact" })}
              className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
            >
              Contact us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

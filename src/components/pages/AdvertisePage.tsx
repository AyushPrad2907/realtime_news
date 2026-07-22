"use client";

import { useState } from "react";
import {
  AUDIENCE_STATS,
  ADVERTISE_BENEFITS,
  AD_FORMATS,
  ADVERTISE_PROCESS,
  ADVERTISE_FAQ,
} from "@/lib/mock-data";
import {
  ArrowRight,
  Check,
  Users,
  Eye,
  TrendingUp,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STAT_ICONS = [Users, Eye, TrendingUp, Clock];

export function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Inquiry received! We'll be in touch within 1 business day.");
    setTimeout(() => {
      document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-8 py-16 md:py-24 text-center">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light mb-4">
            Advertise With Us
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.05]">
            Reach millions of engaged readers.
          </h1>
          <p className="font-serif text-lg md:text-xl text-background/75 mt-5 max-w-2xl mx-auto">
            The National Dispatch reaches the country&rsquo;s most engaged,
            informed, and influential readers. Your brand deserves to be seen
            alongside the journalism they trust.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#inquiry-form"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#formats"
              className="inline-flex items-center gap-2 px-6 h-12 rounded-md border border-white/20 hover:bg-white/5 text-background font-ui text-sm font-semibold transition-colors"
            >
              View ad formats
            </a>
          </div>
        </div>
      </section>

      {/* Audience stats */}
      <section className="py-12 md:py-16 bg-background">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {AUDIENCE_STATS.map((stat, i) => {
              const Icon = STAT_ICONS[i];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="text-center p-6 rounded-lg border border-border bg-surface-alt"
                >
                  <Icon className="h-6 w-6 text-brand mx-auto mb-3" />
                  <div className="font-display text-3xl md:text-4xl font-extrabold">
                    {stat.value}
                  </div>
                  <div className="font-ui text-xs text-ink-secondary mt-1.5">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why advertise here */}
      <section className="py-12 md:py-16 bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-2">
            Why advertise with us?
          </h2>
          <p className="font-serif text-lg text-ink-secondary text-center max-w-2xl mx-auto mb-10 md:mb-12">
            We treat your brand the way we treat our journalism — with care,
            transparency, and respect for the reader.
          </p>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {ADVERTISE_BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-6 rounded-lg border border-border bg-background"
              >
                <div className="h-10 w-10 rounded-md bg-brand/10 text-brand flex items-center justify-center mb-4 font-display text-lg font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{b.title}</h3>
                <p className="font-serif text-sm text-ink-secondary leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad formats */}
      <section id="formats" className="py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-2">
            Available ad formats
          </h2>
          <p className="font-serif text-lg text-ink-secondary text-center max-w-2xl mx-auto mb-10 md:mb-12">
            Choose the format that fits your objective — from display to native,
            podcast to newsletter.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AD_FORMATS.map((fmt) => (
              <div
                key={fmt.name}
                className="p-5 rounded-lg border border-border hover:border-foreground/30 transition-colors"
              >
                <h3 className="font-display text-lg font-bold mb-1">{fmt.name}</h3>
                <p className="font-ui text-[11px] text-brand font-semibold uppercase tracking-wide mb-3">
                  {fmt.dimensions}
                </p>
                <p className="font-serif text-sm text-ink-secondary mb-3 leading-relaxed">
                  {fmt.description}
                </p>
                <p className="font-ui text-xs text-ink-tertiary">
                  <span className="font-semibold text-ink-secondary">Placement:</span>{" "}
                  {fmt.placement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 bg-surface-alt">
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-10 md:mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-5 md:gap-6 relative">
            {ADVERTISE_PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="relative"
              >
                <div className="h-12 w-12 rounded-full bg-brand text-white font-display text-xl font-bold flex items-center justify-center mb-4 mx-auto md:mx-0">
                  {p.step}
                </div>
                <h3 className="font-display text-lg font-bold mb-2 text-center md:text-left">
                  {p.title}
                </h3>
                <p className="font-serif text-sm text-ink-secondary leading-relaxed text-center md:text-left">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-2">
            Frequently asked questions
          </h2>
          <p className="font-serif text-lg text-ink-secondary text-center mb-10">
            Can&rsquo;t find what you&rsquo;re looking for? Get in touch below.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {ADVERTISE_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="font-display text-base font-bold text-left py-5 hover:no-underline hover:text-brand">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-serif text-base text-ink-secondary leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry-form" className="py-12 md:py-16 bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-center mb-2">
            Get in touch
          </h2>
          <p className="font-serif text-lg text-background/75 text-center mb-10">
            Tell us a little about your campaign. We&rsquo;ll get back to you
            within one business day.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-lg border border-white/15 bg-white/5 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto mb-4">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">
                Inquiry received.
              </h3>
              <p className="font-serif text-base text-background/80 max-w-md mx-auto">
                Thank you for your interest. A member of our partnerships team
                will be in touch within one business day to set up an
                introductory call.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-5 h-11 rounded-md border border-white/20 hover:bg-white/5 font-ui text-sm font-semibold transition-colors"
              >
                Submit another inquiry
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="p-6 md:p-8 rounded-lg border border-white/15 bg-white/5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" required>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    className="form-input"
                  />
                </Field>
                <Field label="Email address" required>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="form-input"
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    type="tel"
                    autoComplete="tel"
                    className="form-input"
                  />
                </Field>
                <Field label="Company / brand" required>
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    className="form-input"
                  />
                </Field>
                <Field label="Website URL">
                  <input
                    type="url"
                    placeholder="https://"
                    className="form-input"
                  />
                </Field>
                <Field label="Monthly budget">
                  <select className="form-input">
                    <option value="">Select range</option>
                    <option>Under ₹1 lakh</option>
                    <option>₹1 – 5 lakh</option>
                    <option>₹5 – 20 lakh</option>
                    <option>₹20 lakh – 1 crore</option>
                    <option>₹1 crore+</option>
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Interested ad formats">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {AD_FORMATS.map((f) => (
                      <label
                        key={f.name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/5 cursor-pointer font-ui text-xs"
                      >
                        <input
                          type="checkbox"
                          className="h-3 w-3 accent-brand"
                        />
                        {f.name}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Campaign start date">
                  <input type="date" className="form-input" />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Message / additional notes">
                  <textarea
                    rows={4}
                    placeholder="Tell us about your campaign objectives, target audience, and timeline."
                    className="form-input resize-none"
                  />
                </Field>
              </div>

              <button
                type="submit"
                className="mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-md bg-brand hover:bg-brand-light text-white font-ui text-sm font-semibold transition-colors"
              >
                Submit inquiry
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="font-ui text-[11px] text-background/50 mt-3">
                By submitting, you agree to our privacy policy. We&rsquo;ll only
                use this information to respond to your inquiry.
              </p>
            </form>
          )}
        </div>
      </section>

      <style jsx global>{`
        .form-input {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--background);
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        textarea.form-input {
          height: auto;
          padding: 10px 12px;
          line-height: 1.5;
        }
        .form-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.3);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

function Field({
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
      <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-background/80 mb-1.5">
        {label} {required && <span className="text-brand-light">*</span>}
      </label>
      {children}
    </div>
  );
}

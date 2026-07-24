"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { submitContact } from "@/lib/api-client";
import { t } from "@/lib/i18n";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStore } from "@/lib/store";

export function ContactPage() {
  const { language } = useStore();
  const mounted = useHydrated();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await submitContact(form);
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
      toast.success(t(language, "misc.messageSent"));
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-8 pt-6 md:pt-10 pb-12">
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
          {mounted && language === "hi" ? "संपर्क करें" : "Contact Us"}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          {mounted && language === "hi" ? "हमारी टीम से संपर्क करें।" : "Get in touch with our team."}
        </h1>
        <p className="font-serif text-lg text-ink-secondary leading-relaxed">
          {mounted && language === "hi" ? "क्या आपके पास कोई सुझाव, सुधार या प्रश्न है? हमें आपसे सुनना अच्छा लगेगा। नीचे सही संपर्क चुनें, या हमें संदेश भेजें।" : "Have a tip, a correction, or a question? We'd love to hear from you. Choose the right contact below, or send us a message and we'll route it to the right desk."}
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12">
        {/* Contact channels */}
        <aside className="space-y-4">
          {[
            {
              Icon: Mail,
              label: "Editorial",
              detail: "tips@nationaldispatch.example",
              desc: "Story tips, corrections, and editorial feedback.",
            },
            {
              Icon: Phone,
              label: "Newsroom desk",
              detail: "+91 11 0000 0000",
              desc: "For urgent, time-sensitive stories — 24/7.",
            },
            {
              Icon: Mail,
              label: "Advertising",
              detail: "partnerships@nationaldispatch.example",
              desc: "For advertising and partnership inquiries.",
            },
            {
              Icon: Mail,
              label: "Careers",
              detail: "careers@nationaldispatch.example",
              desc: "For job applications and recruitment questions.",
            },
            {
              Icon: MapPin,
              label: "Newsroom",
              detail: "Press Enclave, New Delhi 110001",
              desc: "Our editorial headquarters. Visits by appointment.",
            },
          ].map(({ Icon, label, detail, desc }) => (
            <div
              key={label}
              className="p-4 rounded-lg border border-border bg-surface-alt flex items-start gap-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-0.5">
                  {label}
                </p>
                <p className="font-display text-base font-bold leading-tight break-words">
                  {detail}
                </p>
                <p className="font-serif text-sm text-ink-secondary mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-lg border border-border bg-surface-alt text-center"
            >
              <div className="h-14 w-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-4">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">
                {mounted && language === "hi" ? "संदेश भेजा गया।" : "Message sent."}
              </h3>
              <p className="font-serif text-base text-ink-secondary max-w-md mx-auto">
                Thank you for reaching out. We&rsquo;ll respond within two
                business days. For urgent matters, please call our newsroom
                desk.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-5 h-11 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
              >
                {mounted && language === "hi" ? "एक और संदेश भेजें" : "Send another message"}
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="p-6 md:p-8 rounded-lg border border-border bg-surface-alt"
            >
              <h2 className="font-display text-xl font-bold mb-1">
                {mounted && language === "hi" ? "हमें एक संदेश भेजें" : "Send us a message"}
              </h2>
              <p className="font-ui text-sm text-ink-secondary mb-6">
                {mounted && language === "hi" ? "हम आपका संदेश सही टीम तक पहुंचाएंगे।" : "We'll route your message to the right team."}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <ContactField label={mounted && language === "hi" ? "पूरा नाम" : "Full name"} required>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="contact-input"
                  />
                </ContactField>
                <ContactField label={mounted && language === "hi" ? "ईमेल पता" : "Email address"} required>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="contact-input"
                  />
                </ContactField>
              </div>

              <div className="mt-4">
                <ContactField label={mounted && language === "hi" ? "विषय" : "Subject"} required>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="contact-input"
                  >
                    <option value="">Select a subject…</option>
                    <option>Story tip</option>
                    <option>Correction</option>
                    <option>Editorial feedback</option>
                    <option>Advertising inquiry</option>
                    <option>Careers</option>
                    <option>Other</option>
                  </select>
                </ContactField>
              </div>

              <div className="mt-4">
                <ContactField label={mounted && language === "hi" ? "संदेश" : "Message"} required>
                  <textarea
                    required
                    rows={6}
                    placeholder={mounted && language === "hi" ? "हमें बताएं कि आपके दिमाग में क्या है।" : "Tell us what's on your mind."}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="contact-input resize-none h-auto"
                  />
                </ContactField>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex items-center gap-2 px-6 h-12 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? (mounted && language === "hi" ? "भेजा जा रहा है…" : "Sending…") : (mounted && language === "hi" ? "संदेश भेजें" : "Send message")}
              </button>
              <p className="font-ui text-[11px] text-ink-tertiary mt-3">
                By submitting, you agree to our privacy policy. We&rsquo;ll only
                use this information to respond to your message.
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        .contact-input {
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
        textarea.contact-input {
          height: auto;
          padding: 10px 12px;
          line-height: 1.5;
        }
        .contact-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.2);
        }
        .contact-input::placeholder {
          color: var(--ink-tertiary);
        }
      `}</style>
    </div>
  );
}

function ContactField({
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
      {children}
    </div>
  );
}

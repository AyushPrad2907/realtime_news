"use client";

import { useStore } from "@/lib/store";
import { CATEGORIES, INDIAN_STATES } from "@/lib/mock-data";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const PRIMARY_LINKS = [
  { label: "Home", view: { type: "home" as const } },
  { label: "Live", view: { type: "section" as const, slug: "live" as const } },
  { label: "Breaking", view: { type: "section" as const, slug: "breaking" as const } },
  { label: "National", view: { type: "section" as const, slug: "national" as const } },
  { label: "International", view: { type: "section" as const, slug: "international" as const } },
  { label: "Podcasts", view: { type: "section" as const, slug: "podcasts" as const } },
];

const UTILITY_LINKS = [
  { label: "About Us", view: { type: "about" as const } },
  { label: "Contact", view: { type: "contact" as const } },
  { label: "Advertise With Us", view: { type: "advertise" as const } },
  { label: "Careers", view: { type: "careers" as const } },
  { label: "Privacy Policy", view: { type: "privacy" as const } },
  { label: "Terms of Service", view: { type: "terms" as const } },
];

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen, navigate } = useStore();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/60 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-sm bg-background md:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-border">
              <span className="font-display text-lg font-extrabold">
                News<span className="text-brand">varta</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto styled-scroll px-5 py-6">
              {/* Primary nav */}
              <div className="space-y-1">
                <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                  Sections
                </p>
                {PRIMARY_LINKS.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => navigate(l.view)}
                    className="w-full flex items-center justify-between py-2.5 px-2 -mx-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <span className="font-display text-xl font-bold">{l.label}</span>
                    <ChevronRight className="h-4 w-4 text-ink-tertiary" />
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-8 space-y-1">
                <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => navigate({ type: "category", slug: c.slug })}
                      className="flex items-center gap-2 py-2 px-2 -mx-0 rounded-md hover:bg-muted transition-colors text-left"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: c.colorVar }}
                      />
                      <span className="font-ui text-sm">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State news */}
              <div className="mt-8 space-y-1">
                <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                  State News
                </p>
                <div className="flex flex-wrap gap-2">
                  {INDIAN_STATES.slice(0, 10).map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-full bg-muted font-ui text-xs text-ink-secondary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Utility */}
              <div className="mt-8 space-y-1">
                <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3">
                  More
                </p>
                {UTILITY_LINKS.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => navigate(l.view)}
                    className="block w-full py-2 px-2 -mx-2 rounded-md hover:bg-muted transition-colors text-left font-ui text-sm"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

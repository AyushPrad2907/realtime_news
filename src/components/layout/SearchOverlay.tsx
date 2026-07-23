"use client";

import { useStore } from "@/lib/store";
import { ARTICLES_LIST, CATEGORIES, TRENDING_TOPICS } from "@/lib/mock-data";
import { Search, X, TrendingUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, useRef } from "react";
import { getCategory } from "@/lib/utils-news";
import { cn } from "@/lib/utils";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, navigate } = useStore();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      // Defer state reset to avoid calling setState synchronously in effect
      setTimeout(() => {
        setQuery("");
        setActiveIndex(0);
      }, 0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen, searchOpen]);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return ARTICLES_LIST.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.standfirst.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [query]);

  const categoryMatches = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
  }, [query]);

  const totalResults = suggestions.length + categoryMatches.length;

  const submitSearch = () => {
    if (!query.trim()) return;
    navigate({ type: "search", query: query.trim() });
  };

  const selectSuggestion = (slug: string) => {
    navigate({ type: "article", slug });
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 z-[100] mx-auto max-w-2xl mt-4 md:mt-20 px-4"
          >
            <div className="bg-background rounded-lg shadow-2xl border border-border overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
                <Search className="h-5 w-5 text-ink-tertiary shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (totalResults > 0 && activeIndex < suggestions.length) {
                        selectSuggestion(suggestions[activeIndex].slug);
                      } else if (totalResults > 0 && activeIndex >= suggestions.length) {
                        const cat = categoryMatches[activeIndex - suggestions.length];
                        if (cat) navigate({ type: "category", slug: cat.slug });
                      } else {
                        submitSearch();
                      }
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, Math.max(0, totalResults - 1)));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    }
                  }}
                  placeholder="Search articles, categories, topics..."
                  className="flex-1 bg-transparent outline-none font-ui text-base placeholder:text-ink-tertiary"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[70vh] overflow-y-auto styled-scroll">
                {query.trim().length === 0 ? (
                  <div className="p-5">
                    <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-3 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" /> Trending searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_TOPICS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70 font-ui text-xs text-ink-secondary hover:text-foreground transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : totalResults === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-ui text-sm text-ink-secondary">
                      No suggestions for &ldquo;{query}&rdquo;
                    </p>
                    <button
                      onClick={submitSearch}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm transition-colors"
                    >
                      Search for &ldquo;{query}&rdquo;
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-2">
                    {suggestions.length > 0 && (
                      <div>
                        <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary px-3 pt-2 pb-1">
                          Articles
                        </p>
                        {suggestions.map((a, i) => {
                          const cat = getCategory(a.category);
                          return (
                            <button
                              key={a.id}
                              onClick={() => selectSuggestion(a.slug)}
                              onMouseEnter={() => setActiveIndex(i)}
                              className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                                activeIndex === i ? "bg-muted" : "hover:bg-muted/60"
                              )}
                            >
                              <div
                                className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-white"
                                style={{ background: cat.colorVar }}
                              >
                                {cat.name}
                              </div>
                              <span className="font-ui text-sm text-foreground line-clamp-1">
                                {a.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {categoryMatches.length > 0 && (
                      <div className="mt-2">
                        <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary px-3 pt-2 pb-1">
                          Categories
                        </p>
                        {categoryMatches.map((c, i) => (
                          <button
                            key={c.slug}
                            onClick={() => navigate({ type: "category", slug: c.slug })}
                            onMouseEnter={() => setActiveIndex(suggestions.length + i)}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-md text-left transition-colors",
                              activeIndex === suggestions.length + i ? "bg-muted" : "hover:bg-muted/60"
                            )}
                          >
                            <span className="font-ui text-sm">{c.name}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-ink-tertiary" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-border mt-2 pt-1">
                      <button
                        onClick={submitSearch}
                        className="w-full flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        <span className="font-ui text-sm text-brand">
                          See all results for &ldquo;{query}&rdquo;
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-brand" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

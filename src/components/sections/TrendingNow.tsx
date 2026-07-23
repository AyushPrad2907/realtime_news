"use client";

import { useStore } from "@/lib/store";
import { ARTICLES_LIST } from "@/lib/mock-data";
import { useMemo } from "react";
import { getCategory } from "@/lib/utils-news";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { Article } from "@/lib/types";
import { useT } from "@/hooks/use-t";

interface TrendingNowProps {
  articles?: Article[];
}

export function TrendingNow({ articles: articleProp }: TrendingNowProps) {
  const { navigate } = useStore();
  const t = useT();
  const list = articleProp ?? ARTICLES_LIST;

  // Sort by views (as a proxy for trending)
  const trending = useMemo(
    () => [...list].sort((a, b) => b.views - a.views).slice(0, 10),
    [list]
  );

  if (trending.length === 0) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6 border-b border-border pb-3">
        <h2 className="h-section flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand" />
          {t("section.trendingNow")}
        </h2>
      </div>

      <ol className="grid md:grid-cols-2 gap-x-10 gap-y-0">
        {trending.map((article, i) => {
          const cat = getCategory(article.category);
          return (
            <motion.li
              key={article.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <button
                onClick={() => navigate({ type: "article", slug: article.slug })}
                className="group w-full flex items-baseline gap-4 py-3.5 border-b border-border text-left"
              >
                <span className="font-display text-3xl md:text-4xl font-extrabold text-ink-tertiary/40 group-hover:text-brand transition-colors tabular-nums leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-ui text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: cat.colorVar }}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <p className="font-display text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                    {article.title}
                  </p>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

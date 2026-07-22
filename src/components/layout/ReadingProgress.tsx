"use client";

import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function ReadingProgress() {
  const { current, setReadingProgress, readingProgress } = useStore();

  useEffect(() => {
    if (current.type !== "article") {
      setReadingProgress(0);
      return;
    }
    const onScroll = () => {
      const article = document.querySelector("article") as HTMLElement | null;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewport = window.innerHeight;
      const scrolled = window.scrollY - articleTop + viewport * 0.4;
      const progress = Math.max(0, Math.min(1, scrolled / articleHeight));
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [current, setReadingProgress]);

  if (current.type !== "article") return null;

  return (
    <div
      className="reading-progress"
      style={{ width: `${readingProgress * 100}%` }}
      aria-hidden="true"
    />
  );
}

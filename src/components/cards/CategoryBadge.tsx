"use client";

import { useStore } from "@/lib/store";
import type { CategorySlug } from "@/lib/types";
import { getCategory } from "@/lib/utils-news";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  slug: CategorySlug;
  size?: "sm" | "md";
  className?: string;
  clickable?: boolean;
}

export function CategoryBadge({
  slug,
  size = "sm",
  className,
  clickable = true,
}: CategoryBadgeProps) {
  const cat = getCategory(slug);
  const { navigate } = useStore();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  } as const;

  return (
    <button
      disabled={!clickable}
      onClick={(e) => {
        e.stopPropagation();
        navigate({ type: "category", slug });
      }}
      className={cn(
        "inline-flex items-center rounded text-white font-ui font-semibold uppercase tracking-wide transition-opacity hover:opacity-85",
        sizeClasses[size],
        className
      )}
      style={{ background: cat.colorVar }}
    >
      {cat.name}
    </button>
  );
}

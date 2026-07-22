"use client";

import { cn } from "@/lib/utils";

interface AdBannerProps {
  format: "leaderboard" | "rectangle" | "mobile-banner" | "native";
  className?: string;
  label?: string;
}

export function AdBanner({ format, className, label = "Advertisement" }: AdBannerProps) {
  const sizes = {
    leaderboard: "h-[90px] md:h-[90px]",
    rectangle: "h-[250px] md:w-[300px]",
    "mobile-banner": "h-[50px] md:hidden",
    native: "min-h-[120px]",
  };

  return (
    <div
      className={cn(
        "w-full bg-surface-alt border border-border/60 rounded-md flex items-center justify-center relative",
        sizes[format],
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      <span className="absolute top-1.5 right-2 font-ui text-[9px] uppercase tracking-wider text-ink-tertiary">
        {label}
      </span>
      <div className="text-center">
        <p className="font-ui text-xs text-ink-tertiary">Ad placement</p>
        <p className="font-ui text-[10px] text-ink-tertiary/70 mt-0.5 uppercase tracking-wide">
          {format}
        </p>
      </div>
    </div>
  );
}

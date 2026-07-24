"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/hooks/use-t";
import { useHydrated } from "@/hooks/use-hydrated";

interface AdBannerProps {
  format: "leaderboard" | "rectangle" | "mobile-banner" | "native";
  className?: string;
  label?: string;
}

export function AdBanner({ format, className, label }: AdBannerProps) {
  const t = useT();
  const mounted = useHydrated();
  const sizes = {
    leaderboard: "h-[90px] md:h-[90px]",
    rectangle: "h-[250px] md:w-[300px]",
    "mobile-banner": "h-[50px] md:hidden",
    native: "min-h-[120px]",
  };

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "w-full bg-surface-alt border border-border/60 rounded-md flex items-center justify-center relative",
        sizes[format],
        className
      )}
      role="complementary"
      aria-label={t("misc.advertisement")}
    >
      <span className="absolute top-1.5 right-2 font-ui text-[9px] uppercase tracking-wider text-ink-tertiary">
        {label || t("misc.advertisement")}
      </span>
      <div className="text-center">
        <p className="font-ui text-xs text-ink-tertiary">{t("misc.adPlacement")}</p>
        <p className="font-ui text-[10px] text-ink-tertiary/70 mt-0.5 uppercase tracking-wide">
          {format}
        </p>
      </div>
    </div>
  );
}

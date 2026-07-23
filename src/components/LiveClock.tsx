"use client";

import { useEffect, useState } from "react";

/**
 * Displays the current date and time, updating every second.
 *
 * Renders a stable placeholder on SSR + initial client render (to avoid
 * hydration mismatches), then switches to the live clock after mount.
 */
export function LiveClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Defer initial setNow to avoid setState-in-effect lint rule
    const initId = setTimeout(() => setNow(new Date()), 0);
    const tickId = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(initId);
      clearInterval(tickId);
    };
  }, []);

  if (!now) {
    // SSR + initial render placeholder — stable, no hydration mismatch
    return (
      <span className="font-ui text-[11px] text-ink-tertiary tabular-nums">
        {compact ? "—" : "Loading…"}
      </span>
    );
  }

  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (compact) {
    return (
      <span className="font-ui text-[11px] text-ink-tertiary tabular-nums whitespace-nowrap">
        {dateStr} · {timeStr}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="font-ui text-[11px] font-semibold text-ink-secondary tabular-nums">
        {dateStr}
      </span>
      <span className="font-ui text-[11px] text-ink-tertiary tabular-nums">
        {timeStr} IST
      </span>
    </div>
  );
}

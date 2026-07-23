"use client";

import { useEffect, useState } from "react";
import { timeAgo, formatDate } from "@/lib/utils-news";

/**
 * Renders a stable date string on SSR and initial client render (preventing
 * hydration mismatches), then switches to relative "X min ago" / "X hr ago"
 * format after the component mounts on the client.
 *
 * The `dateString` prop should be an ISO timestamp.
 */
export function TimeAgo({ iso }: { iso: string }) {
  // Start with a deterministic format (same on server and client)
  const [display, setDisplay] = useState(() =>
    formatDate(iso, { day: "numeric", month: "short" })
  );

  // After mount, switch to relative time
  useEffect(() => {
    setDisplay(timeAgo(iso));
  }, [iso]);

  return <>{display}</>;
}
